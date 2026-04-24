import type { Lesson } from "../../types";
import { C, Callout, Code, Compare, Practice, Prose } from "../../ui/tutorial";
import Demo from "./Demo";
import demoSource from "./Demo.tsx?raw";
import exerciseStarter from "./Exercise.tsx?raw";
import exerciseSolution from "./Solution.tsx?raw";

function Readme() {
  return (
    <Prose>
      <h2><C>v-if</C> / <C>v-else</C> / <C>v-for</C> → JSX ternaries, <C>&&</C>, and <C>.map</C></h2>
      <p>JSX has no directives. You use JavaScript.</p>

      <h3>Conditionals</h3>
      <Compare
        items={[
          {
            vue: `v-if="x"`,
            react: `{x && <El/>}`,
            note: "Evaluates to false (renders nothing) or the element.",
          },
          {
            vue: `v-if="x" / v-else`,
            react: `{x ? <Yes/> : <No/>}`,
            note: "Ternary.",
          },
          {
            vue: `v-if / v-else-if / v-else`,
            react: "Chained ternaries, or extract to a function / component",
          },
          {
            vue: `v-show="x"`,
            react: `style={{ display: x ? 'block' : 'none' }}`,
            note: "Or a `hidden` attribute.",
          },
        ]}
      />

      <h3>The <C>&&</C> trap</h3>
      <p>
        <C>{"{count && <span>{count}</span>}"}</C> when <C>count === 0</C> renders the{" "}
        <strong>literal 0</strong>, because <C>{"0 && anything"}</C> evaluates to <C>0</C> and React
        renders numbers. Use an explicit check:
      </p>
      <Code lang="tsx">{`{count > 0 && <span>{count}</span>}`}</Code>
      <p>
        <C>false</C>, <C>null</C>, and <C>undefined</C> render nothing. Strings and numbers render
        their value. Arrays render each element in sequence.
      </p>

      <h3>Lists: <C>.map()</C></h3>
      <p>
        Vue has <C>v-for</C> with a <C>:key</C>. React has <C>array.map()</C> with a <C>key</C>{" "}
        prop — same idea, same rules.
      </p>
      <Code lang="tsx">{`<ul>
  {items.map(item => (
    <li key={item.id}>{item.label}</li>
  ))}
</ul>`}</Code>

      <h3>The <C>key</C> rule (critical — same as Vue)</h3>
      <p>
        Keys tell React (and Vue) which DOM node corresponds to which data item across renders. Use
        a <strong>stable, unique identifier from the data</strong> — almost always an <C>id</C> from
        the server. Bad keys cause:
      </p>
      <ul>
        <li>Input state attached to the wrong item when the list reorders</li>
        <li>Animations replaying</li>
        <li>Needless DOM churn</li>
      </ul>
      <p>
        <strong>Using array index as key:</strong> fine only if the list is append-only and never
        reorders or inserts in the middle. The moment you <C>.reverse()</C> or filter, indexes bind
        state to the wrong rows.
      </p>

      <Callout type="info">
        React enforces <C>key</C> with a runtime warning when missing. Vue does the same. Listen to
        it.
      </Callout>

      <h3><C>v-show</C> vs <C>v-if</C></h3>
      <p>React has no <C>v-show</C>. The distinction in Vue is:</p>
      <ul>
        <li><C>v-if</C> — removes the element from the DOM entirely</li>
        <li><C>v-show</C> — toggles <C>display: none</C></li>
      </ul>
      <p>
        In React, conditional rendering (<C>{"{x && <El/>}"}</C>) is <C>v-if</C>. For <C>v-show</C>,
        use a CSS class or inline <C>{"style={{ display: ... }}"}</C>. There's no built-in
        difference at the framework level — React always mounts/unmounts on the conditional.
      </p>

      <h3>Scoping with <C>{"<>...</>"}</C> inside lists</h3>
      <p>Sometimes you want to render two siblings per iteration without a wrapper:</p>
      <Code lang="tsx">{`{rows.map(r => (
  <Fragment key={r.id}>
    <dt>{r.term}</dt>
    <dd>{r.def}</dd>
  </Fragment>
))}`}</Code>
      <p>
        Note: the short <C>{"<>...</>"}</C> syntax <strong>cannot take a <C>key</C></strong>. Use{" "}
        <C>{"<Fragment key={...}>"}</C> from <C>'react'</C> when you need one. Vue's analogue is{" "}
        <C>{"<template v-for>"}</C>.
      </p>

      <h3>Extracting to functions for readability</h3>
      <p>Long ternary chains are unpleasant. Extract:</p>
      <Code lang="tsx">{`function StatusView({ status }) {
  if (status.kind === 'loading') return <Spinner />
  if (status.kind === 'error')   return <Error msg={status.msg} />
  return <List items={status.items} />
}`}</Code>
      <p>
        Early returns inside components are idiomatic — very different from Vue templates, where you
        can't just <C>return</C> early.
      </p>

      <Practice>
        The exercise is a loading / error / ready state machine — a pattern you'll write a hundred
        times in a React app.
      </Practice>
    </Prose>
  );
}

function Instructions() {
  return (
    <ol>
      <li>
        Show <C>{"<p>loading...</p>"}</C> when <C>status === 'loading'</C>. Show the{" "}
        <C>{"<ul>"}</C> of users when <C>status === 'ready'</C>. Show{" "}
        <C>{"<p>failed: {error}</p>"}</C> when <C>status === 'error'</C>.
      </li>
      <li>
        Render each user as <C>{"<li>"}</C>. Pick a <strong>good</strong> key{" "}
        <em>(hint: <C>user.id</C>, not the index)</em>.
      </li>
      <li>Filter out users with <C>archived: true</C> before rendering.</li>
      <li>If the filtered list is empty, show <C>{"<p>no active users</p>"}</C>.</li>
    </ol>
  );
}

const vueSource = `<script setup lang="ts">
import { ref } from 'vue'
const tab = ref<'a' | 'b' | 'c'>('a')
const showDetails = ref(false)
const items = ref([
  { id: 1, label: 'Alpha' },
  { id: 2, label: 'Beta' },
])
</script>

<template>
  <p v-if="showDetails">Here are the details.</p>
  <p v-else>Details hidden.</p>

  <p v-if="tab === 'a'">You chose A.</p>
  <p v-else-if="tab === 'b'">You chose B.</p>
  <p v-else>You chose C.</p>

  <ul>
    <li v-for="(item, i) in items" :key="item.id">
      #{{ i + 1 }}: {{ item.label }}
    </li>
  </ul>
</template>
`;

const lesson: Lesson = {
  slug: "05-conditionals-and-lists",
  title: "Conditionals & lists",
  subtitle: "v-if, v-else, v-for → ternaries, &&, .map. The key rule.",
  Readme,
  Demo,
  demoSource,
  vueSource,
  Instructions,
  exerciseStarter,
  exerciseSolution,
};

export default lesson;
