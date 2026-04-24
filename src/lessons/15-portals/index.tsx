import type { Lesson } from "../../types";
import { C, Callout, Code, Practice, Prose } from "../../ui/tutorial";
import Demo from "./Demo";
import demoSource from "./Demo.tsx?raw";
import exerciseStarter from "./Exercise.tsx?raw";
import exerciseSolution from "./Solution.tsx?raw";

function Readme() {
  return (
    <Prose>
      <h2><C>{"<Teleport>"}</C> → <C>createPortal</C></h2>
      <p>
        Vue's <C>{'<Teleport to="body">'}</C> renders its contents into a different DOM subtree.
        React has the same feature, named <C>createPortal</C>:
      </p>
      <Code lang="tsx">{`import { createPortal } from 'react-dom'

return createPortal(<div>I live in document.body</div>, document.body)`}</Code>

      <h3>When to reach for it</h3>
      <ul>
        <li>
          <strong>Modals</strong> — need to escape <C>overflow: hidden</C>, stacking contexts, and
          parent z-index traps.
        </li>
        <li>
          <strong>Tooltips / popovers / dropdowns</strong> — so they can overflow their container.
        </li>
        <li>
          <strong>Toasts</strong> — fixed-position notifications at the app edge.
        </li>
      </ul>
      <p>
        The React tree stays the same — the element is still logically a descendant for props,
        state, context, event bubbling. Only its <strong>DOM position</strong> moves.
      </p>

      <h3>Event bubbling still goes through the React tree</h3>
      <p>
        A click inside a portaled modal bubbles to React parents as if the portal weren't there.
        Useful — you can catch events at the logical parent without knowing about the portal.
      </p>
      <p>
        Vue <C>{"<Teleport>"}</C> behaves similarly.
      </p>

      <h3>Full modal example</h3>
      <Code lang="tsx">{`function Modal({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return createPortal(
    <div className="backdrop" onClick={onClose}>
      <div className="panel" onClick={e => e.stopPropagation()}>{children}</div>
    </div>,
    document.body
  )
}`}</Code>

      <h3>Target node</h3>
      <p>
        You can portal into any element, not just <C>document.body</C>:
      </p>
      <Code lang="tsx">{`createPortal(<Toast />, document.getElementById('toast-root')!)`}</Code>
      <p>
        Common pattern: put a <C>{'<div id="modal-root">'}</C> next to <C>#root</C> in{" "}
        <C>index.html</C>. Cleaner than polluting <C>{"<body>"}</C>.
      </p>

      <Callout type="warn" title="Caveats">
        <ul>
          <li>
            <strong>Accessibility.</strong> Portaled content is often a dialog or popup — use{" "}
            <C>role="dialog"</C>, <C>aria-modal</C>, focus trapping. Consider a library like{" "}
            <strong>Radix UI</strong> for this — it's free and very good.
          </li>
          <li>
            <strong>Don't portal into React-managed nodes</strong> (e.g. another component's root).
            React assumes it exclusively owns its children — when it re-renders, it will clobber
            the portaled content.
          </li>
          <li>
            <strong>SSR</strong> — on the server, <C>document.body</C> and similar DOM targets
            don't exist. Guard the target lookup (<C>typeof document !== 'undefined'</C>) or only
            render the portal after the component has mounted on the client.
          </li>
        </ul>
      </Callout>

      <Practice>
        Build an auto-dismissing toast using <C>createPortal</C> + <C>useEffect</C> cleanup.
      </Practice>
    </Prose>
  );
}

function Instructions() {
  return (
    <>
      <p>
        Build a <C>{"<Toast />"}</C> that portals into <C>document.body</C>.
      </p>
      <ol>
        <li>Accept <C>{"message: string"}</C> and <C>{"onClose: () => void"}</C>.</li>
        <li>Render it into a portal with position fixed in the bottom-right.</li>
        <li>Auto-dismiss after 2500ms (<C>useEffect</C> + <C>setTimeout</C> + cleanup).</li>
        <li>Don't render anything if <C>message</C> is empty.</li>
      </ol>
    </>
  );
}

const vueSource = `<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') emit('close') }
watch(() => props.open, (open) => {
  if (open) window.addEventListener('keydown', onKey)
  else window.removeEventListener('keydown', onKey)
})
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="backdrop" @click="emit('close')">
      <div class="panel" @click.stop>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
`;

const lesson: Lesson = {
  slug: "15-portals",
  title: "<Teleport> → createPortal",
  subtitle: "Render into a different DOM subtree without leaving the React tree.",
  Readme,
  Demo,
  demoSource,
  vueSource,
  Instructions,
  exerciseStarter,
  exerciseSolution,
};

export default lesson;
