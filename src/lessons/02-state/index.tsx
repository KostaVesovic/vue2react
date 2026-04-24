import type { Lesson } from "../../types";
import { C, Callout, Code, Practice, Prose, SideBySide } from "../../ui/tutorial";
import Demo from "./Demo";
import demoSource from "./Demo.tsx?raw";
import exerciseStarter from "./Exercise.tsx?raw";
import exerciseSolution from "./Solution.tsx?raw";

function Readme() {
  return (
    <Prose>
      <h2><C>ref</C> / <C>reactive</C> → <C>useState</C></h2>
      <p>
        Vue has <strong>automatic reactivity</strong>: mutate a <C>ref</C> or a <C>reactive</C> object
        and the template re-runs. React has <strong>explicit state</strong>: you get back a read-only
        snapshot and a setter, and you call the setter to schedule a re-render.
      </p>

      <SideBySide
        vue={`const count = ref(0)
count.value++                    // mutates in place; template updates`}
        react={`const [count, setCount] = useState(0)
setCount(count + 1)              // schedules a new render`}
      />

      <h3>The mental model</h3>
      <p>
        <C>useState</C> returns a <strong>tuple</strong>: <C>[currentValue, setterFunction]</C>. You
        name them yourself by destructuring. The setter replaces the value; the component re-runs;
        your JSX sees the new value on the next render. <strong>Mutation does nothing.</strong>
      </p>
      <Code lang="tsx">{`const [user, setUser] = useState({ name: 'Ada', age: 36 })

// silent no-op — React does not know you changed anything
user.age = 37

// create a new object
setUser({ ...user, age: 37 })`}</Code>

      <Callout type="info" title="If you came from Vue 2 / Options API">
        This is the same rule you already know (<C>{"this.user = { ...this.user, age: 37 }"}</C>{" "}
        style). If you used Vue 3 <C>reactive()</C>, React feels more like Redux / Immer.
      </Callout>

      <h3>Stale closures — the #1 surprise for Vue devs</h3>
      <p>
        Inside a React component, every render is a <strong>fresh function call</strong>. Variables
        you close over (like <C>count</C>) are snapshots of that render's values. Consider:
      </p>
      <Code lang="tsx">{`function Counter() {
  const [count, setCount] = useState(0)
  const addTwo = () => {
    setCount(count + 1)   // count === 0, schedules 1
    setCount(count + 1)   // count === 0 still! schedules 1 again
  }
  return <button onClick={addTwo}>+2</button>   // actually adds 1
}`}</Code>
      <p>
        Fix: use the <strong>functional form</strong>, which receives the queued value:
      </p>
      <Code lang="tsx">{`setCount(c => c + 1)   // 0 -> 1
setCount(c => c + 1)   // 1 -> 2`}</Code>
      <p>
        Rule of thumb: <strong>if the next value depends on the previous, use <C>{"c => ..."}</C>.</strong>
      </p>

      <h3>Batching</h3>
      <p>
        React batches all <C>setX</C> calls made in the same event handler into one render. Vue 3
        does similar with <C>nextTick()</C>; the effect is familiar. In React, batching also covers
        async boundaries (React 18+).
      </p>

      <h3>What about <C>{"reactive({...})"}</C> — is there an equivalent?</h3>
      <p>Not really built in. You'd either:</p>
      <ul>
        <li>Use multiple <C>useState</C> hooks (common)</li>
        <li>Use <C>useReducer</C> for related fields (covered in lesson 21)</li>
        <li>Reach for Zustand / Jotai / Redux Toolkit for complex shared state (lesson 19)</li>
        <li>Use <strong>Immer</strong> (<C>useImmer</C>) to get mutation-style syntax that produces new objects</li>
      </ul>
      <Code lang="tsx">{`// with immer (a common pairing)
import { useImmer } from 'use-immer'
const [user, updateUser] = useImmer({ name: 'Ada', age: 36 })
updateUser(u => { u.age++ })   // feels like Vue's reactive`}</Code>

      <h3>Common traps for Vue devs</h3>
      <ul>
        <li>
          <strong>Don't put derived values in state.</strong> If <C>fullName</C> is{" "}
          <C>first + last</C>, don't <C>useState</C> it — compute it during render (next lesson:{" "}
          <C>useMemo</C>).
        </li>
        <li>
          <strong>Objects and arrays compare by reference.</strong> <C>setUser(user)</C> with the
          same reference will bail out; React won't re-render. Always spread.
        </li>
        <li>
          <strong>Initializer runs every render unless you pass a function.</strong> For expensive
          initial values:
          <Code lang="tsx">{`useState(() => expensiveCompute())   // lazy initializer — called once`}</Code>
        </li>
      </ul>

      <Practice>
        Exercise tab — build a counter + name input. Feel the stale-closure bug by trying both forms
        on the +2 button.
      </Practice>
    </Prose>
  );
}

function Instructions() {
  return (
    <>
      <p>Build a tiny counter + name editor.</p>
      <ol>
        <li>Add <C>useState</C> for <C>count</C> (starting at 10) and <C>name</C> (starting at <C>""</C>).</li>
        <li>Wire up the + / - buttons.</li>
        <li>Bind the input so typing updates <C>name</C>. <em>(Hint: <C>value</C> + <C>onChange</C>)</em></li>
        <li>
          The "double click" button should add 2 to count, using the <strong>functional form</strong>{" "}
          so two rapid clicks both count. Try both forms to see the bug.
        </li>
      </ol>
    </>
  );
}

const vueSource = `<script setup lang="ts">
import { ref, reactive } from 'vue'

const count = ref(0)
const user = reactive({ name: 'Ada', age: 36 })
const todos = ref<string[]>([])
</script>

<template>
  <h3>count: {{ count }}</h3>
  <button @click="count++">+1</button>
  <button @click="count += 2">+2</button>

  <h3>user: {{ user.name }}, {{ user.age }}</h3>
  <button @click="user.age++">birthday</button>

  <h3>todos: {{ todos.length }}</h3>
  <button @click="todos.push(\`todo \${todos.length + 1}\`)">add</button>
  <ul>
    <li v-for="(t, i) in todos" :key="i">{{ t }}</li>
  </ul>
</template>
`;

const lesson: Lesson = {
  slug: "02-state",
  title: "State: useState",
  subtitle: "ref/reactive → useState. Why mutation does nothing and what to do instead.",
  Readme,
  Demo,
  demoSource,
  vueSource,
  Instructions,
  exerciseStarter,
  exerciseSolution,
};

export default lesson;
