import type { Lesson } from "../../types";
import { C, Callout, Code, Practice, Prose } from "../../ui/tutorial";
import Demo from "./Demo";
import demoSource from "./Demo.tsx?raw";
import exerciseStarter from "./Exercise.tsx?raw";
import exerciseSolution from "./Solution.tsx?raw";

function Readme() {
  return (
    <Prose>
      <h2>React-only features (no real Vue analogue)</h2>
      <p>
        A grab-bag of things that are distinctively React. Worth a read-through even if you
        don't use them day one — they come up.
      </p>

      <h3>1. <C>useReducer</C> — reducer-style state</h3>
      <Code lang="tsx">{`const [state, dispatch] = useReducer(reducer, initial)

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'inc': return { ...state, count: state.count + 1 }
    case 'set': return { ...state, count: action.value }
  }
}

dispatch({ type: 'inc' })`}</Code>
      <p>Useful when:</p>
      <ul>
        <li>State transitions are non-trivial (multiple fields updated together)</li>
        <li>You want testable transition logic as a pure function</li>
        <li>Multiple <C>useState</C> calls are tangled</li>
      </ul>
      <p>
        No Vue equivalent — you'd achieve the same manually with a reactive object and action
        functions.
      </p>

      <h3>2. <C>useId</C> — stable, SSR-safe ids</h3>
      <Code lang="tsx">{`const id = useId()
<label htmlFor={id}>name</label>
<input id={id} />`}</Code>
      <p>For accessibility associations. Same id on server and client — no mismatches.</p>

      <h3>3. <C>key</C> as remount lever</h3>
      <p>
        Changing a component's <C>key</C> tells React "this is a different instance" — it
        unmounts the old tree and mounts a fresh one. Brilliant for resetting local state when
        an identifier changes:
      </p>
      <Code lang="tsx">{`<UserForm key={userId} userId={userId} />
// switch userId → form fully resets, no useEffect gymnastics`}</Code>
      <p>
        Vue has <C>:key</C> too, but this pattern is culturally more popular in React because
        state-reset on prop change is more common.
      </p>

      <h3>4. <C>useImperativeHandle</C> — Vue's <C>defineExpose</C></h3>
      <p>Let a parent call specific methods on a ref to your component:</p>
      <Code lang="tsx">{`interface Handle { focus: () => void }

function FancyInput({ ref }: { ref?: Ref<Handle> }) {
  const el = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => ({ focus: () => el.current?.focus() }), [])
  return <input ref={el} />
}

// parent
const ref = useRef<Handle>(null)
<FancyInput ref={ref} />
ref.current?.focus()`}</Code>
      <p>
        Use <strong>sparingly</strong>. It's an escape hatch from React's declarative model —
        but occasionally the only sane option (focus control, animations).
      </p>

      <h3>5. <C>useLayoutEffect</C></h3>
      <p>
        Like <C>useEffect</C> but fires <strong>synchronously</strong> after DOM mutation,
        before paint. For measuring DOM to avoid a flicker (e.g. calculating tooltip position
        from a child's bounding rect). Don't use it by default — it blocks paint.
      </p>

      <h3>6. Concurrent features: <C>useTransition</C>, <C>useDeferredValue</C>, <C>startTransition</C></h3>
      <p>
        React 18 introduced concurrency — the ability to <strong>interrupt</strong> renders to
        keep the UI responsive. You tell React which updates are non-urgent:
      </p>
      <Code lang="tsx">{`const [pending, startTransition] = useTransition()

startTransition(() => {
  setSearchResults(heavyComputation(query))   // low priority
})`}</Code>
      <p>
        Or for derived values, <C>useDeferredValue</C> returns a "lagging" copy that only
        catches up when nothing more urgent is happening:
      </p>
      <Code lang="tsx">{`const deferredQuery = useDeferredValue(query)
<HeavyList query={deferredQuery} />`}</Code>
      <p>
        <strong>React 19:</strong> <C>startTransition</C> now accepts async functions — any{" "}
        <C>await</C>ed state update inside is automatically marked as a transition. This is the
        foundation of Actions (below). <C>{"<ViewTransition>"}</C> (experimental in 19) ties
        the browser's View Transitions API into <C>startTransition</C> and Suspense.
      </p>
      <p>Vue has nothing like this in core — you'd build debouncing manually.</p>

      <h3>7. <C>useSyncExternalStore</C> — subscribing to external stores</h3>
      <p>
        For integrating non-React state (Redux, Zustand internals, browser APIs like{" "}
        <C>navigator.onLine</C>):
      </p>
      <Code lang="tsx">{`const online = useSyncExternalStore(
  (cb) => { window.addEventListener('online', cb); return () => window.removeEventListener('online', cb) },
  () => navigator.onLine,
  () => true,   // SSR snapshot
)`}</Code>
      <p>Zustand and Redux use this internally.</p>

      <h3>8. <C>{"<StrictMode>"}</C> — development-only contract checker</h3>
      <p>
        Wraps the app tree, double-invokes effects/reducers/state initializers in dev to
        surface bugs in cleanup logic. <strong>It doesn't affect production.</strong> Leave
        it on.
      </p>

      <h3>9. Server Components (RSC)</h3>
      <p>
        React Server Components are components that <strong>run only on the server</strong>,
        never ship JS to the client, and can directly <C>await</C> data. Available in Next.js
        and other frameworks — not applicable to a plain client-side Vite SPA. Vue has Nuxt 3's
        island components which are conceptually related but architecturally different.
      </p>
      <Callout type="info">
        When you move to Next.js: your component files are Server Components by default. Add{" "}
        <C>'use client'</C> at the top to opt into the client runtime for interactive code.
      </Callout>

      <h3>10. Actions (React 19): <C>useActionState</C>, <C>useFormStatus</C>, <C>useOptimistic</C></h3>
      <p>
        React 19 introduced <strong>Actions</strong> — async functions passed to{" "}
        <C>{"<form action>"}</C> (or called directly) that integrate pending/error state and
        optimistic UI without manual bookkeeping.
      </p>
      <Code lang="tsx">{`// useActionState: form result + pending state in one hook
const [error, submit, isPending] = useActionState(
  async (_prev, formData: FormData) => {
    const res = await saveName(formData.get('name'))
    return res.ok ? null : res.error
  },
  null,
)

<form action={submit}>
  <input name="name" />
  <button disabled={isPending}>save</button>
  {error && <p>{error}</p>}
</form>`}</Code>
      <Code lang="tsx">{`// useFormStatus: child components read the parent form's pending state
function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? 'saving…' : 'save'}</button>
}`}</Code>
      <Code lang="tsx">{`// useOptimistic: show the new value immediately, revert if the action fails
const [optimisticTodos, addOptimistic] = useOptimistic(
  todos,
  (state, newTodo: Todo) => [...state, { ...newTodo, pending: true }],
)

async function add(formData: FormData) {
  const todo = { id: crypto.randomUUID(), text: formData.get('text') as string }
  addOptimistic(todo)
  await saveTodo(todo)   // if this throws, optimistic state is dropped
}`}</Code>
      <p>
        No Vue equivalent — closest is manually combining <C>ref</C> for pending state with a
        try/catch. The React 19 pattern is tighter and composes with Server Actions in Next.js.
      </p>

      <h3>11. React Compiler (v1.0 stable, Oct 2025)</h3>
      <p>
        Auto-inserts memoization at build time, making <C>memo</C>, <C>useMemo</C>, and{" "}
        <C>useCallback</C> largely unnecessary in your source. Opt-in per-repo today; likely to
        become the default before long.
      </p>

      <Practice>
        Use the <C>key</C> trick to reset state across user switches without <C>useEffect</C>.
        This is one of those tricks you'll pull out of your pocket often.
      </Practice>
    </Prose>
  );
}

function Instructions() {
  return (
    <>
      <p>Use the <C>key</C> trick to reset a form when a "user" is switched.</p>
      <ol>
        <li>
          The <C>{"<Profile />"}</C> component owns local state for <C>bio</C>/<C>age</C>.
          Currently, switching users does NOT reset that state — bio leaks across.
        </li>
        <li>
          Fix this by passing a different <C>key</C> to <C>{"<Profile />"}</C> for each user.
          (Don't change <C>Profile</C> itself — only the call site.)
        </li>
      </ol>
    </>
  );
}

const vueSource = `<!-- Vue has some analogues, others just don't exist -->

<!-- defineExpose → useImperativeHandle -->
<script setup lang="ts">
import { ref } from 'vue'
const inputEl = ref<HTMLInputElement | null>(null)
defineExpose({ focus: () => inputEl.value?.focus() })
</script>

<!-- :key to reset is identical -->
<UserForm :key="userId" :user-id="userId" />

<!-- No equivalent for: useReducer, useId (SSR), useTransition,
     useDeferredValue, useSyncExternalStore, RSC -->
`;

const lesson: Lesson = {
  slug: "21-react-only",
  title: "React-only features",
  subtitle: "useReducer, useId, key-as-remount, useImperativeHandle, concurrent, RSC, StrictMode.",
  Readme,
  Demo,
  demoSource,
  vueSource,
  Instructions,
  exerciseStarter,
  exerciseSolution,
};

export default lesson;
