import type { Lesson } from "../../types";
import { C, Callout, Code, Compare, Practice, Prose } from "../../ui/tutorial";
import Demo from "./Demo";
import demoSource from "./Demo.tsx?raw";
import exerciseStarter from "./Exercise.tsx?raw";
import exerciseSolution from "./Solution.tsx?raw";

function Readme() {
  return (
    <Prose>
      <h2><C>watch</C> / <C>watchEffect</C> / lifecycle → <C>useEffect</C></h2>
      <p>
        <C>useEffect</C> is the single React primitive for "run some code as a side effect of
        rendering". It replaces <C>watch</C>, <C>watchEffect</C>, <C>onMounted</C>,{" "}
        <C>onUnmounted</C>, and <C>onUpdated</C> — all four.
      </p>
      <Code lang="tsx">{`useEffect(() => {
  // effect body — runs AFTER the DOM is updated
  return () => {
    // optional cleanup — runs before the next effect and on unmount
  }
}, [dep1, dep2])  // the "deps array" — rerun when these change by Object.is`}</Code>

      <h3>Mapping from Vue</h3>
      <Compare
        items={[
          {
            vue: `onMounted(() => ...)`,
            react: `useEffect(() => { ... }, [])`,
          },
          {
            vue: `onUnmounted(() => ...)`,
            react: `useEffect(() => () => { ... }, [])`,
          },
          {
            vue: `onUpdated(() => ...)`,
            react: `useEffect(() => { ... })`,
            note: "No array — runs every render. Caveat: also runs on mount (onUpdated doesn't).",
          },
          {
            vue: `watch(x, (n, o) => ...)`,
            react: `useEffect(() => { ... }, [x])`,
            note: "No 'old' value by default — see below.",
          },
          {
            vue: `watch([a, b], ...)`,
            react: `useEffect(() => { ... }, [a, b])`,
          },
          {
            vue: `watchEffect(() => ...)`,
            react: `useEffect(() => { ... })`,
            note: "No deps; but prefer to list them.",
          },
          {
            vue: `{ immediate: true }`,
            react: "The default — effects always run once on mount",
          },
          {
            vue: `{ flush: 'post' }`,
            react: "The default — after DOM update",
          },
          {
            vue: `{ flush: 'sync' }`,
            react: `No direct equivalent — useLayoutEffect runs after DOM mutation but before paint`,
          },
        ]}
      />

      <h3>The deps array is not reactive — it's a diff</h3>
      <p>
        In Vue, <C>{"watch(count, ...)"}</C> <em>automatically</em> re-runs when <C>count</C>{" "}
        changes; you just pass the ref. React doesn't know what your effect depends on —{" "}
        <strong>you list the dependencies</strong>, and React shallow-compares them each render.
        Miss one and your effect uses stale values.
      </p>
      <Code lang="tsx">{`// BUG — effect uses \`name\` but doesn't declare it
useEffect(() => {
  fetch(\`/api/user?name=\${name}\`).then(...)
}, [])   // never re-runs when name changes

// correct
useEffect(() => {
  fetch(\`/api/user?name=\${name}\`).then(...)
}, [name])`}</Code>
      <p>
        ESLint's <C>react-hooks/exhaustive-deps</C> rule catches this. Install it.
      </p>

      <h3>Cleanup is the "unwatch" and the "unmount" in one</h3>
      <p>The function you <strong>return</strong> runs:</p>
      <ol>
        <li>Right before the effect runs again (because a dep changed).</li>
        <li>When the component unmounts.</li>
      </ol>
      <p>This elegantly handles timers, subscriptions, requests:</p>
      <Code lang="tsx">{`useEffect(() => {
  const ac = new AbortController()
  fetch(\`/q/\${query}\`, { signal: ac.signal }).then(...)
  return () => ac.abort()   // old request cancelled on next run / unmount
}, [query])`}</Code>
      <p>
        Vue has the same pattern: <C>{"watch(src, (n, o, onCleanup) => { onCleanup(() => ...) })"}</C>{" "}
        (or <C>onWatcherCleanup()</C> since Vue 3.5). The difference is structural — in React the
        returned cleanup <em>is</em> the mechanism; in Vue it's an extra argument.
      </p>

      <h3>Old vs new value</h3>
      <p>
        <C>{"watch(x, (newVal, oldVal) => {})"}</C> gives both. <C>useEffect</C> does not. If you
        need the old value, stash it in a <C>useRef</C> (lesson 13):
      </p>
      <Code lang="tsx">{`const prev = useRef(count)
useEffect(() => {
  console.log('changed from', prev.current, 'to', count)
  prev.current = count
}, [count])`}</Code>

      <Callout type="gotcha" title="useEffect runs TWICE in dev — this is intentional">
        <p>
          In StrictMode (dev only), React mounts, unmounts, and remounts each component to surface
          bugs in cleanup logic. If your effect fires a request and you see two requests in the
          Network tab, this is why. <strong>It will run once in production.</strong>
        </p>
        <p>
          This trips up every Vue dev. If your effect has side effects outside React (analytics,
          POST request, etc.) it MUST be idempotent or properly cancelled in cleanup. The framework
          is teaching you by making it loud.
        </p>
      </Callout>

      <h3><C>useEffect</C> vs <C>useLayoutEffect</C></h3>
      <ul>
        <li><C>useEffect</C> — fires after browser paint. For most things. Non-blocking.</li>
        <li>
          <C>useLayoutEffect</C> — fires synchronously after DOM mutation, before paint. Use only
          when you need to measure layout to avoid a flicker.
        </li>
      </ul>

      <h3>Things <C>useEffect</C> is NOT for</h3>
      <p>
        The React docs have a whole page called "You Might Not Need an Effect". Red flags:
      </p>
      <ul>
        <li>
          <strong>Syncing state to state.</strong> If <C>b</C> is derived from <C>a</C>, compute it
          during render — don't <C>useEffect</C> to copy <C>a</C> into <C>b</C>.
        </li>
        <li>
          <strong>Resetting state on prop change.</strong> Use the <C>key</C> prop (lesson 21).
        </li>
        <li>
          <strong>Event handlers that just happen to need state.</strong> Put the logic in the
          handler — <C>{"onClick={() => save(data)}"}</C>, not <C>useEffect</C> watching a flag.
        </li>
      </ul>

      <Practice>
        Exercise: persist state to localStorage, subscribe to window events, and detect "first
        render" without hooks we haven't learned yet.
      </Practice>
    </Prose>
  );
}

function Instructions() {
  return (
    <ol>
      <li>
        Use <C>useEffect</C> to sync <C>count</C> into <C>localStorage</C> under key{" "}
        <C>"ex4-count"</C>. When the component mounts, initialize <C>count</C> from{" "}
        <C>localStorage</C>. <em>(Hint: the <C>useState</C> initializer function runs once.)</em>
      </li>
      <li>
        Add a <C>useEffect</C> that logs to the console every time <C>name</C> changes, but{" "}
        <strong>not</strong> on the first render. <em>
          (Hint: <C>useRef</C> — we'll cover that in lesson 13; for now just use a module-level flag
          or a second state field.)
        </em>
      </li>
      <li>
        Add an event listener on <C>window</C> for <C>"keydown"</C> that increments <C>count</C> on
        Space. Remember to remove the listener in cleanup, or you'll leak.
      </li>
    </ol>
  );
}

const vueSource = `<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const count = ref(0)
const seconds = ref(0)
const query = ref('react')
const result = ref('')

watch(count, (c) => { document.title = \`count is \${c}\` }, { immediate: true })

let id: number
onMounted(() => { id = setInterval(() => seconds.value++, 1000) })
onUnmounted(() => clearInterval(id))

watch(query, async (q, _old, onCleanup) => {
  const ac = new AbortController()
  onCleanup(() => ac.abort())
  await new Promise(r => setTimeout(r, 300))
  if (!ac.signal.aborted) result.value = \`results for "\${q}"\`
})
</script>
`;

const lesson: Lesson = {
  slug: "04-effects",
  title: "Side effects: useEffect",
  subtitle: "watch / watchEffect / lifecycle → one primitive. Cleanup, deps array, StrictMode.",
  Readme,
  Demo,
  demoSource,
  vueSource,
  Instructions,
  exerciseStarter,
  exerciseSolution,
};

export default lesson;
