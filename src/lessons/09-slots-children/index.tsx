import type { Lesson } from "../../types";
import { C, Code, Compare, Practice, Prose, SideBySide } from "../../ui/tutorial";
import Demo from "./Demo";
import demoSource from "./Demo.tsx?raw";
import exerciseStarter from "./Exercise.tsx?raw";
import exerciseSolution from "./Solution.tsx?raw";

function Readme() {
  return (
    <Prose>
      <h2>Slots → <C>children</C> + JSX-as-props + render props</h2>
      <p>
        Vue has three slot flavors; React covers all three with the same one idea:{" "}
        <strong>JSX can be passed as a prop</strong>.
      </p>

      <h3>1. Default slot → <C>children</C></h3>
      <SideBySide
        caption="The default slot is just a prop named children."
        vue={`<!-- usage -->
<Card><p>hi</p></Card>

<!-- inside Card -->
<section><slot /></section>`}
        react={`// usage
<Card><p>hi</p></Card>

function Card({ children }: { children: ReactNode }) {
  return <section>{children}</section>
}`}
      />
      <p>
        The <strong><C>children</C> prop</strong> is automatically set to whatever you nest between
        the tags. Type it as <C>ReactNode</C> (accepts strings, numbers, JSX, arrays, fragments,
        null).
      </p>

      <h3>2. Named slots → JSX-as-props</h3>
      <SideBySide
        caption="Named slots become named props whose value is JSX."
        vue={`<Layout>
  <template #header><h1>app</h1></template>
  <template #sidebar><nav>...</nav></template>
  default content
</Layout>`}
        react={`<Layout
  header={<h1>app</h1>}
  sidebar={<nav>...</nav>}
>
  default content
</Layout>`}
      />
      <p>
        There's no special syntax. A prop named <C>header</C> is of type <C>ReactNode</C> — it
        accepts any JSX. React's "no special syntax" is exactly the trick: slots are props, props
        can be JSX, done.
      </p>

      <h3>3. Scoped slots → render props</h3>
      <SideBySide
        caption="When the slot needs data from the child, pass a function that returns JSX."
        vue={`<DataList :items="users">
  <template #item="{ row }">
    <b>{{ row.name }}</b>
  </template>
</DataList>`}
        react={`<DataList
  items={users}
  renderItem={(row, i) => <b>{row.name}</b>}
/>

function DataList<T>({ items, renderItem }: {
  items: T[]
  renderItem: (item: T, i: number) => ReactNode
}) {
  return <ul>{items.map((it, i) => <li key={i}>{renderItem(it, i)}</li>)}</ul>
}`}
      />
      <p>
        You can also use <C>children</C> itself as a function — it looks a little weirder but is
        idiomatic for things like a mouse-position tracker:
      </p>
      <Code lang="tsx">{`<Mouse>{({ x, y }) => <p>{x}, {y}</p>}</Mouse>`}</Code>

      <h3>Comparison table</h3>
      <Compare
        items={[
          {
            label: "Default slot",
            vue: `<slot />`,
            react: `{children}`,
          },
          {
            label: "Named slot",
            vue: `<slot name="header" />`,
            react: `JSX prop: header={...}`,
          },
          {
            label: "Scoped slot",
            vue: `<slot :row="row" />`,
            react: `render prop: renderItem={row => ...}`,
          },
          {
            label: "Fallback content",
            vue: `<slot name="header">fallback</slot>`,
            react: `{header ?? <DefaultHeader />}`,
          },
          {
            label: "Check if slot present",
            vue: `v-if="$slots.header"`,
            react: `just check children / prop is truthy`,
          },
        ]}
      />

      <h3>Fallback content</h3>
      <p>
        Vue slots support fallback with <C>{"<slot>fallback</slot>"}</C>. In React you write the
        same logic yourself:
      </p>
      <Code lang="tsx">{`<div>{children ?? <p>no content</p>}</div>`}</Code>

      <h3>Multiple roots + <C>{"<slot>"}</C></h3>
      <p>
        Vue 3 supports multiple root nodes; React supports Fragments. Neither affects slot
        semantics.
      </p>

      <h3>Why this ergonomically matters</h3>
      <p>Because slots are "just props" in React, you can do things that are awkward in Vue:</p>
      <ul>
        <li>Store a slot in a local variable, transform it, and render it</li>
        <li>Pass slots through <C>memo</C>d wrappers (careful — identity)</li>
        <li>Compose with higher-order components without special plumbing</li>
      </ul>
      <p>
        The flip side: there's no static "slot schema" like Vue's <C>{"<slot name>"}</C>. Typing
        is your friend here — always type <C>ReactNode</C> / <C>{"(args) => ReactNode"}</C> props.
      </p>

      <Practice>
        Build a <C>{"<Modal title actions>{body}</Modal>"}</C> that uses <em>all three</em>{" "}
        patterns.
      </Practice>
    </Prose>
  );
}

function Instructions() {
  return (
    <>
      <p>
        Build a <C>{"<Modal />"}</C> with:
      </p>
      <ul>
        <li><C>title</C> (string)</li>
        <li><C>children</C> (body content — default slot)</li>
        <li><C>actions</C> (footer — named slot as a prop)</li>
        <li><C>open</C> / <C>onClose</C></li>
      </ul>
      <ol>
        <li>Render the overlay + modal body when <C>open</C> is true.</li>
        <li>
          Clicking the overlay (but NOT the modal body) should call <C>onClose</C>.
        </li>
        <li>
          Render <C>title</C>, <C>children</C>, and <C>actions</C> in the appropriate places.
        </li>
      </ol>
    </>
  );
}

const vueSource = `<!-- Card.vue -->
<template>
  <section class="card"><slot /></section>
</template>

<!-- Layout.vue -->
<template>
  <div class="layout">
    <div class="h"><slot name="header" /></div>
    <div class="sb"><slot name="sidebar" /></div>
    <div class="main"><slot /></div>
    <div v-if="$slots.footer" class="f"><slot name="footer" /></div>
  </div>
</template>

<!-- DataList.vue (scoped slot) -->
<template>
  <ul>
    <li v-for="(item, i) in items" :key="i">
      <slot name="item" :row="item" :index="i" />
    </li>
  </ul>
</template>

<!-- usage -->
<Layout>
  <template #header><b>my app</b></template>
  <template #sidebar><nav /></template>
  <p>main content</p>
</Layout>

<DataList :items="users">
  <template #item="{ row }">
    <b>{{ row.name }}</b>
  </template>
</DataList>
`;

const lesson: Lesson = {
  slug: "09-slots-children",
  title: "Slots → children / JSX props / render props",
  subtitle: "Default, named, and scoped slots all collapse to one idea: JSX is a value.",
  Readme,
  Demo,
  demoSource,
  vueSource,
  Instructions,
  exerciseStarter,
  exerciseSolution,
};

export default lesson;
