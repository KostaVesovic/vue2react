import type { Lesson } from "../../types";
import { C, Callout, Code, Compare, Practice, Prose } from "../../ui/tutorial";
import Demo from "./Demo";
import demoSource from "./Demo.tsx?raw";
import exerciseStarter from "./Exercise.tsx?raw";
import exerciseSolution from "./Solution.tsx?raw";

function Readme() {
  return (
    <Prose>
      <h2>Lifecycle hooks → <C>useEffect</C> (again)</h2>
      <p>
        React collapses all lifecycle hooks into <C>useEffect</C>. Here's the mapping — it's
        almost the same table as lesson 4 but called out on its own because it bites Vue devs.
      </p>

      <Compare
        items={[
          {
            vue: `onBeforeMount`,
            react: `no equivalent — body of the component IS beforeMount`,
          },
          {
            vue: `onMounted`,
            react: `useEffect(() => { ... }, [])`,
          },
          {
            vue: `onBeforeUpdate`,
            react: `no equivalent — write logic before return in the component`,
          },
          {
            vue: `onUpdated`,
            react: `useEffect(() => { ... }) — no deps array, runs every render`,
          },
          {
            vue: `onBeforeUnmount`,
            react: `no equivalent — same as unmount cleanup for most uses`,
          },
          {
            vue: `onUnmounted`,
            react: `cleanup fn in useEffect(() => () => { ... }, [])`,
          },
          {
            vue: `onActivated (keep-alive)`,
            react: `not a thing — React has no keep-alive`,
          },
          {
            vue: `onDeactivated (keep-alive)`,
            react: `not a thing`,
          },
          {
            vue: `onErrorCaptured`,
            react: `Error boundaries (class component — lesson 16)`,
          },
        ]}
      />

      <h3>"Before" hooks don't really exist</h3>
      <p>In a React function component:</p>
      <ul>
        <li>
          Code at the <strong>top of the function body</strong> runs "before mount" and also
          "before every update" — every render.
        </li>
        <li>
          Code in <C>{"useEffect(() => { ... })"}</C> with the deps argument <em>omitted</em> runs{" "}
          <strong>after</strong> every render. (Not the same as <C>[]</C>, which runs once.)
        </li>
        <li>
          Code in <C>{"useEffect(() => { ... }, [])"}</C> runs once after the first render.
        </li>
      </ul>
      <p>
        There's no "beforeMount" because there's no gap between "create the component" and "run
        its body" — the body IS creation.
      </p>

      <h3><C>key</C> is the "unmount then mount" lever</h3>
      <p>
        In Vue you can force a re-mount with <C>:key="x"</C>. React is identical: changing a
        component's <C>key</C> makes React unmount the old instance and mount a new one, running
        all <C>useEffect</C> cleanup and then the initial <C>useEffect</C> again.
      </p>
      <p>Useful for resetting state when an identifier changes:</p>
      <Code lang="tsx">{`<UserForm key={userId} userId={userId} />`}</Code>

      <h3>StrictMode double-mount — again</h3>
      <p>
        In dev, <C>{"<StrictMode>"}</C> wraps your app and re-runs each component's body and its
        effects (setup → cleanup → setup) on first mount to surface cleanup bugs. Your logs will
        show:
      </p>
      <Code>{`[foo] mounted
[foo] unmounted
[foo] mounted`}</Code>
      <Callout type="warn">
        <strong>This does NOT happen in production.</strong> But you MUST write cleanup correctly
        or your dev experience will have duplicated timers, subscriptions, etc.
      </Callout>

      <h3>The "cleanup before re-run" pattern</h3>
      <p>
        Unlike Vue, React runs the cleanup from the <em>previous</em> effect invocation before
        running the new one when a dep changes. This makes it natural to:
      </p>
      <ul>
        <li>Cancel an in-flight request when the query changes</li>
        <li>Clear a timer before starting a new one</li>
        <li>Unsubscribe from the old WebSocket before subscribing to the new one</li>
      </ul>
      <Code lang="tsx">{`useEffect(() => {
  const ws = new WebSocket(url)
  return () => ws.close()
}, [url])
// url change → close old ws, then open new one. Magic.`}</Code>
      <p>
        Vue's <C>watch</C> supports <C>onCleanup</C> but it's an explicit callback param; in React
        the return value IS the cleanup.
      </p>

      <Practice>
        Build a timer that cleans up. Watch the console to prove the interval stops when the
        component unmounts.
      </Practice>
    </Prose>
  );
}

function Instructions() {
  return (
    <>
      <p>
        Build a <C>{"<Timer />"}</C> that shows how many seconds have passed since it mounted.
      </p>
      <ol>
        <li>
          <C>useState</C> for seconds, <C>useEffect</C> with <C>setInterval</C> + cleanup.
        </li>
        <li>Log "mounted" and "unmounted" to the console to verify cleanup works.</li>
        <li>
          The parent has a button that toggles the timer — when you unmount it, the interval MUST
          stop (otherwise it leaks memory and keeps firing after the component is gone).
        </li>
      </ol>
      <p>
        <strong>Bonus:</strong> only update state if the document is visible (hint:{" "}
        <C>document.visibilityState</C>). You don't strictly need this for correctness — it's a
        subtle perf pattern.
      </p>
    </>
  );
}

const vueSource = `<script setup lang="ts">
import { ref, onMounted, onUpdated, onUnmounted } from 'vue'
const n = ref(0)

onMounted(() => console.log('mounted'))
onUpdated(() => console.log('updated'))
onUnmounted(() => console.log('unmounted'))
</script>

<template>
  <div>n = {{ n }}</div>
  <button @click="n++">+1</button>
</template>
`;

const lesson: Lesson = {
  slug: "10-lifecycle",
  title: "Lifecycle",
  subtitle: "onMounted/onUpdated/onUnmounted collapse into useEffect.",
  Readme,
  Demo,
  demoSource,
  vueSource,
  Instructions,
  exerciseStarter,
  exerciseSolution,
};

export default lesson;
