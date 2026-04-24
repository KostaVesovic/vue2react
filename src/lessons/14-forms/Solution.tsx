import { useState } from "react";

type Form = { email: string; password: string; confirm: string; age: string };

function validate(form: Form): Partial<Record<keyof Form, string>> {
  const errors: Partial<Record<keyof Form, string>> = {};
  if (!/.+@.+\..+/.test(form.email)) errors.email = "must be a valid email";
  if (form.password.length < 6) errors.password = "must be at least 6 characters";
  if (form.confirm !== form.password) errors.confirm = "must match password";
  const age = Number(form.age);
  if (!Number.isFinite(age) || age < 13 || age > 120) {
    errors.age = "must be a number between 13 and 120";
  }
  return errors;
}

export default function Exercise() {
  const [form, setForm] = useState<Form>({ email: "", password: "", confirm: "", age: "" });
  const [submitted, setSubmitted] = useState(false);

  const errors = validate(form);
  const canSubmit = Object.keys(errors).length === 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) setSubmitted(true);
      }}
      style={{ display: "grid", gap: 10, maxWidth: 360 }}
    >
      <Field
        label="email"
        value={form.email}
        error={errors.email}
        onChange={(v) => setForm((f) => ({ ...f, email: v }))}
      />
      <Field
        label="password"
        type="password"
        value={form.password}
        error={errors.password}
        onChange={(v) => setForm((f) => ({ ...f, password: v }))}
      />
      <Field
        label="confirm password"
        type="password"
        value={form.confirm}
        error={errors.confirm}
        onChange={(v) => setForm((f) => ({ ...f, confirm: v }))}
      />
      <Field
        label="age"
        value={form.age}
        error={errors.age}
        onChange={(v) => setForm((f) => ({ ...f, age: v }))}
      />
      <button type="submit" disabled={!canSubmit}>sign up</button>
      {submitted && <p style={{ color: "#7aa2f7" }}>🎉 signed up!</p>}
    </form>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | undefined;
  type?: string;
}

function Field({ label, value, onChange, error, type = "text" }: FieldProps) {
  return (
    <label style={{ display: "grid", gap: 4 }}>
      <span>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      {value && error && <small style={{ color: "#f77a7a" }}>{error}</small>}
    </label>
  );
}
