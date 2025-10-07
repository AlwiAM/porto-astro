---
title: "React Performance Optimization: From Slow to Lightning Fast"
description: "Practical techniques to identify and fix React performance bottlenecks in production applications"
pubDate: 2025-06-01T00:00:00Z
author: "Adam Maulana"
image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop"
tags: ["React", "Performance", "Optimization", "Web Development", "JavaScript"]
draft: false
---

## The Performance Problem

I once built a React dashboard that took 8 seconds to load. Users complained, bounce rates skyrocketed. Here's how I reduced it to 800ms and the lessons learned.

## Measuring Performance First

**Rule #1**: Never optimize without measuring.

### Tools I Use

```typescript
// 1. React DevTools Profiler
// Enable in development
import { Profiler } from 'react';

function onRenderCallback(
  id: string,
  phase: "mount" | "update",
  actualDuration: number,
) {
  console.log(`${id} (${phase}): ${actualDuration}ms`);
}

<Profiler id="Dashboard" onRender={onRenderCallback}>
  <Dashboard />
</Profiler>

// 2. Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);

// 3. Performance API
const start = performance.now();
await fetchData();
const end = performance.now();
console.log(`Fetch took ${end - start}ms`);
```

## Common Performance Killers

### 1. Unnecessary Re-renders

**Before (slow):**

```typescript
function UserList({ users }: { users: User[] }) {
  const [search, setSearch] = useState('');

  // Every keystroke re-renders ALL users
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      {filteredUsers.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </>
  );
}
```

**After (fast):**

```typescript
// 1. Memoize expensive calculations
function UserList({ users }: { users: User[] }) {
  const [search, setSearch] = useState('');

  const filteredUsers = useMemo(
    () => users.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase())
    ),
    [users, search]
  );

  return (
    <>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      {filteredUsers.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </>
  );
}

// 2. Memoize components
const UserCard = memo(({ user }: { user: User }) => {
  console.log('UserCard render:', user.id);
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});
```

### 2. Expensive Calculations

**Before (slow):**

```typescript
function Dashboard({ data }: { data: DataPoint[] }) {
  // Runs on EVERY render, even when data hasn't changed
  const stats = {
    total: data.reduce((sum, d) => sum + d.value, 0),
    average: data.reduce((sum, d) => sum + d.value, 0) / data.length,
    max: Math.max(...data.map(d => d.value)),
    min: Math.min(...data.map(d => d.value))
  };

  return <StatsDisplay {...stats} />;
}
```

**After (fast):**

```typescript
function Dashboard({ data }: { data: DataPoint[] }) {
  const stats = useMemo(() => {
    const values = data.map(d => d.value);
    const total = values.reduce((sum, v) => sum + v, 0);

    return {
      total,
      average: total / data.length,
      max: Math.max(...values),
      min: Math.min(...values)
    };
  }, [data]);

  return <StatsDisplay {...stats} />;
}
```

### 3. Large Lists Without Virtualization

**Before (slow):**

```typescript
function MessageList({ messages }: { messages: Message[] }) {
  // Rendering 10,000+ DOM nodes = 💥
  return (
    <div className="messages">
      {messages.map(msg => (
        <MessageItem key={msg.id} message={msg} />
      ))}
    </div>
  );
}
```

**After (fast):**

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function MessageList({ messages }: { messages: Message[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Estimated height per item
    overscan: 5 // Render 5 extra items for smooth scrolling
  });

  return (
    <div ref={parentRef} className="messages" style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={messages[virtualItem.index].id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`
            }}
          >
            <MessageItem message={messages[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 4. Inefficient State Updates

**Before (slow):**

```typescript
function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const toggleTodo = (id: string) => {
    // Creates new array on every toggle
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const addTodo = (text: string) => {
    setTodos([...todos, { id: Date.now().toString(), text, completed: false }]);
  };

  return (
    <>
      <TodoList todos={todos} onToggle={toggleTodo} />
      <AddTodoForm onAdd={addTodo} />
    </>
  );
}
```

**After (fast):**

```typescript
import { useImmerReducer } from 'use-immer';

type Action =
  | { type: 'ADD_TODO'; text: string }
  | { type: 'TOGGLE_TODO'; id: string }
  | { type: 'DELETE_TODO'; id: string };

function todoReducer(draft: Todo[], action: Action) {
  switch (action.type) {
    case 'ADD_TODO':
      draft.push({
        id: Date.now().toString(),
        text: action.text,
        completed: false
      });
      break;
    case 'TOGGLE_TODO':
      const todo = draft.find(t => t.id === action.id);
      if (todo) todo.completed = !todo.completed;
      break;
    case 'DELETE_TODO':
      return draft.filter(t => t.id !== action.id);
  }
}

function TodoApp() {
  const [todos, dispatch] = useImmerReducer(todoReducer, []);

  // Memoized callbacks
  const toggleTodo = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_TODO', id });
  }, []);

  const addTodo = useCallback((text: string) => {
    dispatch({ type: 'ADD_TODO', text });
  }, []);

  return (
    <>
      <TodoList todos={todos} onToggle={toggleTodo} />
      <AddTodoForm onAdd={addTodo} />
    </>
  );
}
```

## Advanced Optimization Techniques

### 1. Code Splitting

```typescript
// Lazy load heavy components
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));
const Analytics = lazy(() => import('./Analytics'));
const Reports = lazy(() => import('./Reports'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Suspense>
  );
}

// Preload on hover for better UX
<Link
  to="/dashboard"
  onMouseEnter={() => import('./Dashboard')}
>
  Dashboard
</Link>
```

### 2. Concurrent Features (React 19)

```typescript
import { useTransition } from 'react';

function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    setQuery(value); // Urgent: Update input immediately

    // Non-urgent: Update results
    startTransition(() => {
      const filtered = searchDatabase(value);
      setResults(filtered);
    });
  };

  return (
    <>
      <input
        value={query}
        onChange={e => handleSearch(e.target.value)}
      />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </>
  );
}
```

### 3. Web Workers for Heavy Computation

```typescript
// worker.ts
self.addEventListener('message', (e) => {
  const { data, type } = e.data;

  if (type === 'PROCESS_DATA') {
    const result = heavyCalculation(data);
    self.postMessage({ type: 'RESULT', result });
  }
});

// Component
function DataProcessor({ data }: { data: number[] }) {
  const [result, setResult] = useState<number[]>([]);

  useEffect(() => {
    const worker = new Worker(new URL('./worker.ts', import.meta.url));

    worker.postMessage({ type: 'PROCESS_DATA', data });

    worker.onmessage = (e) => {
      if (e.data.type === 'RESULT') {
        setResult(e.data.result);
      }
    };

    return () => worker.terminate();
  }, [data]);

  return <Chart data={result} />;
}
```

### 4. Optimize Context Usage

**Before (slow):**

```typescript
// Every state change re-renders ALL consumers
const AppContext = createContext<AppState | undefined>(undefined);

function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme, notifications, setNotifications }}>
      {children}
    </AppContext.Provider>
  );
}
```

**After (fast):**

```typescript
// Split contexts by update frequency
const UserContext = createContext<UserState | undefined>(undefined);
const ThemeContext = createContext<ThemeState | undefined>(undefined);
const NotificationContext = createContext<NotificationState | undefined>(undefined);

function AppProvider({ children }: { children: ReactNode }) {
  const userState = useState<User | null>(null);
  const themeState = useState<'light' | 'dark'>('light');
  const notificationState = useState<Notification[]>([]);

  return (
    <UserContext.Provider value={userState}>
      <ThemeContext.Provider value={themeState}>
        <NotificationContext.Provider value={notificationState}>
          {children}
        </NotificationContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}

// Or use Zustand for better performance
import { create } from 'zustand';

const useStore = create<AppState>((set) => ({
  user: null,
  theme: 'light',
  notifications: [],
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
  addNotification: (notification) =>
    set((state) => ({ notifications: [...state.notifications, notification] }))
}));
```

## Real-World Results

After applying these optimizations to our dashboard:

### Metrics

- **Initial Load**: 8.2s → 800ms (90% reduction)
- **Time to Interactive**: 12s → 1.2s
- **Lighthouse Score**: 45 → 98
- **Bundle Size**: 2.8MB → 450KB
- **Re-render Count**: 340 → 18 per interaction

### Business Impact

- **Bounce Rate**: 45% → 8%
- **User Satisfaction**: +67%
- **Mobile Performance**: 2G network now usable
- **SEO Ranking**: Improved by 3 positions

## Performance Checklist

Use this before shipping:

- [ ] Measured performance with React DevTools Profiler
- [ ] Used `memo()` for expensive components
- [ ] Applied `useMemo()` for heavy calculations
- [ ] Applied `useCallback()` for event handlers
- [ ] Implemented virtualization for long lists (>100 items)
- [ ] Code-split routes and heavy components
- [ ] Optimized images (WebP, lazy loading)
- [ ] Debounced search/filter inputs
- [ ] Split context by update frequency
- [ ] Checked bundle size (webpack-bundle-analyzer)
- [ ] Tested on slow networks (Chrome DevTools throttling)

## Conclusion

React performance isn't magic. Key principles:

1. **Measure first** - Don't guess, profile
2. **Prevent re-renders** - Use memo, useMemo, useCallback
3. **Virtualize lists** - Don't render what's not visible
4. **Split code** - Load only what's needed
5. **Optimize state** - Right structure, right updates

Remember: Premature optimization is evil, but so is shipping slow apps. Find the balance.

Happy optimizing! ⚡
