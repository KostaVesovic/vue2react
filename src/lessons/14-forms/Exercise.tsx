import { useState } from "react";

// EXERCISE — build a tiny signup form with live validation.
// State: { email: string; password: string; confirm: string; age: string }
//
// Rules:
//   1. email must match /.+@.+\..+/
//   2. password must be ≥ 6 chars
//   3. confirm must equal password
//   4. age must be a number between 13 and 120
//
// Show an error under each field when the user has typed AND it's invalid.
// The submit button is disabled unless all are valid.
// On submit (prevent default) show a success message.
//
// Tip: write a `validate(form)` pure function that returns
// { email?: string; password?: string; confirm?: string; age?: string } of messages.

export default function Exercise() {
  const [form, setForm] = useState({ email: "", password: "", confirm: "", age: "" });
  const [submitted, setSubmitted] = useState(false);

  // TODO: implement `errors` and `canSubmit`
  const errors: Partial<Record<keyof typeof form, string>> = {};
  const canSubmit = false;

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
