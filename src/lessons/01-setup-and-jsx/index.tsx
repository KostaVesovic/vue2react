import type { Lesson } from "../../types";
import { C, Callout, Code, Compare, Practice, Prose, SideBySide } from "../../ui/tutorial";
import Demo from "./Demo";
import demoSource from "./Demo.tsx?raw";
import exerciseStarter from "./Exercise.tsx?raw";
import exerciseSolution from "./Solution.tsx?raw";

function Readme() {
  return (
    <Prose>
      <h2>The mental shift: template + script → one function that returns UI</h2>
      <p>
        A Vue SFC has <strong>three separate blocks</strong> (<C>{"<template>"}</C>,{" "}
        <C>{"<script setup>"}</C>, <C>{"<style>"}</C>).
        A React component is <strong>one function</strong> that returns the markup directly using JSX.
      </p>

      <SideBySide
        caption="The same 'hello name' component in each framework."
        vue={`<script setup lang="ts">
const name = 'World'
</script>
<template>
  <h1 class="title">Hello {{ name }}</h1>
</template>`}
        react={`export default function Hello() {
  const name = 'World';
  return <h1 className="title">Hello {name}</h1>;
}`}
      />

      <h3>JSX is not HTML</h3>
      <p>It looks like HTML but it compiles to function calls. The rules that surprise Vue devs:</p>

      <Compare
        items={[
          {
            label: "CSS class",
            vue: `class="foo"`,
            react: `className="foo"`,
            note: "class is a reserved JS keyword.",
          },
          {
            label: "Label's for attribute",
            vue: `for="id"`,
            react: `htmlFor="id"`,
          },
          {
            label: "Inline styles",
            vue: `style="color: red"`,
            react: `style={{ color: 'red' }}`,
            note: "Object, camelCased CSS keys.",
          },
          {
            label: "Text interpolation",
            vue: `{{ expr }}`,
            react: `{expr}`,
            note: "Single braces. Any JS expression.",
          },
          {
            label: "Invisible wrapper",
            vue: `<template>...</template>`,
            react: `<>...</>`,
            note: "React calls it a Fragment.",
          },
          {
            label: "Self-closing tags",
            vue: `<br> (optional)`,
            react: `<br /> (required)`,
          },
          {
            label: "Multiple root nodes",
            vue: "Allowed",
            react: "Must return one node (wrap in Fragment).",
          },
          {
            label: "Custom component casing",
            vue: `<my-button>`,
            react: `<MyButton>`,
            note: "Lowercase = HTML, PascalCase = component.",
          },
        ]}
      />

      <h3>The biggest surprise: JSX is JavaScript</h3>
      <p>
        Anything inside <C>{"{}"}</C> is a JavaScript expression. <C>{"{if (...)}"}</C> does{" "}
        <strong>not</strong> work — <C>if</C> is a statement. You use ternaries and <C>&&</C>:
      </p>
      <Code lang="tsx">{`{isLoggedIn ? <Dashboard /> : <Login />}
{items.length > 0 && <List items={items} />}`}</Code>
      <p>
        This isn't a React limitation — it's just JavaScript. Once it clicks, it's liberating: you
        can <C>.map()</C>, <C>.filter()</C>, spread, destructure — all inside your markup.
      </p>

      <h3>Styles and scoping</h3>
      <p>
        Vue's <C>{"<style scoped>"}</C> has no React equivalent out of the box. Your options:
      </p>
      <ul>
        <li>
          <strong>CSS files</strong> imported at the top of the component (global — scope yourself
          with BEM or class prefixes)
        </li>
        <li>
          <strong>CSS Modules</strong> (<C>styles.module.css</C> +{" "}
          <C>{`import styles from './foo.module.css'`}</C>) — scoped automatically
        </li>
        <li>
          <strong>Tailwind</strong> (utility classes in <C>className</C>) — extremely popular in
          React
        </li>
        <li>
          <strong>CSS-in-JS</strong> (styled-components, emotion, vanilla-extract) — going out of
          fashion
        </li>
      </ul>
      <p>
        Pick whichever fits your team — the choice is orthogonal to learning React itself.
      </p>

      <Callout type="gotcha" title="Gotchas for Vue devs">
        <ul>
          <li>
            <strong>Components must start with a capital letter.</strong>{" "}
            <C>{"<button />"}</C> is an HTML button; <C>{"<Button />"}</C> is your component.
            Lowercase components won't render.
          </li>
          <li>
            <strong>Comments inside JSX go in braces</strong>: <C>{"{/* like this */}"}</C>. Regular{" "}
            <C>{"// ..."}</C> only works outside JSX.
          </li>
          <li>
            <strong>Whitespace is collapsed</strong> between tags more aggressively than HTML. For
            literal spaces inside interpolations use <C>{"{' '}"}</C>.
          </li>
        </ul>
      </Callout>

      <Practice>Open the <strong>Exercise</strong> tab and fix the four TODOs.</Practice>
    </Prose>
  );
}

function Instructions() {
  return (
    <ol>
      <li>Rename the <C>class</C> attribute to the React equivalent.</li>
      <li>Fix the inline style — it should be a JS object with camelCase keys.</li>
      <li>Render the <C>fruits</C> array as a <C>{"<ul>"}</C> of <C>{"<li>"}</C> items (add proper keys).</li>
      <li>Only show the "VIP" badge when <C>isVip</C> is true.</li>
    </ol>
  );
}

const vueSource = `<script setup lang="ts">
const name = 'React'
const items = ['props', 'state', 'effects']
const isPrimary = true
</script>

<template>
  <div>
    <h3 :class="isPrimary ? 'primary' : 'secondary'">
      Hello from {{ name }}!
    </h3>
    <p>2 + 2 = {{ 2 + 2 }}</p>
    <p :style="{ color: '#7aa2f7', fontWeight: 600 }">
      camelCased CSS keys, not kebab-case.
    </p>
    <ul>
      <li v-for="item in items" :key="item">{{ item }}</li>
    </ul>
    <small>Fragments let you return sibling nodes.</small>
  </div>
</template>
`;

const lesson: Lesson = {
  slug: "01-setup-and-jsx",
  title: "Setup & JSX",
  subtitle: "Vue SFC → React function component. How JSX differs from templates.",
  Readme,
  Demo,
  demoSource,
  vueSource,
  Instructions,
  exerciseStarter,
  exerciseSolution,
};

export default lesson;
