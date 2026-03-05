---
name: expert-react
description: >
  Expert-level React development guidance. Activate this skill whenever the user
  mentions React, components, hooks, JSX, Zustand, React Query, or any frontend
  task built with React. Covers architecture, latest React features (React 19+),
  state management with Zustand, server-state with TanStack Query (React Query),
  performance, accessibility, testing, and code quality standards.
---

## Activation

Use this skill for **any task involving React**: creating components, refactoring, debugging, architecture decisions, hooks, state management, data fetching, routing, forms, performance optimisation, or any React-adjacent library (Zustand, TanStack Query, React Router, React Hook Form, Zod, etc.).

**Always pair with** `.github/skills/frontend-design/SKILL.md` when the task involves UI, visual design, styling, layout, or any user-facing interface work. Design and engineering must be treated as a single concern — never do one without the other.

---

## Core Principles

### 1. Functional Components & Hooks Only
Never use class components. All logic lives in hooks. Components are pure, declarative, and focused on rendering.

### 2. Latest React (React 19+)
Leverage the most current stable React APIs and patterns:
- `use()` hook for consuming promises and context
- `useOptimistic` for optimistic UI updates
- React Server Components (RSC) where the framework supports them
- `useTransition` / `startTransition` for non-urgent state updates
- `useDeferredValue` for deferring expensive renders
- `useId` for stable unique IDs (accessibility, forms)
- `useActionState` (formerly `useFormState`) for form handling
- `useFormStatus` for pending form states
- `forwardRef` — prefer passing refs as regular props in React 19
- Strict Mode always enabled in development

### 3. Composition Over Configuration
Prefer small, composable components. Favour slot-based patterns (children, render props) over prop-drilling or overly generic mega-components.

### 4. Co-location
Keep state, logic, and styles as close as possible to where they are used. Only lift state when genuinely shared.

---

## Code Quality Standards

### Comments & Documentation
- **No unnecessary comments.** Code must be self-explanatory through clear naming.
- **No inline narrative comments** — these are noise.
- **Use JSDoc** for:
  - Exported functions, hooks, and utilities that form a public API
  - Complex type signatures that benefit from structured param/return docs
  - Non-obvious business logic where the *why* is not evident from the code
- JSDoc example:

```ts
/**
 * Fetches paginated product listings with optional category filter.
 * @param params - Query parameters including page, limit, and category
 * @returns Paginated product data with cursor for next page
 */
export function useProducts(params: ProductQueryParams) { ... }
```

- **Never** document the obvious. A JSDoc of "Gets the user" on `getUser()` is noise.

### Naming
- Components: `PascalCase`
- Hooks: `use` prefix, camelCase (`useCartStore`, `useProductList`)
- Event handlers: `handle` prefix (`handleSubmit`, `handleClose`)
- Boolean props/variables: `is`, `has`, `should` prefix (`isLoading`, `hasError`)
- Constants: `UPPER_SNAKE_CASE` for module-level, `camelCase` for local

### TypeScript
- Strict TypeScript always (`"strict": true`)
- Prefer `interface` for component props; `type` for unions, intersections, helpers
- Avoid `any` — use `unknown` + type guards or proper generics
- Infer types where obvious; annotate where inference is ambiguous
- Co-locate prop types with their component

---

## Project Integrity Rule

**Every change must keep the project in a working state.**

Before finishing any task:
1. Ensure the TypeScript compiler reports no new errors (`tsc --noEmit`)
2. Ensure the dev server starts without errors
3. Ensure changed components render without runtime crashes
4. If tests exist, they must pass
5. Never leave half-implemented imports, missing dependencies, or broken exports

When making surgical edits (refactors, adding features), validate the full import/export chain of touched modules. If a change breaks a dependency, fix it in the same turn.

---

## State Management — Zustand

### When to Use Zustand
- **Client-side global state** shared across multiple unrelated components
- UI state that survives navigation (sidebar open, theme, cart, user preferences)
- Complex local state that regular `useState` makes unwieldy

### Store Structure
One store per domain slice. Never one giant global store.

```ts
// stores/useCartStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  quantity: number
  price: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  total: number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clearCart: () => set({ items: [] }),
      get total() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      },
    }),
    { name: 'cart-storage' }
  )
)
```

### Zustand Best Practices
- Use **selectors** to subscribe to slices — prevents unnecessary re-renders:
  ```ts
  const items = useCartStore((s) => s.items)  // correct
  const store = useCartStore()                  // wrong: re-renders on any change
  ```
- Use `immer` middleware for complex nested state mutations
- Use `persist` middleware for state that should survive page refresh
- Use `subscribeWithSelector` when you need reactive side effects outside React
- Never mutate state directly — always return new state objects
- Avoid storing derived data — compute it in selectors or `useMemo`

---

## Server State — TanStack Query (React Query v5)

### When to Use TanStack Query
- **All async server data**: fetching, caching, synchronisation, background refetching
- Mutations that update server state and need cache invalidation
- Pagination, infinite scroll, prefetching, dependent queries

### Setup

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})
```

### Query Keys
Use structured, hierarchical query keys co-located with their queries:

```ts
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
}
```

### Custom Query Hooks
Always encapsulate queries in custom hooks — never call `useQuery` directly in components:

```ts
export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productApi.getProducts(filters),
    placeholderData: keepPreviousData,
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getProduct(id),
    enabled: Boolean(id),
  })
}
```

### Mutations with Cache Invalidation

```ts
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productApi.updateProduct,
    onSuccess: (updated) => {
      queryClient.setQueryData(productKeys.detail(updated.id), updated)
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}
```

### Optimistic Updates

```ts
export function useToggleFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productApi.toggleFavorite,
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: productKeys.detail(productId) })
      const previous = queryClient.getQueryData(productKeys.detail(productId))
      queryClient.setQueryData(productKeys.detail(productId), (old: Product) => ({
        ...old,
        isFavorite: !old.isFavorite,
      }))
      return { previous }
    },
    onError: (_err, productId, context) => {
      queryClient.setQueryData(productKeys.detail(productId), context?.previous)
    },
    onSettled: (_, __, productId) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) })
    },
  })
}
```

### TanStack Query Best Practices
- Use `staleTime` aggressively — most data does not need constant refetching
- Separate server state (TanStack Query) from client state (Zustand/useState) strictly
- Never duplicate server data into Zustand — read from the cache directly
- Use `<Suspense>` boundaries for cleaner loading states when appropriate
- Prefetch on hover/route change for perceived performance

---

## Component Architecture

### File Structure

```
src/
  components/         shared, reusable UI components
  features/           domain-specific feature modules
    products/
      components/
      hooks/
      queries/        query hooks + keys
      stores/         zustand stores if needed
      types.ts
      index.ts        public API of the feature
  hooks/              shared custom hooks
  lib/                third-party config, api clients
  stores/             global zustand stores
  types/              global type definitions
  pages/
```

### Component Template

```tsx
interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  className?: string
}

export function ProductCard({ product, onAddToCart, className }: ProductCardProps) {
  const handleAddToCart = () => onAddToCart?.(product)

  return (
    <article className={className}>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <button onClick={handleAddToCart} type="button">
        Add to cart
      </button>
    </article>
  )
}
```

### Rules
- One component per file
- Export named, not default (enables better refactoring and IDE support)
- Extract complex JSX into well-named sub-components rather than inline logic
- Avoid prop drilling beyond 2 levels — use context, Zustand, or component composition

---

## Hooks Guidelines

- Custom hooks must start with `use`
- Use `useCallback` and `useMemo` only when genuinely needed — profile first
- Use `useReducer` when state transitions are complex and need isolated testing
- Always clean up effects: timers, subscriptions, abort controllers

```ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
```

---

## Forms

Use **React Hook Form** + **Zod** for all non-trivial forms:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
})

type LoginForm = z.infer<typeof schema>

export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: LoginForm) => {
    // submission logic
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit" disabled={isSubmitting}>Login</button>
    </form>
  )
}
```

---

## Performance

- Lazy-load routes and heavy components with `React.lazy` + `<Suspense>`
- Profile with React DevTools Profiler before optimising
- Virtualise long lists with TanStack Virtual
- Use `useTransition` to keep UI responsive during heavy state updates

---

## Error Handling

- Use Error Boundaries (`react-error-boundary`) to contain crashes
- Every async operation must handle errors — never swallow them silently
- Expose errors to the user or log them appropriately

---

## Accessibility

- Semantic HTML first: `<button>`, `<nav>`, `<main>`, `<article>`, `<section>`
- All interactive elements must be keyboard-navigable
- Use `aria-*` only when semantic HTML is insufficient
- Manage focus explicitly after modals/dialogs open/close
- Images: meaningful `alt` text; decorative images use `alt=""`

---

## Design Integration

**This skill always operates alongside `.github/skills/frontend-design/SKILL.md`.**

When implementing any UI component or page:
1. Apply the frontend-design skill for aesthetic direction, typography, colour, motion, and layout
2. Ensure React component structure supports the design
3. Use CSS Modules, Tailwind, or styled-components consistently per project convention
4. Animation: prefer the **Motion** library (`motion/react`) for React; CSS transitions for simple cases
5. Never sacrifice design quality for quick solutions — both code and design must be production-grade

---

## What to Avoid

- Class components
- `any` type
- Default exports from component files
- Inline styles beyond truly dynamic values
- `useEffect` for data fetching — use TanStack Query
- Storing server data in Zustand
- Unnecessary comments that document the obvious
- `console.log` left in production code
- Mutating state or props directly
- Over-engineering with abstractions before the need is clear