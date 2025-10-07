---
title: "Microservices Architecture: From Monolith to Scale"
description: "A comprehensive guide to designing, building, and deploying microservices-based applications"
pubDate: 2025-05-20T00:00:00Z
author: "Adam Maulana"
image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop"
tags: ["Microservices", "System Design", "Architecture", "Docker", "Kubernetes"]
draft: false
---

## Why Microservices?

After building and maintaining several monolithic applications, I learned the hard way when to (and when not to) use microservices. Here's what 5+ years of experience taught me.

## When to Choose Microservices

### Good Candidates ✅

- **Large teams** (10+ developers)
- **Multiple business domains** (e-commerce: inventory, orders, payments)
- **Different scaling needs** (payment service needs 10x more resources)
- **Independent deployments** required
- **Technology diversity** needed (Python for ML, Go for performance)

### Stay Monolithic ❌

- **Small teams** (<5 developers)
- **Single domain** problem
- **Tight coupling** between features
- **Limited resources** for DevOps
- **MVP or prototype** stage

## Core Principles

### 1. Single Responsibility

Each service should do ONE thing well:

```
✅ Good:
- user-service (authentication, profiles)
- order-service (order management)
- payment-service (payment processing)

❌ Bad:
- core-service (everything)
- api-service (all endpoints)
```

### 2. Database per Service

Each service owns its data:

```typescript
// user-service/database
interface UserDB {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

// order-service/database
interface OrderDB {
  id: string;
  userId: string;  // Reference only, no JOIN
  items: OrderItem[];
  total: number;
}
```

### 3. API Gateway Pattern

Centralize routing and cross-cutting concerns:

```typescript
// gateway/routes.ts
import express from 'express';

const app = express();

// Authentication middleware
app.use(async (req, res, next) => {
  const token = req.headers.authorization;
  const user = await validateToken(token);
  req.user = user;
  next();
});

// Route to services
app.use('/api/users', proxyTo('http://user-service:3001'));
app.use('/api/orders', proxyTo('http://order-service:3002'));
app.use('/api/payments', proxyTo('http://payment-service:3003'));

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
```

## Communication Patterns

### Synchronous: REST/gRPC

For real-time request-response:

```typescript
// order-service calling payment-service
async function createOrder(orderData: CreateOrderDTO) {
  // 1. Create order
  const order = await db.orders.create(orderData);

  // 2. Process payment synchronously
  try {
    const payment = await fetch('http://payment-service/api/payments', {
      method: 'POST',
      body: JSON.stringify({
        orderId: order.id,
        amount: order.total,
        userId: order.userId
      })
    });

    if (!payment.ok) {
      // Rollback order
      await db.orders.delete(order.id);
      throw new Error('Payment failed');
    }

    return order;
  } catch (error) {
    await db.orders.delete(order.id);
    throw error;
  }
}
```

### Asynchronous: Message Queue

For eventual consistency and resilience:

```typescript
// Using RabbitMQ/Redis/Kafka
import { publishEvent, subscribeEvent } from './messageQueue';

// order-service: Publish event
async function createOrder(orderData: CreateOrderDTO) {
  const order = await db.orders.create({
    ...orderData,
    status: 'pending'
  });

  // Publish event for other services
  await publishEvent('order.created', {
    orderId: order.id,
    userId: order.userId,
    total: order.total
  });

  return order;
}

// payment-service: Subscribe to event
subscribeEvent('order.created', async (event) => {
  const { orderId, userId, total } = event;

  const payment = await processPayment(userId, total);

  // Publish result
  await publishEvent(
    payment.success ? 'payment.completed' : 'payment.failed',
    { orderId, paymentId: payment.id }
  );
});

// notification-service: Subscribe to event
subscribeEvent('payment.completed', async (event) => {
  await sendEmail(event.orderId, 'Payment successful!');
});
```

## Service Discovery

### Using Docker Compose (Development)

```yaml
version: '3.8'

services:
  api-gateway:
    build: ./gateway
    ports:
      - "3000:3000"
    environment:
      USER_SERVICE_URL: http://user-service:3001
      ORDER_SERVICE_URL: http://order-service:3002

  user-service:
    build: ./services/user
    ports:
      - "3001:3001"
    depends_on:
      - postgres-users

  order-service:
    build: ./services/order
    ports:
      - "3002:3002"
    depends_on:
      - postgres-orders
      - redis

  postgres-users:
    image: postgres:16
    environment:
      POSTGRES_DB: users

  postgres-orders:
    image: postgres:16
    environment:
      POSTGRES_DB: orders

  redis:
    image: redis:7-alpine
```

### Using Kubernetes (Production)

```yaml
# user-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: myregistry/user-service:latest
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: user-db-secret
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
  - port: 3001
    targetPort: 3001
  type: ClusterIP
```

## Monitoring & Observability

### Health Checks

```typescript
// Every service should have health endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

app.get('/health/ready', async (req, res) => {
  try {
    await db.raw('SELECT 1');
    res.json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: error.message });
  }
});
```

### Distributed Tracing

```typescript
// Using OpenTelemetry
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('order-service');

async function createOrder(orderData: CreateOrderDTO) {
  const span = tracer.startSpan('createOrder');

  try {
    // Add attributes
    span.setAttribute('user.id', orderData.userId);
    span.setAttribute('order.total', orderData.total);

    const order = await db.orders.create(orderData);

    // Child span for payment
    const paymentSpan = tracer.startSpan('processPayment', {
      parent: span
    });

    const payment = await processPayment(order);
    paymentSpan.end();

    span.setStatus({ code: SpanStatusCode.OK });
    return order;
  } catch (error) {
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message
    });
    throw error;
  } finally {
    span.end();
  }
}
```

### Centralized Logging

```typescript
// Structured logging with correlation IDs
import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: 'order-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Add correlation ID middleware
app.use((req, res, next) => {
  req.correlationId = req.headers['x-correlation-id'] || crypto.randomUUID();
  res.setHeader('x-correlation-id', req.correlationId);
  next();
});

// Log with correlation ID
logger.info('Order created', {
  correlationId: req.correlationId,
  orderId: order.id,
  userId: order.userId
});
```

## Common Challenges & Solutions

### 1. Data Consistency

**Problem**: Distributed transactions across services

**Solution**: Saga pattern

```typescript
// Order saga orchestrator
async function createOrderSaga(orderData: CreateOrderDTO) {
  const sagaId = crypto.randomUUID();
  const compensation: (() => Promise<void>)[] = [];

  try {
    // Step 1: Create order
    const order = await orderService.create(orderData);
    compensation.push(() => orderService.delete(order.id));

    // Step 2: Reserve inventory
    await inventoryService.reserve(order.items);
    compensation.push(() => inventoryService.release(order.items));

    // Step 3: Process payment
    const payment = await paymentService.charge(order.total);
    compensation.push(() => paymentService.refund(payment.id));

    // Success!
    await orderService.confirm(order.id);
    return order;

  } catch (error) {
    // Compensate in reverse order
    for (const compensate of compensation.reverse()) {
      await compensate().catch(err =>
        logger.error('Compensation failed', { sagaId, error: err })
      );
    }
    throw error;
  }
}
```

### 2. Service Discovery

**Problem**: Services need to find each other dynamically

**Solution**: Service mesh (Istio, Linkerd) or DNS-based discovery

### 3. Testing

**Problem**: Integration testing is complex

**Solution**: Contract testing + component testing

```typescript
// Contract test using Pact
import { Pact } from '@pact-foundation/pact';

describe('Order Service -> Payment Service', () => {
  const provider = new Pact({
    consumer: 'order-service',
    provider: 'payment-service'
  });

  it('should process payment successfully', async () => {
    await provider.addInteraction({
      state: 'user has valid payment method',
      uponReceiving: 'a payment request',
      withRequest: {
        method: 'POST',
        path: '/api/payments',
        body: { amount: 99.99, userId: 'user-123' }
      },
      willRespondWith: {
        status: 200,
        body: { paymentId: 'pay-456', status: 'completed' }
      }
    });

    // Test against contract
    const result = await orderService.processPayment({
      amount: 99.99,
      userId: 'user-123'
    });

    expect(result.status).toBe('completed');
  });
});
```

## Real-World Example: E-Learning Platform

I migrated our monolithic LMS to microservices. Here's the architecture:

### Services

1. **auth-service** - JWT tokens, OAuth
2. **user-service** - Profiles, enrollments
3. **course-service** - Course content, chapters
4. **submission-service** - Code submissions, grading
5. **notification-service** - Email, push notifications
6. **analytics-service** - Usage tracking, reports

### Results

- **Deployment frequency**: 1/month → 10/day
- **Bug fix time**: 2 days → 4 hours
- **Scalability**: Manual → Auto-scaling
- **Team productivity**: +40%
- **Downtime**: 99.5% → 99.9% uptime

## Conclusion

Microservices are powerful but complex. Key takeaways:

1. Start with a monolith, migrate when needed
2. Design for failure (circuit breakers, retries)
3. Invest in observability from day one
4. Automate everything (CI/CD, testing, deployment)
5. Document service contracts
6. Choose async communication when possible

Remember: Microservices solve organizational problems, not technical ones. If your team isn't growing, a monolith might be the right choice.

Happy architecting! 🏗️
