import { useRef, useState } from "react";

// === Controlled form ===
interface FormState {
  name: string;
  email: string;
  newsletter: boolean;
  plan: "free" | "pro" | "enterprise";
  roles: string[];
}

function ControlledForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    newsletter: true,
    plan: "free",
    roles: ["user"],
  });

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleRole = (role: string) =>
    setForm((f) => ({
      ...f,
      roles: f.roles.includes(role) ? f.roles.filter((r) => r !== role) : [...f.roles, role],
    }));

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); alert(JSON.stringify(form, null, 2)); }}
      style={{ display: "grid", gap: 8, maxWidth: 360 }}
    >
      <input
        placeholder="name"
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
      />
      <input
        type="email"
        placeholder="email"
        value={form.email}
        onChange={(e) => update("email", e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={form.newsletter}
          onChange={(e) => update("newsletter", e.target.checked)}
        />{" "}
        subscribe to newsletter
      </label>
      <select
        value={form.plan}
        onChange={(e) => update("plan", e.target.value as FormState["plan"])}
      >
        <option value="free">Free</option>
        <option value="pro">Pro</option>
        <option value="enterprise">Enterprise</option>
      </select>
      <div>
        <div>roles:</div>
        {["user", "admin", "billing"].map((role) => (
          <label key={role} style={{ marginRight: 10 }}>
            <input
              type="checkbox"
              checked={form.roles.includes(role)}
              onChange={() => toggleRole(role)}
            />{" "}
            {role}
          </label>
        ))}
      </div>
      <button type="submit">submit</button>
      <pre style={{ margin: 0 }}>{JSON.stringify(form, null, 2)}</pre>
    </form>
  );
}

// === Uncontrolled form — read on submit ===
function UncontrolledForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState<Record<string, FormDataEntryValue> | null>(null);

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setSubmitted(Object.fromEntries(data.entries()));
      }}
      style={{ display: "grid", gap: 8, maxWidth: 360 }}
    >
      <input name="name" placeholder="name" defaultValue="Ada" />
      <input name="email" placeholder="email" type="email" />
      <button type="submit">submit</button>
      {submitted && <pre>{JSON.stringify(submitted, null, 2)}</pre>}
    </form>
  );
}

export default function Demo() {
  return (
    <div style={{ display: "grid", gap: 28 }}>
      <div>
        <h3>Controlled form</h3>
        <p className="sub">Every input's value is state. React re-renders on every keystroke.</p>
        <ControlledForm />
      </div>
      <div>
        <h3>Uncontrolled form</h3>
        <p className="sub">DOM owns the values; we read them on submit via FormData.</p>
        <UncontrolledForm />
      </div>
    </div>
  );
}
