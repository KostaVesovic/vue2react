import type { Lesson } from "../../types";
import { C, Callout, Code, Practice, Prose, SideBySide } from "../../ui/tutorial";
import Demo from "./Demo";
import demoSource from "./Demo.tsx?raw";
import exerciseStarter from "./Exercise.tsx?raw";
import exerciseSolution from "./Solution.tsx?raw";

function Readme() {
  return (
    <Prose>
      <h2><C>provide</C> / <C>inject</C> → <C>createContext</C> / <C>useContext</C></h2>

      <SideBySide
        caption="Same pattern: a provider exposes a value, a descendant reads it."
        vue={`// ancestor
provide('theme', theme)

// descendant
const theme = inject<Theme>('theme')!`}
        react={`// define the context (module scope)
const ThemeContext = createContext<Theme | null>(null)

// ancestor
<ThemeContext.Provider value={{ theme, toggle }}>
  {children}
</ThemeContext.Provider>

// descendant
const ctx = useContext(ThemeContext)`}
      />

      <h3>Shape</h3>
      <p>A context has:</p>
      <ul>
        <li>
          a <strong>Context object</strong> (from <C>createContext</C>) — typically module-scoped
        </li>
        <li>
          a <strong>Provider component</strong> — wraps the subtree, accepts <C>value</C>
        </li>
        <li>
          consumers read via <C>useContext(TheContext)</C>
        </li>
      </ul>

      <h3>The three idiomatic pieces</h3>
      <ol>
        <li>
          <strong>The context + types:</strong>
          <Code lang="tsx">{`interface ThemeCtx { theme: 'light' | 'dark'; toggle: () => void }
const ThemeContext = createContext<ThemeCtx | null>(null)`}</Code>
        </li>
        <li>
          <strong>A Provider component that holds state:</strong>
          <Code lang="tsx">{`function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const value = { theme, toggle: () => setTheme(t => t === 'dark' ? 'light' : 'dark') }
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}`}</Code>
        </li>
        <li>
          <strong>A hook consumer</strong> (so callers don't think about context mechanics):
          <Code lang="tsx">{`export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside <ThemeProvider>')
  return ctx
}`}</Code>
        </li>
      </ol>
      <p>
        Everywhere else, it's just <C>{"const { theme, toggle } = useTheme()"}</C>. Clean.
      </p>

      <h3>Context vs Pinia / Vuex</h3>
      <p>If you squint, Context + a state hook feels like a lightweight store. But:</p>
      <ul>
        <li>
          <strong>Context re-renders EVERY consumer</strong> when <C>value</C> changes (by{" "}
          <C>Object.is</C>). A Pinia store with getter-based subscriptions is more granular.
        </li>
        <li>
          For app-wide shared state, most real apps reach for <strong>Zustand</strong>,{" "}
          <strong>Jotai</strong>, <strong>Redux Toolkit</strong>, or TanStack Query (for server
          state). Lesson 19.
        </li>
        <li>
          Context is great for <strong>rarely-changing</strong> values: theme, locale, auth user,
          feature flags.
        </li>
      </ul>

      <Callout type="gotcha" title="The big gotcha: value identity">
        <Code lang="tsx">{`// ❌ a new object literal every render — EVERY consumer re-renders every time
<ThemeContext.Provider value={{ theme, toggle }}>`}</Code>
        <p>
          That's fine for cheap subtrees. For heavier trees wrap with <C>useMemo</C>:
        </p>
        <Code lang="tsx">{`const value = useMemo(() => ({ theme, toggle }), [theme])`}</Code>
        <p>
          Or split into two contexts (one for the value, one for the dispatcher) so consumers can
          subscribe to only what they need.
        </p>
      </Callout>

      <h3><C>useContext</C> vs <C>use(Context)</C> (React 19+)</h3>
      <p>
        React 19 introduced <C>use(Context)</C> which can be called conditionally — something{" "}
        <C>useContext</C> cannot. For most cases they're interchangeable. You'll usually still see{" "}
        <C>useContext</C> in codebases.
      </p>

      <h3>React 19: render the context directly as the provider</h3>
      <p>
        React 19 lets you use the context itself as a provider component — <C>.Provider</C> still
        works but is slated for deprecation.
      </p>
      <Code lang="tsx">{`// React 19 (preferred)
<ThemeContext value={{ theme, toggle }}>
  {children}
</ThemeContext>

// Legacy — still works, will be deprecated
<ThemeContext.Provider value={{ theme, toggle }}>
  {children}
</ThemeContext.Provider>`}</Code>

      <h3>Default value & no provider</h3>
      <p>
        <C>createContext(defaultValue)</C> — the default is used when there's no matching{" "}
        <C>Provider</C> in the tree. Useful for testing or sensible fallbacks. But the{" "}
        <C>null + hook that throws</C> pattern above catches "forgot the provider" bugs loudly.
      </p>

      <Practice>
        Build a Cart context with <C>items</C>, <C>add</C>, <C>remove</C>. Pay attention to the
        "throw if no provider" pattern — it's a Vue-convention you'll want to adopt.
      </Practice>
    </Prose>
  );
}

function Instructions() {
  return (
    <>
      <p>Build a Cart context.</p>
      <ol>
        <li>
          Create <C>CartContext</C> with:
          <ul>
            <li><C>items: string[]</C></li>
            <li><C>add: (item: string) =&gt; void</C></li>
            <li><C>remove: (item: string) =&gt; void</C></li>
          </ul>
        </li>
        <li>
          Create a <C>CartProvider</C> that holds state and supplies those functions.
        </li>
        <li>
          Write a <C>useCart()</C> hook that throws if used outside the provider.
        </li>
        <li>
          Fill in <C>{"<AddButton>"}</C> and <C>{"<CartSummary>"}</C> to use the hook.
        </li>
        <li>Wrap the component tree in the provider.</li>
      </ol>
    </>
  );
}

const vueSource = `<!-- ThemeProvider.vue -->
<script setup lang="ts">
import { ref, provide, type InjectionKey, type Ref } from 'vue'

interface ThemeCtx { theme: Ref<'light' | 'dark'>; toggle: () => void }
export const themeKey: InjectionKey<ThemeCtx> = Symbol('theme')

const theme = ref<'light' | 'dark'>('dark')
provide(themeKey, {
  theme,
  toggle: () => theme.value = theme.value === 'dark' ? 'light' : 'dark',
})
</script>

<template><slot /></template>

<!-- any deep child -->
<script setup lang="ts">
import { inject } from 'vue'
import { themeKey } from './ThemeProvider.vue'

const { theme, toggle } = inject(themeKey)!
</script>
`;

const lesson: Lesson = {
  slug: "11-context",
  title: "provide/inject → Context",
  subtitle: "createContext + Provider + useContext. The 'hook wrapper' convention.",
  Readme,
  Demo,
  demoSource,
  vueSource,
  Instructions,
  exerciseStarter,
  exerciseSolution,
};

export default lesson;
