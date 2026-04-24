import type { Lesson } from "../../types";
import { C, Callout, Code, Practice, Prose } from "../../ui/tutorial";
import Demo from "./Demo";
import demoSource from "./Demo.tsx?raw";
import exerciseStarter from "./Exercise.tsx?raw";
import exerciseSolution from "./Solution.tsx?raw";

function Readme() {
  return (
    <Prose>
      <h2>Suspense and error boundaries</h2>

      <h3>Suspense — similar in both frameworks</h3>
      <p>
        Vue 3 has <C>{"<Suspense>"}</C> with an async <C>default</C> slot + <C>fallback</C>.
        React's <C>{"<Suspense>"}</C> does almost the same: render a fallback while any descendant
        "suspends" (throws a promise internally).
      </p>
      <Code lang="tsx">{`import { Suspense, lazy } from 'react'

const HeavyChart = lazy(() => import('./HeavyChart'))

<Suspense fallback={<Spinner />}>
  <HeavyChart />
</Suspense>`}</Code>

      <p>Triggers:</p>
      <ul>
        <li>
          <C>{"React.lazy(() => import(...))"}</C> — code-splitting boundaries
        </li>
        <li>
          <strong>Data-fetching libs that integrate with Suspense</strong> — TanStack Query,{" "}
          <C>use()</C> with a promise (React 19), Relay, etc.
        </li>
        <li>
          The React 19 <C>use(promise)</C> hook lets you <C>await</C>-like in render
        </li>
      </ul>
      <Callout type="warn" title="Don't roll your own">
        You <strong>cannot</strong> just <C>await</C> an arbitrary promise in a component — you need
        a library that integrates with Suspense. Don't try to build this by hand.
      </Callout>

      <h3>Error boundaries — React has no hook-based API for this</h3>
      <Callout type="gotcha" title="The last class component">
        <strong>
          This is the single place in React 19 where you still write a class component.
        </strong>
        <p>
          Why: only class lifecycle methods (<C>getDerivedStateFromError</C>,{" "}
          <C>componentDidCatch</C>) can intercept errors thrown during child render.
        </p>
      </Callout>

      <Code lang="tsx">{`class ErrorBoundary extends Component<Props, { error: Error | null }> {
  state = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }                      // sets state so render shows fallback
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logToSentry(error, info)              // side-effect: report
  }

  render() {
    if (this.state.error) return this.props.fallback
    return this.props.children
  }
}

<ErrorBoundary fallback={<p>Something broke.</p>}>
  <App />
</ErrorBoundary>`}</Code>

      <h3>Vue's <C>onErrorCaptured</C> → error boundary</h3>
      <p>
        Same philosophy, different API. In React you write the class once and reuse. The{" "}
        <strong><C>react-error-boundary</C></strong> library gives you a function-component-friendly
        wrapper — most codebases use it:
      </p>
      <Code lang="tsx">{`import { ErrorBoundary } from 'react-error-boundary'

<ErrorBoundary
  fallbackRender={({ error, resetErrorBoundary }) => (
    <div>Oh no. {error.message} <button onClick={resetErrorBoundary}>retry</button></div>
  )}
  onReset={() => window.location.reload()}
>
  <App />
</ErrorBoundary>`}</Code>

      <h3>What error boundaries CAN'T catch</h3>
      <ul>
        <li>Errors in event handlers (they're not in render) — use try/catch</li>
        <li>Errors in async code (same)</li>
        <li>SSR errors</li>
        <li>Errors in the boundary itself</li>
      </ul>

      <h3>Putting it together: Suspense + ErrorBoundary</h3>
      <p>The idiomatic pattern is to wrap async UI with both:</p>
      <Code lang="tsx">{`<ErrorBoundary fallback={<Error />}>
  <Suspense fallback={<Spinner />}>
    <AsyncWidget />
  </Suspense>
</ErrorBoundary>`}</Code>
      <p>
        Any network or render error → error boundary. Loading / code-splitting → Suspense fallback.
      </p>

      <Practice>
        Upgrade the provided error boundary with <C>onError</C> and <C>resetKey</C> (a prop that,
        when changed, resets the boundary's state — a very common pattern).
      </Practice>
    </Prose>
  );
}

function Instructions() {
  return (
    <>
      <p>Turn the provided class <C>ErrorBoundary</C> into a reusable one:</p>
      <ol>
        <li>Accept an optional <C>onError</C> prop that logs the error.</li>
        <li>
          Add a <C>resetKey</C> prop — if it changes, reset the error state. (Hint:{" "}
          <C>getDerivedStateFromProps</C> or <C>componentDidUpdate</C>.)
        </li>
        <li>Wrap <C>{"<Widget />"}</C> below and test it.</li>
      </ol>
    </>
  );
}

const vueSource = `<template>
  <!-- Suspense -->
  <Suspense>
    <template #default>
      <HeavyChart />
    </template>
    <template #fallback>
      <Spinner />
    </template>
  </Suspense>
</template>

<!-- Error "boundary" via onErrorCaptured -->
<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const error = ref<Error | null>(null)
onErrorCaptured((e) => { error.value = e; return false })
</script>

<template>
  <div v-if="error">Something broke: {{ error.message }}</div>
  <slot v-else />
</template>
`;

const lesson: Lesson = {
  slug: "16-suspense-errors",
  title: "Suspense & error boundaries",
  subtitle: "<Suspense> is similar. Error boundaries still need a class — and that's OK.",
  Readme,
  Demo,
  demoSource,
  vueSource,
  Instructions,
  exerciseStarter,
  exerciseSolution,
};

export default lesson;
