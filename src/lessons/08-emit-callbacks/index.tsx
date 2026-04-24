import type { Lesson } from "../../types";
import { C, Callout, Code, Compare, Practice, Prose } from "../../ui/tutorial";
import Demo from "./Demo";
import demoSource from "./Demo.tsx?raw";
import exerciseStarter from "./Exercise.tsx?raw";
import exerciseSolution from "./Solution.tsx?raw";

function Readme() {
  return (
    <Prose>
      <h2><C>defineEmits</C> / <C>$emit</C> → callback props</h2>
      <p>
        Vue has a dedicated event channel: children declare{" "}
        <C>{"defineEmits<{(e: 'save'): void}>()"}</C> and the parent listens with <C>@save</C>.{" "}
        <strong>React has no such channel.</strong> Children emit events by{" "}
        <em>calling a function the parent passed in as a prop</em>.
      </p>

      <Code lang="tsx">{`// child
interface Props { value: number; onIncrement: () => void }
function Counter({ value, onIncrement }: Props) {
  return <button onClick={onIncrement}>{value}</button>
}

// parent
<Counter value={count} onIncrement={() => setCount(c => c + 1)} />`}</Code>

      <h3>Naming convention</h3>
      <ul>
        <li>
          Event-style props start with <strong><C>on</C></strong> + PascalCase: <C>onClick</C>,{" "}
          <C>onSave</C>, <C>onUserSelect</C>.
        </li>
        <li>
          This isn't a language feature — React doesn't enforce it — it's a community convention
          so the code reads like events.
        </li>
        <li>
          The child has no restrictions on what it calls the prop, but follow the convention.
          Tooling and future-you will thank you.
        </li>
      </ul>

      <h3>Vue → React event mapping</h3>
      <Compare
        items={[
          {
            vue: `$emit('save', data)`,
            react: `call props.onSave(data)`,
          },
          {
            vue: `defineEmits<{(e:'save', x: Item): void}>()`,
            react: `onSave: (x: Item) => void in props`,
          },
          {
            label: "Two-way binding",
            vue: `v-model (:modelValue + @update:modelValue)`,
            react: `value + onChange props`,
          },
          {
            label: "Multiple models",
            vue: `v-model:foo`,
            react: `foo + onFooChange props`,
          },
          {
            label: "Listener modifiers",
            vue: `.once / .capture`,
            react: `implement in the handler`,
          },
        ]}
      />

      <h3>It's just functions — which means you can pass anything</h3>
      <p>Want to send multiple values? The callback takes multiple args:</p>
      <Code lang="tsx">{`onRangeChange={(min, max) => setRange({ min, max })}`}</Code>

      <p>Want to pass an object with metadata?</p>
      <Code lang="tsx">{`onSave={(data, { silent }) => ...}`}</Code>

      <p>
        Want an async result? Callbacks can return promises — the child can <C>await</C> them:
      </p>
      <Code lang="tsx">{`async function Save({ onSave }: { onSave: (data: X) => Promise<void> }) {
  const [saving, setSaving] = useState(false)
  return <button disabled={saving} onClick={async () => {
    setSaving(true)
    try { await onSave(data) } finally { setSaving(false) }
  }}>save</button>
}`}</Code>

      <h3>Lifting state up</h3>
      <p>
        The pattern here is called <strong>lifting state up</strong>: a child with no local state
        is easier to reason about, and the parent becomes the single source of truth. Very
        idiomatic in React. You'll build this muscle.
      </p>
      <Code lang="tsx">{`[Parent owns count]
  ├── <Counter value onIncrement onReset onChange>   (stateless, purely props)
  └── <History items={history}>`}</Code>
      <p>
        The Vue analogue is passing down a <C>ref</C> and emitting <C>update:</C> events — same
        pattern, different syntax.
      </p>

      <Callout type="gotcha" title="Gotchas">
        <ul>
          <li>
            <strong>
              Don't confuse <C>onClick</C> the prop with <C>onclick</C> the attribute.
            </strong>{" "}
            The <C>on</C>-prefixed name with a camelCased suffix is how JSX binds DOM event
            handlers. Your custom props follow the same convention by choice, not rule.
          </li>
          <li>
            <strong>Callbacks re-create every render.</strong>{" "}
            <C>{"onIncrement={() => ...}"}</C> is a new function each render — fine by default, but
            breaks <C>React.memo</C> on the child unless you wrap with <C>useCallback</C>. Don't
            preemptively optimize (lesson 20).
          </li>
        </ul>
      </Callout>

      <Practice>
        Exercise: a <C>{"<Tag />"}</C> with select + remove emits. Feel how ×'s click has to{" "}
        <C>stopPropagation</C> to avoid also selecting — because in React, event bubbling is just
        DOM bubbling; there's no <C>.stop</C> modifier to do it for you.
      </Practice>
    </Prose>
  );
}

function Instructions() {
  return (
    <>
      <p>
        Build a <C>{"<Tag />"}</C> component that emits two events:
      </p>
      <ul>
        <li><C>onSelect(tag: string)</C> when clicked</li>
        <li><C>onRemove(tag: string)</C> when the × button is clicked</li>
      </ul>
      <p>The parent tracks which tag is <C>selected</C> and removes tags from a list.</p>
      <ol>
        <li>
          Type <C>TagProps</C> with <C>label</C>, <C>selected</C>, <C>onSelect</C>, <C>onRemove</C>.
        </li>
        <li>
          Render the label and an × button. Clicking the body calls <C>onSelect</C>; clicking × calls{" "}
          <C>onRemove</C>. Make sure × does NOT also trigger <C>onSelect</C>!
        </li>
      </ol>
      <Callout type="tip">
        Hint: <C>e.stopPropagation</C>
      </Callout>
    </>
  );
}

const vueSource = `<!-- Counter.vue -->
<script setup lang="ts">
const props = defineProps<{ value: number }>()
const emit = defineEmits<{
  (e: 'increment'): void
  (e: 'reset'): void
  (e: 'change', next: number): void
}>()
</script>

<template>
  <button @click="emit('reset')">reset</button>
  <button @click="emit('increment')">+1</button>
  <input type="number"
    :value="value"
    @input="e => emit('change', Number((e.target as HTMLInputElement).value))" />
</template>

<!-- parent -->
<Counter :value="count"
  @increment="count++"
  @reset="count = 0"
  @change="n => count = n" />
`;

const lesson: Lesson = {
  slug: "08-emit-callbacks",
  title: "Emit → callback props",
  subtitle: "$emit doesn't exist. Pass functions as props named onSomething.",
  Readme,
  Demo,
  demoSource,
  vueSource,
  Instructions,
  exerciseStarter,
  exerciseSolution,
};

export default lesson;
