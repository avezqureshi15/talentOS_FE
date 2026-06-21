# Frontend Engineering Rules (STRICT - NON NEGOTIABLE)

---

## 1. Project Architecture

### MUST follow existing folder structure EXACTLY

```

src/
├── app/
│   ├── auth/
│   ├── chat/
│   │   ├── components/
│   │   ├── engine/
│   │   ├── hooks/
│   │   ├── pages/
│   │
│   ├── dashboard/
│   │   ├── hiring-requests/
│   │   │   ├── components/
│   │   │   ├── modals/
│   │   │   ├── table/
│   │   │   │   ├── table.tsx
│   │   │   │   ├── table.css
│   │   │   ├── pages/
│   │   │
│   │   ├── hiring-requests-detail/
│   │
│   ├── home/
│
├── assets/
├── components/
│   ├── shared/
│   ├── ui/
│   ├── Home.tsx
│
├── constants/
├── layouts/
├── router/
│   ├── protected-route.tsx
│   ├── routes.tsx
│
├── services/
├── store/
│   ├── chat.store.ts
│   ├── script.store.ts
│
├── utils/
├── App.tsx
├── App.css
├── main.tsx

```

---

## 2. Tech Stack Rules

- React (Vite + TypeScript)
- TanStack Query → server state ONLY
- Zustand → global/client state ONLY
- Axios → normal API calls
- Fetch → ONLY for streaming APIs (NDJSON)

---

## 3. Strict Type Safety

- ❌ NEVER use `any`
- ❌ No implicit types
- ❌ No inline complex types in components

- ✅ All types MUST be in `/types` each respective component must have their own types file component.types.ts , component.css , component.tsx , component.constants.ts
- ✅ Use type aliases
- ✅ API request/response must be typed

---

## 4. Constants Discipline

- ❌ No hardcoded strings in components
- ❌ No magic values

- ✅ All static content → `/constants`
  - API URLs
  - UI labels
  - query keys
  - enums

---

## 5. Styling Rules

- ❌ No inline styles
- ❌ No style objects inside TSX

- ✅ Each component must have:
  - Separate `.css` file
- ✅ Follow modular naming

---

## 6. Component Architecture (VERY STRICT)

### Components = PURE PRESENTATION

- Input → Props
- Output → JSX

#### ❌ Forbidden:
- API calls
- business logic
- data transformation
- streaming logic
- Zustand usage directly (unless UI state)

#### ✅ Allowed:
- rendering UI
- handling UI events (pass to hooks)

#### Constraints:
- Max 200 lines STRICT , if more that split into separate components 

---

## 7. Hooks Discipline (CRITICAL)

### General Rule:
ALL LOGIC MUST LIVE IN HOOKS

---

### useState Rules

- ❌ Avoid by default
- ❌ Never store API data
- ❌ Never duplicate TanStack/Zustand state

- ✅ Allowed ONLY for:
  - UI state (input, modal)
  
- ✅ MUST justify usage in comment

---

### useEffect Rules

- ❌ Avoid by default
- ❌ No data fetching
- ❌ No syncing logic

- ✅ Allowed ONLY for:
  - streaming subscriptions
  - event listeners
  - cleanup

- ✅ MUST include explanation comment

---

### Custom Hooks (MANDATORY)

Hooks MUST handle:
- API calls (via TanStack Query)
- Streaming logic
- Data transformation
- Business rules

---

## 8. State Management Rules

### TanStack Query

- Queries → GET
- Mutations → POST/PUT/DELETE
- Query keys MUST be in constants
- No inline query keys

---

### Zustand

- Keep minimal
- No API logic
- No heavy computation
- Use slices if needed

---

## 9. Services Layer

- ONLY API calls
- Axios instance required
- Centralized error handling

- ❌ No UI logic
- ❌ No state updates

---

## 10. Chat Streaming (CRITICAL)

API:
```

POST /api/v1/chat/stream
Content-Type: application/x-ndjson

```

### Rules:

- ❌ Do NOT use axios
- ✅ Use fetch with ReadableStream

### MUST implement:

- `ReadableStream`
- `TextDecoder`
- chunk parsing (line-by-line)

### ❌ Forbidden:

- treating response as JSON
- parsing entire response at once

---

## 11. Reusability & Design Patterns

- ❌ No duplicated logic
- ❌ No repeated UI

- ✅ Create reusable components in:
  - `/components/shared`
  - `/components/ui`

- ✅ Use patterns where needed:
  - Singleton (API client, store)
  - Factory (if required)
  - Composition over inheritance

---

## 12. Clean Code Rules

- No console.logs
- Small functions
- Meaningful names
- Separation of concerns

---

## 13. Package Manager

- ALWAYS use `pnpm`

## 14. Import & File Naming Conventions

- ✅ Always use `@/` alias for imports (e.g., `@/components/home/home`)
- ✅ Use snake_case or kebab-case for file and folder names
- ✅ Each component folder must have: `component.tsx`, `component.css`, `component.types.ts`, `component.constants.ts` (if needed)

---

## 15. Error Boundaries & Resilience (MANDATORY)

### Error Boundaries

- ✅ Root `<ErrorBoundary>` MUST wrap `<RouterProvider>` in `main.tsx`
- ✅ Route-level `errorElement` MUST be defined on all route groups
- ✅ Every page-level component MUST be wrapped in `<ErrorBoundary>`
- ✅ Suspense-prone areas (async data, lazy routes) MUST have `<Suspense>` with a `<LoadingSpinner fullPage />` fallback

### Loading States

- ✅ Any async operation MUST set an `isProcessing` / `isLoading` flag in the store
- ✅ UI components MUST consume loading flags to show visual feedback:
  - `<LoadingSpinner>` for indeterminate waits
  - Typing indicator for AI/chat responses
  - Disabled inputs/buttons during processing
- ✅ `/components/ui/loading-spinner` — reusable `<LoadingSpinner>`

### Error States

- ✅ Async operations MUST use try/catch and surface errors to the user
- ✅ Stores MUST have an `error` field for error messages
- ✅ `/components/ui/error-boundary` — reusable `<ErrorBoundary>` (class component with `componentDidCatch`)
- ✅ `/components/ui/error-fallback` — reusable `<ErrorFallback>` with retry button
- ❌ Never let an async error go unhandled (unhandled promise rejection)
- ❌ Never show raw error messages to users — use friendly fallbacks

### Components Provided

| Component | Location | Purpose |
|---|---|---|
| `<ErrorBoundary>` | `@/components/ui/error-boundary/error-boundary` | Catches render errors, shows fallback |
| `<ErrorFallback>` | `@/components/ui/error-fallback/error-fallback` | "Something went wrong" UI with retry |
| `<LoadingSpinner>` | `@/components/ui/loading-spinner/loading-spinner` | Bouncing dots spinner (sm/md/lg, fullPage) |

---

## 16. Anti-Patterns (STRICTLY FORBIDDEN)

- ❌ API calls inside components
- ❌ Business logic in JSX
- ❌ Large components (>200 lines)
- ❌ Unnecessary re-renders
- ❌ useEffect misuse
- ❌ useState abuse
- ❌ Inline styles
- ❌ Hardcoded values
- ❌ Code duplication
- ❌ Unhandled async errors
- ❌ Missing loading states for async operations

---

## 17. Enforcement Rule

If ANY rule is violated:
→ REGENERATE the solution
```
