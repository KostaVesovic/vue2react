import type { Lesson } from "../../types";
import { C, Callout, Code, Compare, Practice, Prose } from "../../ui/tutorial";
import Demo from "./Demo";
import demoSource from "./Demo.tsx?raw";
import exerciseStarter from "./Exercise.tsx?raw";
import exerciseSolution from "./Solution.tsx?raw";

function Readme() {
  return (
    <Prose>
      <h2>Performance: <C>memo</C>, <C>useMemo</C>, <C>useCallback</C>, and referential equality</h2>
      <p>
        In Vue, reactivity is dependency-tracked — a component only re-renders when a ref it
        used changed. <strong>React re-renders a component whenever its parent re-renders, by
        default.</strong> This is the single biggest perf difference.
      </p>

      <h3>When this matters</h3>
      <p>
        For the vast majority of components it doesn't. React's virtual-DOM diff is fast.
        Start unoptimized. Measure before optimizing. Then reach for the tools:
      </p>

      <h3><C>React.memo</C> — skip re-render if props are shallowly equal</h3>
      <Code lang="tsx">{`const Row = memo(function Row({ item }: Props) { ... })`}</Code>
      <p>
        Now <C>Row</C> compares <C>prevProps</C> with <C>nextProps</C> by <C>Object.is</C> for
        each key. If every prop is the same reference, it <strong>skips the render</strong>.
        Like Vue's automatic fine-grained re-rendering, but opt-in and one-level.
      </p>

      <h3>Referential equality is critical</h3>
      <p>If you pass <C>{"{ id: 1 }"}</C> to a <C>memo</C>'d child:</p>
      <Code lang="tsx">{`<Row item={{ id: 1 }} />         // ❌ new object every render — memo useless
<Row item={items[0]} />          // ✅ stable reference`}</Code>
      <p>Same for functions:</p>
      <Code lang="tsx">{`<Row onClick={() => pick(item.id)} />     // ❌ new function every render
<Row onClick={onPickCallback} />          // ✅ stable with useCallback`}</Code>

      <h3><C>useCallback</C> — stable function reference</h3>
      <Code lang="tsx">{`const onPick = useCallback((id: number) => setSel(id), [])`}</Code>
      <p>
        Returns the same function instance as long as deps are unchanged. Same idea as{" "}
        <C>useMemo</C> but for functions — because function literals lose identity every
        render.
      </p>
      <p>
        Rule of thumb: <strong>only bother with <C>useCallback</C>/<C>useMemo</C> when the
        callee is <C>memo</C>'d or used as a dep of another hook.</strong> Otherwise it's just
        overhead.
      </p>

      <h3><C>useMemo</C> — stable value reference (recap from lesson 3)</h3>
      <Code lang="tsx">{`const config = useMemo(() => ({ locale, currency }), [locale, currency])
<ExpensiveChart config={config} />`}</Code>

      <h3>Vue equivalents</h3>
      <Compare
        items={[
          {
            vue: `Automatic fine-grained re-render`,
            react: <span><C>memo</C> + stable props manually</span>,
          },
          {
            vue: <span><C>computed</C> caches derived values</span>,
            react: <span><C>useMemo</C> caches derived values</span>,
          },
          {
            vue: <span><C>shallowRef</C> to avoid deep reactivity cost</span>,
            react: `Not needed — React doesn't track deep reactivity`,
          },
          {
            vue: <span><C>v-memo</C> (skip re-render on stable key)</span>,
            react: <span><C>memo</C> on the component</span>,
          },
          {
            vue: <C>v-once</C>,
            react: <span><C>{"useMemo(() => <Child />, [])"}</C> or <C>memo</C> with stable props</span>,
          },
        ]}
      />

      <h3>The React Compiler (v1.0 stable, Oct 2025)</h3>
      <p>
        The <strong>React Compiler</strong> automatically inserts memoization at build time,
        making <C>memo</C>, <C>useMemo</C>, and <C>useCallback</C> largely unnecessary in your
        source. The rule "don't micro-optimize by hand" becomes even more correct with it on.
        Opt-in per-repo today; likely to become the default before long.
      </p>

      <Callout type="tip" title="What actually makes React apps fast">
        <ol>
          <li>
            <strong>Keep state as local as possible.</strong> A text input in a huge page
            should hold its own state — not lift it to the root.
          </li>
          <li>
            <strong>Don't put server data in client state.</strong> Use TanStack Query.
          </li>
          <li>
            <strong>Virtualize long lists.</strong> <C>react-virtual</C> / <C>react-window</C>.
            Rendering 10k rows without virtualisation is always slow.
          </li>
          <li>
            <strong>Lazy-load routes.</strong>{" "}
            <C>{"const Page = lazy(() => import('./Page'))"}</C> + Suspense. Ship less JS
            initially.
          </li>
          <li>
            <strong>Profile.</strong> The React DevTools Profiler shows you which components
            re-rendered and why.
          </li>
        </ol>
      </Callout>

      <Practice>
        Fix a component tree with <C>memo</C> + <C>useCallback</C> and watch the render counts
        go down.
      </Practice>
    </Prose>
  );
}

function Instructions() {
  return (
    <ol>
      <li>
        The <C>{"<Row />"}</C> below re-renders every time the parent does. Wrap it in
        <C>React.memo</C> and verify via the render-count display.
      </li>
      <li>
        The <C>onPick</C> callback is re-created every render — memo breaks. Fix it with
        <C>useCallback</C>.
      </li>
      <li>
        Add a "typed filter" above the list. Changing the filter should NOT cause unrelated rows
        to re-render. (They only need to re-render if their item or the filter match changes —
        here, the filter is only used in the parent's render to decide visibility.)
      </li>
    </ol>
  );
}

const vueSource = `<script setup lang="ts">
import { ref, computed, shallowRef } from 'vue'

const tick = ref(0)
const items = [
  { id: 1, text: 'one' },
  { id: 2, text: 'two' },
]

// Vue is automatically granular — changing tick doesn't re-render
// children that don't use tick. No memo() needed.
</script>

<template>
  <button @click="tick++">tick {{ tick }}</button>
  <Row v-for="i in items" :key="i.id" :item="i" />
</template>

<!-- For skipping re-render on unchanged keys you CAN use v-memo -->
<div v-memo="[item.id]">{{ expensiveRender(item) }}</div>
`;

const lesson: Lesson = {
  slug: "20-performance",
  title: "Performance",
  subtitle: "React re-renders by default. memo, useCallback, useMemo, and the referential equality rule.",
  Readme,
  Demo,
  demoSource,
  vueSource,
  Instructions,
  exerciseStarter,
  exerciseSolution,
};

export default lesson;
