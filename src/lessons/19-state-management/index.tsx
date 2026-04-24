import type { Lesson } from "../../types";
import { C, Callout, Code, Compare, Practice, Prose } from "../../ui/tutorial";
import Demo from "./Demo";
import demoSource from "./Demo.tsx?raw";
import exerciseStarter from "./Exercise.tsx?raw";
import exerciseSolution from "./Solution.tsx?raw";

function Readme() {
  return (
    <Prose>
      <h2>Pinia / Vuex → Zustand / Redux / useReducer + Context</h2>
      <p>
        Unlike Vue, React has no "official" store. The community settled on a few tools with
        different tradeoffs. Pick one per app — don't mix.
      </p>

      <h3>What Pinia gives you, and who gives you each part in React</h3>
      <Compare
        items={[
          {
            vue: <span><C>defineStore</C> with state/actions/getters</span>,
            react: <span>Zustand <C>create()</C>, or Redux Toolkit <C>createSlice</C></span>,
          },
          {
            vue: <span>Reactive state anywhere (<C>const store = useStore()</C>)</span>,
            react: <span>Zustand <C>{`const x = useStore(s => s.x)`}</C></span>,
          },
          {
            vue: `Getters (computed)`,
            react: `createSelector in Redux; derive in-selector for Zustand`,
          },
          {
            vue: `Plugins (persistence, devtools)`,
            react: `Zustand middleware; RTK devtools`,
          },
          {
            vue: `SSR`,
            react: `Supported in both; more ceremony`,
          },
        ]}
      />

      <h3>The honest flowchart</h3>
      <ol>
        <li>
          <strong>Prop drilling isn't that bad yet</strong> → <C>useState</C> + lift state up.
        </li>
        <li>
          <strong>Deeply nested, rarely-changing</strong> (theme, auth user) → Context.
        </li>
        <li>
          <strong>App-wide shared state</strong> → <strong>Zustand</strong> (my default
          recommendation).
        </li>
        <li>
          <strong>Complex reducer logic, time travel, strict patterns</strong> →{" "}
          <strong>Redux Toolkit</strong>.
        </li>
        <li>
          <strong>Server state</strong> (API data, caching, refetch) →{" "}
          <strong>TanStack Query</strong> — NOT a store. It specializes in
          fetching/caching/refetching. Don't put server data in Zustand.
        </li>
        <li>
          <strong>Atomic, bottom-up</strong> → Jotai (most similar to Vue's <C>ref</C> across
          components).
        </li>
      </ol>

      <h3>Zustand (my pick for replacing Pinia)</h3>
      <Code lang="tsx">{`import { create } from 'zustand'

interface CounterStore {
  count: number
  inc: () => void
  reset: () => void
}

export const useCounter = create<CounterStore>()((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
  reset: () => set({ count: 0 }),
}))

// anywhere in a component
function Counter() {
  const count = useCounter(s => s.count)        // subscribes to just count
  const inc = useCounter(s => s.inc)
  return <button onClick={inc}>{count}</button>
}`}</Code>
      <p>
        <strong>Why Vue devs tend to like Zustand:</strong> store lives outside React, feels
        like a plain module export, selectors act like Vue's <C>computed</C> (only re-render
        when the selected slice changes). No providers, no actions DSL. Updates default to plain
        object spreads; an optional Immer middleware (<C>zustand/middleware/immer</C>) lets you
        write mutation-style reducers if you want.
      </p>

      <h3>Redux Toolkit</h3>
      <p>Still the industry default at large companies. Much better than classic Redux:</p>
      <Code lang="tsx">{`import { createSlice, configureStore } from '@reduxjs/toolkit'

const counter = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    inc: (s) => { s.count += 1 },        // Immer-powered, mutation-style is fine
    reset: (s) => { s.count = 0 },
  },
})

export const store = configureStore({ reducer: { counter: counter.reducer } })
export const { inc, reset } = counter.actions

// in a component
const count = useSelector((s: RootState) => s.counter.count)
const dispatch = useDispatch()
dispatch(inc())`}</Code>
      <p>
        Uses Context under the hood; you wrap the app with <C>{"<Provider store={...}>"}</C>.
        Good when you need the Redux devtools, strict action logging, middleware ecosystem.
      </p>

      <h3><C>useReducer</C> + Context — zero-dep Pinia</h3>
      <p>
        For mid-sized apps that don't want a dependency, <C>useReducer</C> + Context is a
        capable pattern (and it's what the Demo uses):
      </p>
      <Code lang="tsx">{`const [state, dispatch] = useReducer(todoReducer, { todos: [] })
<TodoContext.Provider value={{ state, dispatch }}>{children}</TodoContext.Provider>`}</Code>
      <p>
        Limitation: every consumer re-renders on any state change. Split into multiple
        contexts or use the "context selector" pattern for large apps.
      </p>

      <h3>TanStack Query — for server state</h3>
      <Code lang="tsx">{`const { data, error, isLoading } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetch(\`/api/user/\${userId}\`).then(r => r.json()),
})`}</Code>
      <p>
        Automatic caching, deduping, refetch-on-focus, stale-while-revalidate, optimistic
        updates. You replace 80% of your <C>useEffect(fetch)</C> calls.{" "}
        <strong>Most real React apps use this.</strong> Pair with Zustand/Redux for client
        state.
      </p>

      <Callout type="tip" title="My recommended stack for someone coming from Vue">
        <ul>
          <li><strong>Client state:</strong> Zustand for anything shared; <C>useState</C> otherwise</li>
          <li><strong>Server state:</strong> TanStack Query</li>
          <li><strong>Forms:</strong> react-hook-form + Zod (lesson 14)</li>
          <li><strong>Routing:</strong> React Router v6 (lesson 18)</li>
          <li><strong>Animations:</strong> framer-motion (lesson 17)</li>
          <li><strong>UI primitives:</strong> Radix UI (unstyled) + Tailwind, or shadcn/ui (styled Radix)</li>
        </ul>
      </Callout>

      <Practice>
        Build a counter store with <C>useReducer</C> + Context to feel the pattern. In real
        code you'd reach for Zustand.
      </Practice>
    </Prose>
  );
}

function Instructions() {
  return (
    <>
      <p>Build a counter "store" with <C>useReducer</C> + Context. Steps are laid out; just fill them in.</p>
      <ol>
        <li>Finish the reducer: support <C>"inc"</C>, <C>"dec"</C>, <C>"reset"</C>, <C>"set"</C> (with payload).</li>
        <li>Write <C>useCounter()</C> that throws if outside provider.</li>
        <li>Wire <C>{"<Buttons />"}</C> to call <C>dispatch</C> for each action.</li>
        <li>Try it: clicking buttons updates the count everywhere.</li>
      </ol>
    </>
  );
}

const vueSource = `// stores/counter.ts
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: { double: (s) => s.count * 2 },
  actions: {
    inc() { this.count++ },
    reset() { this.count = 0 },
  },
})

<!-- Counter.vue -->
<script setup lang="ts">
import { useCounterStore } from './stores/counter'
const counter = useCounterStore()
</script>

<template>
  <button @click="counter.inc">{{ counter.count }}</button>
</template>
`;

const lesson: Lesson = {
  slug: "19-state-management",
  title: "State management",
  subtitle: "Pinia → Zustand / Redux Toolkit / useReducer+Context. Server vs client state.",
  Readme,
  Demo,
  demoSource,
  vueSource,
  Instructions,
  exerciseStarter,
  exerciseSolution,
};

export default lesson;
