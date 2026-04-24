import type { Lesson } from "../../types";
import { C, Callout, Code, Compare, Practice, Prose } from "../../ui/tutorial";
import Demo from "./Demo";
import demoSource from "./Demo.tsx?raw";
import exerciseStarter from "./Exercise.tsx?raw";
import exerciseSolution from "./Solution.tsx?raw";

function Readme() {
  return (
    <Prose>
      <h2><C>@click</C> / <C>v-model</C> / modifiers → <C>onClick</C>, controlled inputs, and JS</h2>
      <p>
        Vue's template has a ton of magic for events: <C>@click</C>, <C>v-model</C>, modifiers like{" "}
        <C>.prevent</C>, <C>.stop</C>, <C>.self</C>, <C>.capture</C>, <C>.enter</C>. React has{" "}
        <strong>none</strong> of that. You wire up everything by hand — which is more verbose, but
        there's no DSL to learn.
      </p>

      <h3>Event handlers</h3>
      <Compare
        items={[
          {
            vue: `@click="handler"`,
            react: `onClick={handler}`,
          },
          {
            vue: `@click="count++"`,
            react: `onClick={() => setCount(c => c + 1)}`,
          },
          {
            vue: `@click.prevent`,
            react: `onClick={e => { e.preventDefault(); ... }}`,
          },
          {
            vue: `@click.stop`,
            react: `onClick={e => { e.stopPropagation(); ... }}`,
          },
          {
            vue: `@click.once`,
            react: "Remove the handler after first call, or set a flag",
          },
          {
            vue: `@keydown.enter`,
            react: `onKeyDown={e => { if (e.key === 'Enter') ... }}`,
          },
          {
            vue: `@click.capture`,
            react: `onClickCapture={...}`,
          },
        ]}
      />
      <p>
        Note: the event handler name is always <C>on</C> + PascalCase event. <C>onMouseEnter</C>,{" "}
        <C>onFocus</C>, <C>onBlur</C>, <C>onSubmit</C>, etc.
      </p>

      <h3>The event object</h3>
      <p>
        React wraps native events in a <strong>SyntheticEvent</strong> with a normalized
        cross-browser interface. You get <C>e.target</C>, <C>e.currentTarget</C>,{" "}
        <C>e.preventDefault()</C>, <C>e.key</C>, etc., just like native. Mostly interchangeable.
      </p>

      <h3>Two-way binding: there is no <C>v-model</C> in React</h3>
      <p>Instead, you write both halves explicitly. This is called a <strong>controlled input</strong>:</p>
      <Code lang="tsx">{`<input value={name} onChange={e => setName(e.target.value)} />`}</Code>
      <ul>
        <li><C>value</C> is the source of truth — React keeps the DOM in sync.</li>
        <li>
          <C>onChange</C> fires on every keystroke (note: <C>onChange</C> in React, not{" "}
          <C>onInput</C>) and you update state.
        </li>
      </ul>

      <Callout type="gotcha" title="onChange fires on every keystroke">
        React's <C>onChange</C> is actually wired to the DOM's <C>input</C> event, so it fires on
        every keystroke — unlike vanilla JS where <C>change</C> fires on blur.
      </Callout>

      <h3>Checkboxes and selects</h3>
      <Code lang="tsx">{`<input
  type="checkbox"
  checked={agreed}
  onChange={e => setAgreed(e.target.checked)}
/>

<select value={color} onChange={e => setColor(e.target.value)}>
  <option value="red">red</option>
</select>

<input
  type="radio"
  name="size"
  value="md"
  checked={size === 'md'}
  onChange={e => setSize(e.target.value)}
/>`}</Code>

      <h3><C>v-model.number</C>, <C>v-model.trim</C>, <C>v-model.lazy</C></h3>
      <p>No direct equivalent — transform in the <C>onChange</C>:</p>
      <Code lang="tsx">{`onChange={e => setCount(Number(e.target.value))}         // .number
onChange={e => setName(e.target.value.trim())}           // .trim
onBlur={e => setName(e.target.value)}                    // .lazy`}</Code>

      <h3>Custom component "v-model" — just pass a setter down</h3>
      <p>
        In Vue, child components can <C>defineModel()</C> or emit <C>update:modelValue</C> and
        parents use <C>v-model</C>. In React, the parent passes both the value and a setter:
      </p>
      <Code lang="tsx">{`<FancyInput value={name} onChange={setName} />

// Inside FancyInput:
interface Props { value: string; onChange: (next: string) => void }
function FancyInput({ value, onChange }: Props) {
  return <input value={value} onChange={e => onChange(e.target.value)} />
}`}</Code>
      <p>
        The convention for the pair is <C>value</C> + <C>onChange</C>, <C>checked</C> +{" "}
        <C>onChange</C>, <C>open</C> + <C>onOpenChange</C>, etc. There's nothing framework-y — it's
        just props.
      </p>

      <h3>Uncontrolled inputs (lesson 14 goes deeper)</h3>
      <p>
        React also supports <strong>uncontrolled</strong> inputs — the DOM owns the value and you
        read it on submit. Useful for non-reactive forms. No equivalent in Vue-land since templates
        are always reactive.
      </p>

      <Practice>
        Build a login form. The goal is muscle memory for <C>value</C> + <C>onChange</C> + disabled
        state derived from values.
      </Practice>
    </Prose>
  );
}

function Instructions() {
  return (
    <>
      <p>Build a login form.</p>
      <ol>
        <li>Bind <C>email</C> and <C>password</C> as controlled inputs.</li>
        <li>
          The "sign in" button should be <strong>disabled</strong> if <C>email</C> doesn't include{" "}
          <C>'@'</C> or <C>password</C> is shorter than 6 chars.
        </li>
        <li>
          On submit (either Enter key or button click), set <C>submitted</C> to the email/password
          pair, and prevent the default form submission.
        </li>
        <li>
          Add a "show password" toggle that swaps the input's type between <C>"password"</C> and{" "}
          <C>"text"</C>.
        </li>
      </ol>
    </>
  );
}

const vueSource = `<script setup lang="ts">
import { ref } from 'vue'
const name = ref('Ada')
const agreed = ref(false)
const color = ref('blue')
const log = ref<string[]>([])

const append = (s: string) => { log.value = [...log.value, s].slice(-5) }
</script>

<template>
  <button @click="append('clicked')">click me</button>
  <button @click.prevent.stop="append('prevented')">stop + prevent</button>

  <input v-model="name" />
  <p>hello, {{ name }}!</p>

  <input type="checkbox" v-model="agreed" />

  <select v-model="color">
    <option value="red">red</option>
    <option value="blue">blue</option>
  </select>

  <form @submit.prevent="append('submitted')">
    <input @keydown.enter="append('enter')" />
    <button type="submit">go</button>
  </form>
</template>
`;

const lesson: Lesson = {
  slug: "06-events-vmodel",
  title: "Events & v-model",
  subtitle: "@click → onClick. v-model → value + onChange. No modifiers — just JS.",
  Readme,
  Demo,
  demoSource,
  vueSource,
  Instructions,
  exerciseStarter,
  exerciseSolution,
};

export default lesson;
