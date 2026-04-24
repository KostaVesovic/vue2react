import type { Lesson } from "../../types";
import { C, Callout, Code, Practice, Prose } from "../../ui/tutorial";
import Demo from "./Demo";
import demoSource from "./Demo.tsx?raw";
import exerciseStarter from "./Exercise.tsx?raw";
import exerciseSolution from "./Solution.tsx?raw";

function Readme() {
  return (
    <Prose>
      <h2>Template refs → <C>useRef</C></h2>
      <p>
        <C>useRef</C> is <strong>two features in one API</strong> that confuses Vue devs at first:
      </p>
      <ol>
        <li>
          <strong>Template ref</strong> — a handle to a DOM element (like Vue <C>ref=</C> on a tag).
        </li>
        <li>
          <strong>Mutable instance variable</strong> — a value that persists across renders but
          does <strong>not</strong> trigger re-renders when it changes. There's no Vue equivalent at
          this one API level — you'd use a regular <C>let</C> inside <C>setup</C> or a{" "}
          <C>shallowRef</C>. Different mental model.
        </li>
      </ol>

      <Code lang="tsx">{`const boxRef = useRef<HTMLInputElement>(null)   // case 1
const countRef = useRef(0)                       // case 2

<input ref={boxRef} />    // React sets boxRef.current = element on mount
countRef.current += 1     // mutate freely — no re-render`}</Code>

      <h3>Not the same as Vue's <C>ref</C>!</h3>
      <Callout type="gotcha" title="Vue's ref(0) ≠ React's useRef(0)">
        <ul>
          <li>
            <C>ref(0)</C> → reactive. Mutating <C>.value</C> triggers effects and re-renders.
          </li>
          <li>
            <C>useRef(0)</C> → <strong>not</strong> reactive. Mutating <C>.current</C> does nothing
            to renders.
          </li>
        </ul>
        <p>
          React's <C>useState</C> is what you want for reactive state. <C>useRef</C> is for{" "}
          <em>values that should survive renders but shouldn't cause them</em>.
        </p>
      </Callout>

      <h3>Accessing the DOM node</h3>
      <Code lang="tsx">{`const inputRef = useRef<HTMLInputElement>(null)

useEffect(() => {
  inputRef.current?.focus()
}, [])

return <input ref={inputRef} />`}</Code>
      <p>
        The <C>ref</C> prop on an HTML element is special — React attaches the DOM node to{" "}
        <C>.current</C> after mount, and sets it back to <C>null</C> on unmount.
      </p>

      <h3>When to reach for <C>useRef</C> (mutable box)</h3>
      <ul>
        <li>Keeping a timer ID so cleanup can clear it</li>
        <li>Tracking "previous value of prop" for diffing</li>
        <li>
          Storing an object that should not trigger re-renders when it changes (like a class-level{" "}
          <C>this.x</C> in OOP)
        </li>
        <li>
          Holding a cached value across renders when <C>useMemo</C> isn't appropriate (remember{" "}
          <C>useMemo</C> isn't a guarantee)
        </li>
      </ul>

      <Code lang="tsx">{`function Timer() {
  const idRef = useRef<number | null>(null)
  useEffect(() => {
    idRef.current = window.setInterval(() => console.log('tick'), 1000)
    return () => { if (idRef.current) clearInterval(idRef.current) }
  }, [])
}`}</Code>

      <h3>When NOT to use <C>useRef</C></h3>
      <p>
        If the UI should update when the value changes → <C>useState</C>, not <C>useRef</C>.{" "}
        <C>useRef</C> is for values where the UI <strong>doesn't</strong> care.
      </p>

      <h3>Forwarding refs to custom components</h3>
      <p>
        In React 19, <C>ref</C> is now just a regular prop — you can accept it in your component's
        prop list. No more <C>React.forwardRef</C> needed:
      </p>

      <Code lang="tsx">{`// React 19 style
function FancyInput({ ref, ...rest }: { ref?: Ref<HTMLInputElement> } & InputHTMLAttributes<HTMLInputElement>) {
  return <input ref={ref} {...rest} />
}

// pre-19 (classic codebases)
const FancyInput = forwardRef<HTMLInputElement, Props>((props, ref) => (
  <input ref={ref} {...props} />
))`}</Code>
      <p>
        Vue 3's <C>defineExpose</C> / <C>{"<script setup>"}</C> ref-forwarding is analogous.
      </p>

      <h3><C>useImperativeHandle</C></h3>
      <p>
        If you need to expose a controlled API on a ref (like Vue's <C>defineExpose</C>), React has{" "}
        <C>useImperativeHandle</C> — covered in lesson 21 (React-only features).
      </p>

      <Practice>Build a textarea with focus() and "undo to last blur" using two refs.</Practice>
    </Prose>
  );
}

function Instructions() {
  return (
    <ol>
      <li>Create a ref for the <C>{"<textarea>"}</C> element.</li>
      <li>
        The "clear & focus" button should empty the textarea (via state) AND call{" "}
        <C>.focus()</C> on the ref.
      </li>
      <li>
        Create a second ref that stores the last value <C>onBlur</C> so you can "undo" back to
        it. The undo button restores it. (The undo ref should NOT trigger re-renders when it
        changes.)
      </li>
    </ol>
  );
}

const vueSource = `<script setup lang="ts">
import { ref, onMounted } from 'vue'

const inputEl = ref<HTMLInputElement | null>(null)
const count = ref(0)

onMounted(() => inputEl.value?.focus())

function focus() { inputEl.value?.focus() }
</script>

<template>
  <input ref="inputEl" />
  <button @click="focus">focus</button>
  <p>count = {{ count }}</p>
</template>
`;

const lesson: Lesson = {
  slug: "13-useref",
  title: "Template refs → useRef",
  subtitle: "useRef = DOM handle AND mutable-not-reactive box. Don't confuse with Vue's ref().",
  Readme,
  Demo,
  demoSource,
  vueSource,
  Instructions,
  exerciseStarter,
  exerciseSolution,
};

export default lesson;
