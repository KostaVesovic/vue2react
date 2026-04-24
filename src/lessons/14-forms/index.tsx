import type { Lesson } from "../../types";
import { C, Callout, Code, Compare, Practice, Prose } from "../../ui/tutorial";
import Demo from "./Demo";
import demoSource from "./Demo.tsx?raw";
import exerciseStarter from "./Exercise.tsx?raw";
import exerciseSolution from "./Solution.tsx?raw";

function Readme() {
  return (
    <Prose>
      <h2>Forms: controlled vs uncontrolled</h2>
      <p>
        Vue has one form model: <C>v-model</C> everywhere, reactive always. React has{" "}
        <strong>two</strong> and you should know both.
      </p>

      <h3>Controlled inputs — the default</h3>
      <p>
        The JS state is the source of truth. Every keystroke fires <C>onChange</C>, you call{" "}
        <C>setX</C>, React re-renders, and the input shows the new value.
      </p>
      <Code lang="tsx">{`<input value={name} onChange={e => setName(e.target.value)} />`}</Code>
      <p>
        Pros: always in sync with state, trivial to validate live. Cons: re-render on every
        keystroke — almost always fine, but in huge forms you sometimes trade for uncontrolled.
      </p>

      <h3>Uncontrolled inputs — DOM owns the value</h3>
      <p>
        Use <C>defaultValue</C> (not <C>value</C>) and read via a ref or <C>FormData</C>:
      </p>
      <Code lang="tsx">{`<form onSubmit={e => {
  e.preventDefault()
  const data = new FormData(e.currentTarget)
  submit(Object.fromEntries(data))
}}>
  <input name="email" defaultValue="" />
  <button type="submit">go</button>
</form>`}</Code>
      <p>
        Pros: zero re-renders while typing, feels closer to "just an HTML form". Cons: no live
        validation without querying the DOM, harder to "reset" or programmatically set values.
      </p>
      <p>
        Rule of thumb: <strong>controlled</strong> for anything with logic,{" "}
        <strong>uncontrolled</strong> for simple "send the form to the server" cases.
      </p>

      <h3><C>v-model</C> → (value, onChange) — recap</h3>
      <Compare
        items={[
          {
            label: "text",
            vue: `v-model="x"`,
            react: `value={x} onChange={e => setX(e.target.value)}`,
          },
          {
            label: "number",
            vue: `v-model.number="x"`,
            react: `value={x} onChange={e => setX(Number(e.target.value))}`,
          },
          {
            label: "checkbox",
            vue: `v-model="x"`,
            react: `checked={x} onChange={e => setX(e.target.checked)}`,
          },
          {
            label: "checkbox group",
            vue: `v-model="arr"`,
            react: `toggle in/out of array in onChange`,
          },
          {
            label: "radio",
            vue: `v-model="sel"`,
            react: `checked={sel === 'a'} onChange={...}`,
          },
          {
            label: "select",
            vue: `v-model="sel"`,
            react: `value={sel} onChange={...} on the <select>`,
          },
          {
            label: "multi-select",
            vue: `v-model="arr"`,
            react: `Array.from(e.target.selectedOptions, o => o.value)`,
          },
        ]}
      />

      <h3>The "all fields in one state object" pattern</h3>
      <Code lang="tsx">{`interface Form { name: string; email: string; plan: 'free' | 'pro' }
const [form, setForm] = useState<Form>({ name: '', email: '', plan: 'free' })

const update = <K extends keyof Form>(k: K, v: Form[K]) =>
  setForm(f => ({ ...f, [k]: v }))

<input value={form.name} onChange={e => update('name', e.target.value)} />
<input value={form.email} onChange={e => update('email', e.target.value)} />`}</Code>

      <h3>Validation</h3>
      <p>React has no built-in validation story. Options:</p>
      <ul>
        <li>
          <strong>Manual</strong> — write a pure <C>validate(form)</C> and show errors (this
          exercise).
        </li>
        <li>
          <strong>Zod + react-hook-form</strong> — the de-facto library combo for real apps.
        </li>
        <li>
          <strong>TanStack Form</strong> — newer, headless, type-driven.
        </li>
        <li>
          <strong>Formik</strong> — older, still widely used.
        </li>
      </ul>
      <p>
        For anything beyond a contact form, use <strong>react-hook-form</strong> with a Zod schema.
      </p>

      <h3>React 19 form actions</h3>
      <p>
        React 19 added <C>{"<form action={serverAction}>"}</C> and <C>useFormStatus</C> /{" "}
        <C>useActionState</C> — a new form model that aligns with Server Actions. For client-only
        Vite apps, the controlled pattern above is what you'll use daily.
      </p>

      <Callout type="gotcha" title="Gotchas">
        <ul>
          <li>
            <strong>
              Switching between <C>value</C> and <C>defaultValue</C> makes an input (un)controlled
              mid-flight.
            </strong>{" "}
            React will warn loudly. Pick one.
          </li>
          <li>
            <strong>
              Never set <C>value={"{null}"}</C> or <C>value={"{undefined}"}</C>.
            </strong>{" "}
            Use <C>''</C> to keep the input controlled.
          </li>
          <li>
            <strong>
              <C>onChange</C> in React is really the <C>input</C> event
            </strong>{" "}
            (per keystroke). If you want blur behavior, use <C>onBlur</C>.
          </li>
        </ul>
      </Callout>

      <Practice>
        Signup form with live validation. Aim: every invalid field shows a message once the user has
        typed in it.
      </Practice>
    </Prose>
  );
}

function Instructions() {
  return (
    <>
      <p>
        Build a tiny signup form with live validation. State:{" "}
        <C>{"{ email: string; password: string; confirm: string; age: string }"}</C>
      </p>
      <p>Rules:</p>
      <ol>
        <li><C>email</C> must match <C>{"/.+@.+\\..+/"}</C></li>
        <li><C>password</C> must be ≥ 6 chars</li>
        <li><C>confirm</C> must equal <C>password</C></li>
        <li><C>age</C> must be a number between 13 and 120</li>
      </ol>
      <p>
        Show an error under each field when the user has typed AND it's invalid. The submit
        button is disabled unless all are valid. On submit (prevent default) show a success
        message.
      </p>
      <p>
        Tip: write a <C>{"validate(form)"}</C> pure function that returns{" "}
        <C>{"{ email?: string; password?: string; confirm?: string; age?: string }"}</C> of
        messages.
      </p>
    </>
  );
}

const vueSource = `<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  newsletter: true,
  plan: 'free' as 'free' | 'pro' | 'enterprise',
  roles: ['user'] as string[],
})
</script>

<template>
  <form @submit.prevent="alert(JSON.stringify(form, null, 2))">
    <input v-model="form.name" placeholder="name" />
    <input v-model="form.email" type="email" placeholder="email" />
    <label>
      <input type="checkbox" v-model="form.newsletter" /> newsletter
    </label>
    <select v-model="form.plan">
      <option value="free">Free</option>
      <option value="pro">Pro</option>
      <option value="enterprise">Enterprise</option>
    </select>
    <label v-for="r in ['user', 'admin', 'billing']" :key="r">
      <input type="checkbox" :value="r" v-model="form.roles" /> {{ r }}
    </label>
    <button type="submit">submit</button>
  </form>
</template>
`;

const lesson: Lesson = {
  slug: "14-forms",
  title: "Forms",
  subtitle: "Controlled vs uncontrolled. v-model modifiers translated. Validation options.",
  Readme,
  Demo,
  demoSource,
  vueSource,
  Instructions,
  exerciseStarter,
  exerciseSolution,
};

export default lesson;
