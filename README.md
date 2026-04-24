# vue2react

An interactive tutorial for **Vue.js developers** learning **React.js**.
Each lesson maps a Vue concept to its React equivalent, with side-by-side code
and an exercise you edit live.

## Run it

```bash
npm install
npm run dev        # opens http://localhost:5173
```

Click a lesson in the sidebar. Each lesson has four tabs:

- **Read** — the Vue↔React explanation (the meat of the lesson)
- **Demo** — a finished React component you can inspect
- **Exercise** — an incomplete component you edit (HMR, saves instantly)
- **Vue reference** — the equivalent Vue SFC, for comparison

## Scripts

| command                | what it does                                         |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Start the Vite dev server on port 5173               |
| `npm run build`        | Type-check and produce a production build in `dist/` |
| `npm run preview`      | Serve the production build locally                   |
| `npm run typecheck`    | Run `tsc --noEmit` against the whole project         |
| `npm run lint`         | Run oxlint over the source tree                      |
| `npm run lint:fix`     | Run oxlint with auto-fix enabled                     |
| `npm run format`       | Rewrite source files with oxfmt                      |
| `npm run format:check` | Check formatting without writing (CI-friendly)       |

## Lesson order

The lessons build on each other — don't skip around the first time:

1. Setup & JSX (SFC → function component)
2. State (`ref`/`reactive` → `useState`)
3. Derived values (`computed` → `useMemo`)
4. Side effects (`watch`/`watchEffect` → `useEffect`)
5. Conditionals & lists (`v-if`, `v-for` → JSX)
6. Events & two-way binding (`@click`, `v-model` → `onClick`, controlled inputs)
7. Components & props
8. Emitting events (`$emit` → callback props)
9. Slots (default/named/scoped → `children`/render props)
10. Lifecycle
11. `provide`/`inject` → Context
12. Composables → custom hooks
13. Template refs → `useRef`
14. Forms in depth
15. `<Teleport>` → portals
16. Suspense & error boundaries
17. Transitions (the missing piece)
18. Routing (Vue Router → React Router)
19. State management (Pinia → Zustand / Redux Toolkit)
20. Performance (`v-memo`/`shallowRef` → `memo`/`useCallback`)
21. React-only features (`useReducer`, `useId`, `key` as remount, StrictMode, RSC…)

## How to use the exercises

Each `Exercise.tsx` has `TODO:` markers. Work through them in the live Sandpack
editor. A **Show solution** button appears on lessons that ship a worked
answer — try it yourself first, then swap in the solution to compare.
