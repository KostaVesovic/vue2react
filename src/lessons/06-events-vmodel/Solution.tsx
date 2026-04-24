import { useState } from "react";

export default function Exercise() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState<{ email: string; password: string } | null>(null);
  const [show, setShow] = useState(false);

  const canSubmit = email.includes("@") && password.length >= 6;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) setSubmitted({ email, password });
      }}
    >
      <div style={{ display: "grid", gap: 8, maxWidth: 320 }}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type={show ? "text" : "password"}
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={show}
            onChange={(e) => setShow(e.target.checked)}
          />{" "}
          show password
        </label>
        <button type="submit" disabled={!canSubmit}>sign in</button>
      </div>
      {submitted && (
        <p style={{ marginTop: 12 }}>
          signed in as <b>{submitted.email}</b> (pw length: {submitted.password.length})
        </p>
      )}
    </form>
  );
}
