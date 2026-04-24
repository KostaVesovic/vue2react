import type { Lesson } from "../../types";
import { C, Callout, Code, Practice, Prose, SideBySide } from "../../ui/tutorial";
import Demo from "./Demo";
import demoSource from "./Demo.tsx?raw";
import exerciseStarter from "./Exercise.tsx?raw";
import exerciseSolution from "./Solution.tsx?raw";

function Readme() {
  return (
    <Prose>
      <h2>Composables → custom hooks</h2>
      <p>
        <strong>This is the one place where React and Vue 3 feel almost identical.</strong>
      </p>
      <p>
        A Vue composable is a function starting with <C>use*</C> that uses <C>ref</C>,{" "}
        <C>computed</C>, <C>watch</C>. A React custom hook is a function starting with{" "}
        <C>use*</C> that uses <C>useState</C>, <C>useEffect</C>, other hooks.
      </p>

      <h3>Side-by-side</h3>
      <SideBySide
        caption="A mouse-position tracker, extracted as a reusable unit in each framework."
        vue={`// Vue composable
export function useMouse() {
  const x = ref(0), y = ref(0)
  const handler = (e: MouseEvent) => { x.value = e.x; y.value = e.y }
  onMounted(() => window.addEventListener('mousemove', handler))
  onUnmounted(() => window.removeEventListener('mousemove', handler))
  return { x, y }
}`}
        react={`// React hook
export function useMouse() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.x, y: e.y })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])
  return pos
}`}
      />
      <p>
        Same shape: grouping reactive state + effects + cleanup + a return value. Same instinct:
        extract anything you write twice into a <C>use*</C> function.
      </p>

      <h3>Rules of Hooks</h3>
      <p>This is the one thing that bites Vue devs. React hooks have <strong>strict</strong> rules:</p>
      <ol>
        <li>
          <strong>Only call hooks at the top level.</strong> Not inside loops, conditions, or nested
          functions. React identifies hooks by their call order.
        </li>
        <li>
          <strong>Only call hooks from React functions</strong> (components or other custom hooks).
          Not from regular functions, not from event handlers.
        </li>
        <li>
          <strong>Hook names must start with <C>use</C>.</strong> This is how the linter detects them.
        </li>
      </ol>

      <Code lang="tsx">{`// ❌ breaks the rules
function Bad({ enabled }) {
  if (enabled) {
    const [x] = useState(0)   // conditional hook — breaks!
  }
}

// ✅ correct
function Good({ enabled }) {
  const [x] = useState(0)
  if (!enabled) return null    // conditional RETURN is fine; conditional HOOK is not
}`}</Code>

      <p>The <C>eslint-plugin-react-hooks</C> enforces both rules. Install it.</p>

      <h3>Why these rules exist</h3>
      <p>
        React relies on call order to pair a hook call to its slot in the component's internal state
        array. Each render must call the same hooks in the same order. This is very different from
        Vue 3 composables, which don't have this constraint because Vue identifies refs by identity,
        not order.
      </p>

      <h3>Return shape conventions</h3>
      <ul>
        <li>
          Tuple <C>[value, setter]</C> — for state-like hooks: <C>useState</C>, <C>useToggle</C>.
        </li>
        <li>
          Object <C>{"{ foo, bar, baz }"}</C> — for anything with ≥3 return values.
        </li>
        <li>
          Array-<C>as const</C> gives destructured naming flexibility (<C>[x, setX]</C>,{" "}
          <C>[y, setY]</C>) — same hook used multiple times.
        </li>
      </ul>

      <h3>Composition of hooks</h3>
      <p>Hooks call other hooks. You can build big capabilities from small ones.</p>
      <Code lang="tsx">{`function useUser(userId: string) {
  const { data, error } = useFetch<User>(\`/api/user/\${userId}\`)
  const isAdmin = useMemo(() => data?.roles.includes('admin'), [data])
  return { user: data, isAdmin, error }
}`}</Code>

      <h3>Examples worth writing</h3>
      <ul>
        <li><C>useToggle</C> — classic first hook</li>
        <li><C>useDebounced(value, ms)</C> — returns a lagged copy</li>
        <li><C>usePrevious(value)</C> — returns the previous value (uses <C>useRef</C>)</li>
        <li><C>useLocalStorage(key, initial)</C> — syncs a state to localStorage</li>
        <li><C>useEventListener(target, event, handler)</C> — subscribes + cleans up</li>
        <li><C>useMediaQuery('(min-width: 768px)')</C> — reactive to media</li>
        <li><C>{"useFetch<T>(url)"}</C> — simple data fetching (real apps use TanStack Query)</li>
      </ul>
      <Callout type="tip" title="No big hook library">
        Nothing is "built in" for any of these — hooks are so simple you just write them. Many are
        packaged in <C>usehooks.com</C> or <C>react-use</C> / <C>@uidotdev/usehooks</C> if you want
        a library.
      </Callout>

      <Practice>
        Write <C>useToggle</C>. Then the bonus: <C>useFetch</C>.
      </Practice>
    </Prose>
  );
}

function Instructions() {
  return (
    <>
      <p>
        Write <C>useToggle()</C>. Signature:{" "}
        <C>{"const [on, toggle, setOn] = useToggle(initial = false)"}</C>
      </p>
      <ul>
        <li><C>on</C>: boolean</li>
        <li><C>toggle</C>: <C>{"() => void"}</C></li>
        <li><C>setOn</C>: <C>{"(value: boolean) => void"}</C></li>
      </ul>
      <p>Use it in <C>{"<Exercise />"}</C> to control a details panel.</p>
      <p>
        <strong>Bonus:</strong> <C>{"useFetch<T>(url)"}</C> returns{" "}
        <C>{"{ data, error, loading }"}</C>. Assume JSON. Cancel in-flight requests when{" "}
        <C>url</C> changes. Handle errors. (Hint: <C>useEffect</C> +{" "}
        <C>AbortController</C>; don't <C>setState</C> after unmount/abort.) Try this one after{" "}
        <C>useToggle</C> works.
      </p>
    </>
  );
}

const vueSource = `<!-- useMouse.ts — Vue composable -->
<script lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0), y = ref(0)
  const handler = (e: MouseEvent) => { x.value = e.clientX; y.value = e.clientY }
  onMounted(() => window.addEventListener('mousemove', handler))
  onUnmounted(() => window.removeEventListener('mousemove', handler))
  return { x, y }
}
</script>

<!-- consumer -->
<script setup lang="ts">
import { useMouse } from './useMouse'
const { x, y } = useMouse()
</script>
<template>({{ x }}, {{ y }})</template>
`;

const lesson: Lesson = {
  slug: "12-custom-hooks",
  title: "Composables → custom hooks",
  subtitle: "The most 1:1 mapping in React. Rules of Hooks. When to extract.",
  Readme,
  Demo,
  demoSource,
  vueSource,
  Instructions,
  exerciseStarter,
  exerciseSolution,
};

export default lesson;
