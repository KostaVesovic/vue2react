import type { Lesson } from "../../types";
import { C, Callout, Code, Practice, Prose, SideBySide } from "../../ui/tutorial";
import Demo from "./Demo";
import demoSource from "./Demo.tsx?raw";
import exerciseStarter from "./Exercise.tsx?raw";
import exerciseSolution from "./Solution.tsx?raw";

function Readme() {
  return (
    <Prose>
      <h2><C>computed</C> → (often nothing) or <C>useMemo</C></h2>
      <p>
        In Vue, <strong>every</strong> derived value gets wrapped in <C>computed()</C> — it's cached,
        reactive, and idiomatic. In React, the default is <strong>just compute it inline</strong>.
        Memoization is opt-in via <C>useMemo</C> when the computation is genuinely expensive or the
        reference identity matters.
      </p>

      <SideBySide
        caption="Every derived value is a computed vs. just compute it."
        vue={`// Vue — every derived value is a computed
const query = ref('')
const filtered = computed(() =>
  users.filter(u => u.includes(query.value))
)`}
        react={`// React — just compute it. The component re-runs, that's fine.
const [query, setQuery] = useState('')
const filtered = users.filter(u => u.includes(query))`}
      />

      <h3>Why the default is "don't memoize"</h3>
      <p>Filtering 5 users is essentially free. Wrapping everything in <C>useMemo</C>:</p>
      <ul>
        <li>Adds dependency-array bookkeeping (easy to get wrong)</li>
        <li>Stores the previous value — costs memory</li>
        <li>The comparison itself isn't free</li>
      </ul>
      <p>
        The React team's official guidance: <strong>don't memoize until you measure</strong>. A
        common beginner mistake (even from experienced Vue devs!) is wrapping every derived value in{" "}
        <C>useMemo</C> out of habit.
      </p>

      <h3>When <C>useMemo</C> IS the right tool</h3>
      <ol>
        <li><strong>Expensive pure computation</strong> — heavy filter/sort/parse on big data.</li>
        <li>
          <strong>Referential equality matters.</strong> If an object/array is a prop to a memoized
          child or a dep of <C>useEffect</C>, a new reference every render triggers work.{" "}
          <C>useMemo</C> keeps the same reference while deps are unchanged.
        </li>
      </ol>
      <Code lang="tsx">{`// Stable reference across renders while deps are same
const config = useMemo(() => ({ locale, currency }), [locale, currency]);

<ExpensiveChart config={config} />   // won't re-render needlessly`}</Code>

      <h3>Signature</h3>
      <Code lang="tsx">{`const value = useMemo(() => compute(a, b), [a, b]);
//                    ^^^^^^^^^^^^^^^^^^^  ^^^^^^
//                    factory (pure!)      dependency array`}</Code>
      <p>
        The factory re-runs whenever any item in the array changes by <C>Object.is</C>. This is{" "}
        <strong>not reactivity</strong> — React just runs a shallow equality check each render. If
        you forget a dependency, the value is stale.
      </p>

      <h3><C>useMemo</C> vs <C>useCallback</C></h3>
      <p>
        <C>useCallback(fn, deps)</C> is shorthand for <C>{"useMemo(() => fn, deps)"}</C> — it
        memoizes a function reference. Covered properly in lesson 20.
      </p>

      <Callout type="gotcha" title="useMemo is a performance hint, not a guarantee">
        React may discard the cache (e.g. during development hot reload, or if a component suspends
        on initial mount). Don't rely on <C>useMemo</C> for semantic caching like "only fetch once"
        — use <C>useEffect</C> or a real cache (TanStack Query, SWR).
      </Callout>

      <Practice>
        In the exercise, note how ergonomic plain JS is — you don't need <C>useMemo</C> for
        everything. Only the sort feels heavy enough to memoize.
      </Practice>
    </Prose>
  );
}

function Instructions() {
  return (
    <>
      <p>Given a list of products and a min-price filter:</p>
      <ol>
        <li>Compute <C>visible</C> — the filtered list. No <C>useMemo</C>; it's cheap.</li>
        <li>Compute <C>total</C> — the sum of visible prices. Same.</li>
        <li>
          Compute <C>sorted</C> — <C>visible</C> sorted by price descending. Sorting is
          "expensive-feeling"; use <C>useMemo</C> so you can observe when it runs.
        </li>
      </ol>
      <p>
        <strong>Bonus:</strong> change <C>minPrice</C> to a string-typed input. What goes wrong? How
        do you fix it? <em>(Hint: <C>Number(...)</C>)</em>
      </p>
    </>
  );
}

const vueSource = `<script setup lang="ts">
import { ref, computed } from 'vue'

const query = ref('')
const users = ['Ada Lovelace', 'Alan Turing', 'Grace Hopper']

const filtered = computed(() =>
  users.filter(u => u.toLowerCase().includes(query.value.toLowerCase()))
)
</script>

<template>
  <input v-model="query" />
  <ul><li v-for="u in filtered" :key="u">{{ u }}</li></ul>
</template>
`;

const lesson: Lesson = {
  slug: "03-computed-memo",
  title: "Derived values: useMemo",
  subtitle: "computed() → just compute it. Reach for useMemo only when you measure a problem.",
  Readme,
  Demo,
  demoSource,
  vueSource,
  Instructions,
  exerciseStarter,
  exerciseSolution,
};

export default lesson;
