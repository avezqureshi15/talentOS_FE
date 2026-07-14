# Frontend Engineering Rules (STRICT - NON NEGOTIABLE)

---

***Strictly follow if a component is handling many things or doing too many things divide that components into multiple small components and if possible encapsulated logic into reusable components or Hooks following best React Coding Practices , this rule is must ***

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
- TanStack Query → server state ONLY (make sure to implement caching , retry mechanism and optimistic updates this are really very much important for necessary api integration)
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
- No inline javascript inside jsx , if needed create utility or function then use 

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
  - `<Skeleton>` shimmer lines/boxes for content that is loading (preferred over spinner for known-content areas)
  - `<LoadingSpinner>` for indeterminate waits (page loads, full-screen operations)
  - Typing indicator for AI/chat responses
  - Disabled inputs/buttons during processing
- ✅ Never show a raw ID or unloaded placeholder — always use `<Skeleton>` while entity data is being fetched
- ✅ `/components/ui/skeleton` — reusable `<Skeleton>` with variants: `text` (default), `circle`, `rect`
- ✅ `/components/ui/loading-spinner` — reusable `<LoadingSpinner>`

### Error States

- ✅ Async operations MUST use try/catch and surface errors to the user
- ✅ Stores MUST have an `error` field for error messages
- ✅ `/components/ui/error-boundary` — reusable `<ErrorBoundary>` (class component with `componentDidCatch`)
- ✅ `/components/ui/error-fallback` — reusable `<ErrorFallback>` with retry button
- ❌ Never let an async error go unhandled (unhandled promise rejection)
- ❌ Never show raw error messages to users — use friendly fallbacks

## 16. Modal Reusability & Keyboard Accessibility

### MUST use BaseModal for all modals

- ❌ Never hand-roll overlay/backdrop/close button for a modal
- ❌ Never omit keyboard escape support

- ✅ All modals MUST use `<BaseModal>` from `@/components/ui/modal/base-modal`
- ✅ BaseModal provides: Escape key close, overlay click close, body scroll lock, consistent glassmorphism styling, header with close button
- ✅ Use `variant="centered"` (default) for center-positioned modals
- ✅ Use `variant="slide-right"` for side-sheet panels
- ✅ Slide-in sheets that cannot use BaseModal MUST still implement Escape key close and body scroll lock manually

---

### Components Provided

| Component | Location | Purpose |
|---|---|---|
| `<ErrorBoundary>` | `@/components/ui/error-boundary/error-boundary` | Catches render errors, shows fallback |
| `<ErrorFallback>` | `@/components/ui/error-fallback/error-fallback` | "Something went wrong" UI with retry |
| `<LoadingSpinner>` | `@/components/ui/loading-spinner/loading-spinner` | Bouncing dots spinner (sm/md/lg, fullPage) |
| `<Skeleton>` | `@/components/ui/skeleton/skeleton` | Shimmer skeleton for loading content (text/circle/rect) |
| `<BaseModal>` | `@/components/ui/modal/base-modal` | Reusable modal with Escape close, overlay close, scroll lock |
| `<ToastContainer>` | `@/components/ui/toast/toast-container` | Global toast renderer (mounted in `main.tsx` — available on all pages) |
| `<Toast>` (internal) | `@/components/ui/toast/toast` | Single toast with icon, title, message, close button, exit animation |

## 17. Toast System (MANDATORY)

### Global Backend Error Toasts
- ✅ Backend errors are automatically shown as toasts via the http-client response interceptor in `src/services/http-client.ts`
- ✅ The interceptor extracts `error.response?.data?.error` → `detail` → `message` → `error.message` (fallback chain)
- ✅ 401 errors that fail refresh also show a toast before redirecting to `/login`

### Toast Store (Non-React Usage)
- ✅ Zustand store `useToastStore` can be called outside React components via `useToastStore.getState().addToast(message, type, duration?, title?)`
- ✅ Always import from `@/store/toast.store` and `@/components/ui/toast/toast.types`
- ✅ Toast types: `ToastType.SUCCESS`, `ToastType.ERROR`, `ToastType.WARNING`, `ToastType.INFO`

### useToast Hook (React Usage)
- ✅ Use `useToast()` from `@/hooks/use-toast` in components: `toast.success()`, `toast.error()`, `toast.warning()`, `toast.info()`
- ✅ Supports `title` (optional, bold header) and `duration` (optional, default 4000ms)
- ✅ Never hand-roll inline toast/snackbar — always use the centralized system

### Per-Request Opt-Out
- ✅ Suppress global toast for a specific request by adding `{ toastOnError: false }` to the axios config
- ✅ Only use when the calling code handles errors itself (e.g., TanStack Query `onError`)

### Toast Component Rules
- ✅ `toast.css` must use only CSS variables from `index.css` — zero hardcoded colors
- ✅ Left border color indicates type: `--danger` (red), `--warning` (amber), `--success` (green), `--accent` (blue)
- ✅ Glassmorphic background: `--sheet-bg` + `backdrop-filter: blur(16px)`
- ✅ Shadow: `--shadow-xl` for visibility over any surface
- ✅ Border-radius: `--radius-sm` (8px)
- ✅ Always use `bx-*` icons from Boxicons (mapped in `toast.constants.ts`)

---

## 18. Anti-Patterns (STRICTLY FORBIDDEN)

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

## 18. Enforcement Rule

If ANY rule is violated:
→ REGENERATE the solution


## 19. Avoid using chains of if else conditions , if it is becoming too much than move to using switch case or map depending on Scenario

## 20. If doing any kinf of heavy computation make sure u try to reduce the complexity as much as possible and also mention afterwards on which tasks u worked and reduced time complexity

## 21. Always during optimization or fixing strictly make sure the existing motive of the feature must not break

## 22. Do as much as minimal use of useffect see if alternative are available if not then go ahead  


## 23. Make sure when u are done with all of the changes and are sure no further changes will be required for the tasks then u run tsc -b + vite build which must pass with zero errors


## 24. Resuability and Scalability is key , Things must be extensible and reusable enforce by creating components in ui/shared folders so that it can reused over the application and consolidate the logic in hooks if it is being used in many places so that also becomes usable 
If ANY rule is violated:
→ REGENERATE the solution

## 25. Strictly always use index.css , css variables , never hardcode css color values

## 26. Use hooks useLocalStorage , useDebounce , useThemeStore which are globally created  

## 27. ALL Buttons That Trigger API Calls MUST Use `<Button>` component

- ✅ ALL buttons that trigger any API/mutation/query call MUST use `<Button>` from `@/components/ui/button/button`
- ✅ The `loading` prop MUST be wired to the mutation's `isPending` or query's `isFetching` state
- ✅ Use `loadingText` prop when the button text should change during loading (e.g., "Submitting...", "Resolving...")
- ✅ Use `icon` prop for bx-icon classes instead of manual `<i>` elements (icons are hidden during loading)
- ✅ Pass the existing `className` prop to preserve custom styling — the Button component adds no default styling
- ✅ For complex success/error states beyond simple loading, manage locally with `loading` + `disabled` props
- ❌ Never use raw `<button>` elements for API-triggering buttons
- ❌ Never hand-roll loading spinner + disabled logic — the `loading` prop handles it

## 28. ALL Dropdown / Select Elements MUST Use `<Select>` Component

- ✅ ALL `<select>` elements MUST use `<Select>` from `@/components/ui/select/select`
- ✅ Use `loading` prop when options are being fetched asynchronously
- ✅ Use `error` prop to surface option-loading failures
- ✅ Use `size` and `variant` props to match context (mirrors `<Button>` conventions: `sm`/`md`/`lg`, `primary`/`secondary`/`danger`/`ghost`/`text`)
- ✅ Use `clearable` prop when the user should be able to reset the selection
- ✅ Pass `className` for additional layout/positioning overrides
- ✅ For searchable or multi-select requirements in the future, set `searchable` or `multiSelect` prop (implementation pending — types are ready)
- ❌ Never use raw `<select>` elements
- ❌ Never implement custom dropdowns — extend `<Select>` instead


```
