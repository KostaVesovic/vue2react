import type { Lesson } from "../../types";
import { C, Code, Compare, Practice, Prose } from "../../ui/tutorial";
import Demo from "./Demo";
import demoSource from "./Demo.tsx?raw";
import exerciseStarter from "./Exercise.tsx?raw";
import exerciseSolution from "./Solution.tsx?raw";

function Readme() {
  return (
    <Prose>
      <h2>Components and props</h2>
      <p>A React component is a function. Props are its single argument.</p>

      <Code lang="tsx">{`interface Props { label: string; count?: number }

function Badge({ label, count }: Props) {
  return <span>{label}{count && \` (\${count})\`}</span>
}

// usage
<Badge label="new" count={3} />`}</Code>

      <h3>Vue → React cheat sheet</h3>
      <Compare
        items={[
          {
            vue: `defineProps<{ foo: string }>()`,
            react: `function C({ foo }: { foo: string })`,
          },
          {
            vue: `withDefaults(defineProps<...>(), { tone: 'info' })`,
            react: `Default in destructuring: { tone = 'info' }`,
          },
          {
            vue: `<comp :foo="x">`,
            react: `<Comp foo={x} />`,
          },
          {
            label: "Two-way binding",
            vue: `<comp :foo.sync=...> / v-model`,
            react: `<Comp value={x} onChange={setX} />`,
          },
          {
            label: "Spread attributes",
            vue: `v-bind="obj"`,
            react: `<Comp {...obj} />`,
          },
          {
            label: "Default slot",
            vue: `<slot />`,
            react: `{children}`,
          },
          {
            label: "Type-only import",
            vue: `—`,
            react: `import type { ReactNode } from 'react'`,
          },
        ]}
      />

      <h3>The "component is just a function" really is the model</h3>
      <p>
        Components don't own props — they <strong>receive</strong> them every render. Parent
        re-renders? Your function runs again with fresh props. There's no <C>props.foo</C> that
        becomes reactive on its own — the whole function re-executes.
      </p>

      <h3>PascalCase is mandatory</h3>
      <p>
        JSX treats <C>{"<foo />"}</C> as an HTML element and <C>{"<Foo />"}</C> as a component.
        Component <strong>names and their imported bindings</strong> must start with a capital.
      </p>
      <Code lang="tsx">{`import button from './Button'   // ❌ — JSX will render a <button> HTML element
import Button from './Button'   // ✅`}</Code>

      <h3>Typing props</h3>
      <p>Pick one style and stick to it:</p>
      <Code lang="tsx">{`// style A — interface (recommended)
interface Props { label: string; count?: number }
function Badge({ label, count }: Props) { ... }

// style B — inline
function Badge({ label, count }: { label: string; count?: number }) { ... }

// style C — avoid; can't be generic, conflicts with defaultProps on function components
const Badge: React.FC<Props> = ({ label }) => { ... }`}</Code>
      <p>
        Avoid <C>React.FC</C>. Prefer plain function signatures so you can make components generic
        and declare <C>children</C> explicitly when you accept them.
      </p>

      <h3><C>children</C> is the default slot</h3>
      <p>Everything you nest inside a component's tags arrives as the <C>children</C> prop:</p>
      <Code lang="tsx">{`<Card><p>hi</p></Card>

function Card({ children }: { children: ReactNode }) {
  return <section>{children}</section>
}`}</Code>
      <p>
        No slot names needed — but you <em>can</em> have multiple "slots" by passing JSX as named
        props. That's lesson 9.
      </p>

      <h3>Spreading props</h3>
      <Code lang="tsx">{`<button {...rest} onClick={handle} />`}</Code>
      <p>
        Same as Vue's <C>v-bind="obj"</C>. Useful for wrapper components that forward HTML
        attributes to the underlying element.
      </p>

      <h3>One-way data flow — props are immutable</h3>
      <p>
        Never mutate props. Never reassign them. If a child needs to "change" a prop, the parent
        passes a setter (next lesson). This is the same rule as Vue.
      </p>

      <h3>TypeScript niceties you'll reach for</h3>
      <Code lang="tsx">{`import type { ReactNode, ComponentProps } from 'react'

// accept any native <button> attr + my own:
type ButtonProps = ComponentProps<'button'> & { tone?: 'primary' | 'ghost' }

function Button({ tone = 'primary', ...rest }: ButtonProps) {
  return <button className={tone} {...rest} />
}`}</Code>

      <Practice>
        Build a <C>{"<Stat />"}</C> that's like Vue's{" "}
        <C>{'<Stat label="Revenue" :value="123">'}</C> but React-flavored.
      </Practice>
    </Prose>
  );
}

function Instructions() {
  return (
    <>
      <p>
        Build a <C>{"<Stat />"}</C> component that shows a label and a value.
      </p>
      <ol>
        <li>
          Define <C>Props</C> with:
          <ul>
            <li><C>label</C>: string (required)</li>
            <li><C>value</C>: number (required)</li>
            <li><C>suffix</C>: string (optional, default <C>""</C>)</li>
            <li>
              <C>children</C>: <C>ReactNode</C> (optional; renders below the value as a hint)
            </li>
          </ul>
        </li>
        <li>Destructure props in the function signature, default <C>suffix</C> to <C>""</C>.</li>
        <li>Render label, then value + suffix, then the children (if any) below.</li>
        <li>
          Spread props to <C>{"<Stat>"}</C>: use it three times in the page with different content.
        </li>
      </ol>
    </>
  );
}

const vueSource = `<!-- Badge.vue -->
<script setup lang="ts">
interface Props {
  label: string
  tone?: 'info' | 'warn' | 'danger'
  count?: number
}
const { label, tone = 'info', count } = defineProps<Props>()
</script>

<template>
  <span :class="tone">
    {{ label }}<span v-if="count !== undefined"> ({{ count }})</span>
  </span>
</template>

<!-- usage -->
<Badge label="new" />
<Badge label="unstable" tone="warn" />
<Badge label="deprecated" tone="danger" :count="12" />
`;

const lesson: Lesson = {
  slug: "07-components-props",
  title: "Components & props",
  subtitle: "defineProps → function arg. Typing props. Default values. children.",
  Readme,
  Demo,
  demoSource,
  vueSource,
  Instructions,
  exerciseStarter,
  exerciseSolution,
};

export default lesson;
