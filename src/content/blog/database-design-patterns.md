---
title: "Database Design Patterns for Scalable Applications"
description: "Essential database patterns, indexing strategies, and optimization techniques for building high-performance systems"
pubDate: 2025-07-10T00:00:00Z
author: "Adam Maulana"
image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop"
tags: ["Database", "PostgreSQL", "System Design", "Performance", "Architecture"]
draft: false
---

## Why Database Design Matters

Bad database design cost me 2 weeks of refactoring and angry users. Good design scales effortlessly. Here's what I learned building systems handling millions of records.

## Core Design Principles

### 1. Normalization vs Denormalization

**Normalization (OLTP)** - Remove redundancy

```sql
-- Normalized: Users and Orders separate
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Query requires JOIN
SELECT u.name, o.total
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.status = 'completed';
```

**Denormalization (OLAP)** - Optimize for reads

```sql
-- Denormalized: Duplicate user data for fast queries
CREATE TABLE orders_denormalized (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  user_name VARCHAR(255) NOT NULL,  -- Duplicated
  user_email VARCHAR(255) NOT NULL, -- Duplicated
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- No JOIN needed
SELECT user_name, total
FROM orders_denormalized
WHERE status = 'completed';
```

**When to denormalize:**
- Read-heavy workloads
- JOINs causing performance issues
- Data rarely changes
- Analytics/reporting queries

### 2. Indexing Strategies

**B-Tree Index** (default, most common)

```sql
-- Simple index
CREATE INDEX idx_orders_status ON orders(status);

-- Composite index (order matters!)
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- Works for:
WHERE user_id = '...' AND status = '...'  ✅
WHERE user_id = '...'                      ✅
WHERE status = '...'                       ❌ (doesn't use index efficiently)
```

**Partial Index** (smaller, faster)

```sql
-- Only index active orders
CREATE INDEX idx_active_orders ON orders(created_at)
WHERE status IN ('pending', 'processing');

-- Query must match the WHERE condition
SELECT * FROM orders
WHERE status = 'pending'
AND created_at > NOW() - INTERVAL '7 days';  ✅
```

**Expression Index**

```sql
-- Index on computed values
CREATE INDEX idx_users_lower_email ON users(LOWER(email));

-- Now case-insensitive search is fast
SELECT * FROM users WHERE LOWER(email) = 'user@example.com';
```

**JSONB Index** (PostgreSQL)

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  metadata JSONB
);

-- GIN index for JSONB
CREATE INDEX idx_products_metadata ON products USING GIN(metadata);

-- Fast JSONB queries
SELECT * FROM products WHERE metadata @> '{"category": "electronics"}';
SELECT * FROM products WHERE metadata ? 'brand';
```

### 3. Partitioning for Scale

**Range Partitioning** (time-series data)

```sql
-- Parent table
CREATE TABLE events (
  id UUID NOT NULL,
  user_id UUID NOT NULL,
  event_type VARCHAR(50),
  created_at TIMESTAMP NOT NULL
) PARTITION BY RANGE (created_at);

-- Partitions by month
CREATE TABLE events_2025_01 PARTITION OF events
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE events_2025_02 PARTITION OF events
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

CREATE TABLE events_2025_03 PARTITION OF events
  FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');

-- Queries automatically use correct partition
SELECT * FROM events
WHERE created_at >= '2025-02-15'
AND created_at < '2025-02-20';  -- Only scans events_2025_02
```

**List Partitioning** (categorical data)

```sql
CREATE TABLE orders (
  id UUID NOT NULL,
  region VARCHAR(50) NOT NULL,
  total DECIMAL(10, 2)
) PARTITION BY LIST (region);

CREATE TABLE orders_us PARTITION OF orders
  FOR VALUES IN ('US', 'USA', 'United States');

CREATE TABLE orders_eu PARTITION OF orders
  FOR VALUES IN ('UK', 'FR', 'DE', 'IT', 'ES');

CREATE TABLE orders_asia PARTITION OF orders
  FOR VALUES IN ('JP', 'CN', 'IN', 'SG');
```

### 4. Efficient Queries

**Use EXPLAIN ANALYZE**

```sql
-- See actual execution plan
EXPLAIN ANALYZE
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5;

-- Output shows:
-- - Index usage
-- - Join methods
-- - Actual execution time
-- - Row estimates vs actual
```

**Avoid N+1 Queries**

```typescript
// ❌ Bad: N+1 queries
async function getOrdersWithUsers(orderIds: string[]) {
  const orders = await db.query('SELECT * FROM orders WHERE id = ANY($1)', [orderIds]);

  for (const order of orders) {
    // N queries!
    order.user = await db.query('SELECT * FROM users WHERE id = $1', [order.user_id]);
  }

  return orders;
}

// ✅ Good: Single query with JOIN
async function getOrdersWithUsers(orderIds: string[]) {
  return db.query(`
    SELECT
      o.*,
      json_build_object('id', u.id, 'name', u.name, 'email', u.email) as user
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.id = ANY($1)
  `, [orderIds]);
}
```

**Pagination Best Practices**

```sql
-- ❌ Bad: OFFSET gets slower with large offsets
SELECT * FROM products
ORDER BY created_at DESC
LIMIT 20 OFFSET 10000;  -- Scans 10,020 rows

-- ✅ Good: Keyset pagination
SELECT * FROM products
WHERE created_at < $1  -- Last seen timestamp
ORDER BY created_at DESC
LIMIT 20;

-- Or use cursor-based
SELECT * FROM products
WHERE id > $1  -- Last seen ID
ORDER BY id
LIMIT 20;
```

## Advanced Patterns

### 1. Soft Deletes

```sql
-- Add deleted_at column
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP;

-- Create index excluding deleted
CREATE INDEX idx_active_users ON users(created_at)
WHERE deleted_at IS NULL;

-- "Delete" user
UPDATE users SET deleted_at = NOW() WHERE id = $1;

-- Query only active users
SELECT * FROM users WHERE deleted_at IS NULL;
```

### 2. Optimistic Locking

```sql
-- Add version column
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  price DECIMAL(10, 2),
  version INTEGER NOT NULL DEFAULT 0
);

-- Update with version check
UPDATE products
SET
  price = $1,
  version = version + 1
WHERE id = $2 AND version = $3
RETURNING *;

-- If affected rows = 0, someone else modified it
```

TypeScript implementation:

```typescript
async function updateProduct(id: string, updates: Partial<Product>, currentVersion: number) {
  const result = await db.query(`
    UPDATE products
    SET
      name = COALESCE($1, name),
      price = COALESCE($2, price),
      version = version + 1
    WHERE id = $3 AND version = $4
    RETURNING *
  `, [updates.name, updates.price, id, currentVersion]);

  if (result.rows.length === 0) {
    throw new Error('Product was modified by another user');
  }

  return result.rows[0];
}
```

### 3. Audit Trail

```sql
-- Main table
CREATE TABLE accounts (
  id UUID PRIMARY KEY,
  balance DECIMAL(10, 2) NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Audit table
CREATE TABLE accounts_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL,
  old_balance DECIMAL(10, 2),
  new_balance DECIMAL(10, 2),
  changed_by UUID,
  changed_at TIMESTAMP DEFAULT NOW()
);

-- Trigger to record changes
CREATE OR REPLACE FUNCTION audit_account_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO accounts_audit (account_id, old_balance, new_balance, changed_by)
  VALUES (NEW.id, OLD.balance, NEW.balance, current_setting('app.user_id', true)::UUID);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER account_audit_trigger
AFTER UPDATE ON accounts
FOR EACH ROW
EXECUTE FUNCTION audit_account_changes();
```

### 4. Full-Text Search

```sql
-- Add tsvector column
ALTER TABLE articles ADD COLUMN search_vector tsvector;

-- Create GIN index
CREATE INDEX idx_articles_search ON articles USING GIN(search_vector);

-- Update search vector
UPDATE articles SET search_vector =
  to_tsvector('english',
    coalesce(title, '') || ' ' ||
    coalesce(content, '') || ' ' ||
    coalesce(author, '')
  );

-- Trigger to keep it updated
CREATE FUNCTION articles_search_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    coalesce(NEW.title, '') || ' ' ||
    coalesce(NEW.content, '') || ' ' ||
    coalesce(NEW.author, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_search_update
BEFORE INSERT OR UPDATE ON articles
FOR EACH ROW EXECUTE FUNCTION articles_search_trigger();

-- Search query with ranking
SELECT
  id,
  title,
  ts_rank(search_vector, query) AS rank
FROM articles, plainto_tsquery('english', 'typescript react') query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 10;
```

### 5. Connection Pooling

```typescript
import { Pool } from 'pg';

// Create pool
const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,                    // Max connections
  idleTimeoutMillis: 30000,   // Close idle connections
  connectionTimeoutMillis: 2000,
});

// Use transactions properly
async function transferMoney(fromId: string, toId: string, amount: number) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Deduct from sender
    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
      [amount, fromId]
    );

    // Add to receiver
    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
      [amount, toId]
    );

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();  // Always release!
  }
}
```

## Monitoring & Optimization

### 1. Identify Slow Queries

```sql
-- Enable pg_stat_statements
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Find slow queries
SELECT
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Find most frequent queries
SELECT
  query,
  calls,
  total_exec_time
FROM pg_stat_statements
ORDER BY calls DESC
LIMIT 10;
```

### 2. Check Index Usage

```sql
-- Find unused indexes
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as scans
FROM pg_stat_user_indexes
WHERE idx_scan = 0
AND indexname NOT LIKE 'pg_toast%'
ORDER BY pg_relation_size(indexrelid) DESC;

-- Find duplicate indexes
SELECT
  pg_size_pretty(sum(pg_relation_size(idx))::bigint) as size,
  (array_agg(idx))[1] as idx1,
  (array_agg(idx))[2] as idx2,
  (array_agg(idx))[3] as idx3
FROM (
  SELECT
    indexrelid::regclass as idx,
    indrelid,
    indkey
  FROM pg_index
) sub
GROUP BY indrelid, indkey
HAVING count(*) > 1;
```

### 3. Monitor Performance

```typescript
// Prometheus metrics for queries
import { Histogram } from 'prom-client';

const queryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Database query duration',
  labelNames: ['query_name']
});

async function measureQuery<T>(name: string, query: () => Promise<T>): Promise<T> {
  const end = queryDuration.startTimer({ query_name: name });
  try {
    return await query();
  } finally {
    end();
  }
}

// Usage
const users = await measureQuery('get_users', () =>
  db.query('SELECT * FROM users WHERE active = true')
);
```

## Real-World Results

Applied these patterns to our e-commerce platform:

### Before
- Query time: 2.5s average
- Database CPU: 85% constant
- Connection pool exhausted daily
- Manual query optimization needed

### After
- Query time: 120ms average (95% reduction)
- Database CPU: 30% average
- Zero connection issues
- Auto-optimized with proper indexes

## Database Design Checklist

- [ ] Normalized schema (3NF minimum)
- [ ] Indexes on foreign keys
- [ ] Indexes on WHERE/ORDER BY columns
- [ ] Partitioning for large tables (>10M rows)
- [ ] Connection pooling configured
- [ ] Slow query logging enabled
- [ ] Regular VACUUM and ANALYZE
- [ ] Backup strategy in place
- [ ] Monitoring and alerting setup

## Conclusion

Good database design is invisible. It just works. Key principles:

1. **Normalize first**, denormalize only when needed
2. **Index strategically** - not too few, not too many
3. **Partition large tables** before they become a problem
4. **Monitor continuously** - measure everything
5. **Use transactions** correctly
6. **Pool connections** - never connect per query

Remember: Schema changes are expensive. Get it right early.

Happy querying! 🗄️
