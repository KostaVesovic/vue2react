import type { Lesson } from "../../types";
import { C, Callout, Code, Compare, Practice, Prose } from "../../ui/tutorial";
import Demo from "./Demo";
import demoSource from "./Demo.tsx?raw";
import exerciseStarter from "./Exercise.tsx?raw";
import exerciseSolution from "./Solution.tsx?raw";

function Readme() {
  return (
    <Prose>
      <h2><C>{"<Transition>"}</C> / <C>{"<TransitionGroup>"}</C> — the missing piece</h2>
      <p>
        <strong>React has no built-in equivalent of Vue's animation <C>{"<Transition>"}</C>.</strong>{" "}
        This is the biggest ergonomic regression for most Vue devs, and worth saying clearly up
        front so you know where to look.
      </p>

      <Callout type="warn" title="Naming clash: two different 'transitions'">
        <p>
          Confusingly, React also has APIs called "transitions" — <C>useTransition</C>,{" "}
          <C>startTransition</C>, and (experimental) <C>{"<ViewTransition>"}</C>. Those are about{" "}
          <strong>update priority</strong> and the browser's View Transitions API — NOT CSS
          animations. Lesson 21 covers them.
        </p>
        <p>
          This lesson is strictly about Vue's <C>{"<Transition>"}</C> use case: enter/leave CSS
          animations when conditional content is added or removed.
        </p>
      </Callout>

      <h3>The Vue-vs-React gap</h3>
      <Compare
        items={[
          {
            vue: <C>{`<Transition name="fade">`}</C>,
            react: <span>You toggle classes yourself, wait for <C>transitionend</C>, or use a lib</span>,
          },
          {
            vue: <C>{"<TransitionGroup>"}</C>,
            react: <span>A library: <strong>framer-motion</strong>, <strong>auto-animate</strong>, <strong>react-transition-group</strong></span>,
          },
          {
            vue: <span><C>{`name="slide"`}</C> → auto classes</span>,
            react: <span>Write the classes yourself (<C>.enter</C>, <C>.enter-active</C>, <C>.leave</C>...)</span>,
          },
        ]}
      />

      <h3>Vanilla approach (no library) — one element fade</h3>
      <Code lang="tsx">{`<button onClick={() => setShow(s => !s)}>toggle</button>
<span className={\`fade \${show ? 'in' : 'out'}\`}>hello</span>

/* CSS */
.fade { transition: opacity 300ms; }
.fade.in  { opacity: 1 }
.fade.out { opacity: 0 }`}</Code>

      <p>This works for "already mounted, just fade". It does NOT handle:</p>
      <ul>
        <li>Enter animation on first mount (element appears with the final state)</li>
        <li>
          Exit animation before unmount (React removes the node as soon as the conditional
          flips, so no chance for a leave)
        </li>
      </ul>
      <p>For those you need a helper.</p>

      <h3><C>framer-motion</C> — the popular choice</h3>
      <Code lang="tsx">{`import { AnimatePresence, motion } from 'framer-motion'

<AnimatePresence>
  {show && (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      hello
    </motion.div>
  )}
</AnimatePresence>`}</Code>
      <p>
        <C>AnimatePresence</C> defers the unmount until the exit animation finishes.{" "}
        <C>motion.*</C> is a thin wrapper around any HTML element.
      </p>
      <p>
        For <strong>list transitions</strong> (the <C>{"<TransitionGroup>"}</C> use case),{" "}
        <C>AnimatePresence</C> + unique <C>layout</C> props give you FLIP-style reorder
        animations:
      </p>
      <Code lang="tsx">{`<motion.ul layout>
  <AnimatePresence>
    {items.map(i => (
      <motion.li key={i.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {i.label}
      </motion.li>
    ))}
  </AnimatePresence>
</motion.ul>`}</Code>

      <h3><C>@formkit/auto-animate</C> — zero-config</h3>
      <p>
        Literally one line: <C>useAutoAnimate()</C> returns a ref you put on the list's parent,
        and additions/removals/reorders animate with sensible defaults.
      </p>
      <Code lang="tsx">{`import { useAutoAnimate } from '@formkit/auto-animate/react'

const [parent] = useAutoAnimate()
<ul ref={parent}>{items.map(...)}</ul>`}</Code>
      <p>Less customisable but beautifully simple. Great for admin UIs.</p>

      <h3>CSS view transitions (2024+)</h3>
      <p>
        The browser-native View Transitions API covers a growing slice of this gap.
        Chrome/Safari have shipped it; Firefox has partial support. React 19 (canary) ships an
        experimental <C>{"<ViewTransition>"}</C> component that integrates the browser API with{" "}
        <C>startTransition</C>, <C>useDeferredValue</C>, and Suspense fallbacks. Expect it to
        absorb more of Vue's <C>{"<Transition>"}</C> use case over the next year.
      </p>

      <Callout type="tip" title="My recommendation for Vue devs">
        For most apps: <strong>framer-motion</strong>. It's the closest feel to{" "}
        <C>{"<Transition>"}</C>, supports exit animations, layout shifts, gestures. The bundle
        cost is real but not terrible.
      </Callout>

      <Practice>
        Build an open/close drawer with pure CSS. The bonus teaches you why you need a library
        for enter/exit animations — without deferring unmount, the "closed" state has no DOM
        node to animate.
      </Practice>
    </Prose>
  );
}

function Instructions() {
  return (
    <>
      <p>Build a simple enter/leave fade WITHOUT a library.</p>
      <ol>
        <li>
          When <C>open</C> is true, render <C>{'<div className="drawer open">...</div>'}</C>.
          When false, render <C>{'<div className="drawer closed">...</div>'}</C>.
          DO NOT conditionally render (otherwise the leaving animation can't run).
        </li>
        <li>Add CSS transitioning transform + opacity between <C>.open</C> and <C>.closed</C>.</li>
      </ol>
      <p>
        <strong>Bonus:</strong> Use an <C>unmountAfter</C> local state — when open flips to false,
        wait 300ms (matching your CSS), then set a flag that removes the node.
        (Hint: <C>useEffect</C> + <C>setTimeout</C>, reset when open flips true again.)
      </p>
    </>
  );
}

const vueSource = `<script setup lang="ts">
import { ref } from 'vue'
const show = ref(true)
const items = ref([1, 2, 3])
</script>

<template>
  <button @click="show = !show">toggle</button>

  <Transition name="fade">
    <span v-if="show">hello, I fade</span>
  </Transition>

  <TransitionGroup name="list" tag="div">
    <span v-for="n in items" :key="n" class="pill">{{ n }}</span>
  </TransitionGroup>
</template>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity .3s, transform .3s }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-8px) }

.list-enter-active, .list-leave-active { transition: all .3s }
.list-enter-from, .list-leave-to { opacity: 0; transform: scale(.6) }
</style>
`;

const lesson: Lesson = {
  slug: "17-transitions",
  title: "Transitions (the missing piece)",
  subtitle: "No built-in <Transition>. Use framer-motion or auto-animate. Here's the gap.",
  Readme,
  Demo,
  demoSource,
  vueSource,
  Instructions,
  exerciseStarter,
  exerciseSolution,
};

export default lesson;
