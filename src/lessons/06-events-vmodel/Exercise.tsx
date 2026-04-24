import { useState } from "react";

// EXERCISE — a login form.
// 1. Bind `email` and `password` as controlled inputs.
// 2. The "sign in" button should be DISABLED if email doesn't include '@'
//    or password is shorter than 6 chars.
// 3. On submit (either Enter key or button click), set `submitted` to the
//    email/password pair, and PREVENT the default form submission.
// 4. Add a "show password" toggle that swaps the input's type between
//    "password" and "text".

export default function Exercise() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState<{ email: string; password: string } | null>(null);
  const [show, setShow] = useState(false);

  // TODO 2: derive `canSubmit`

  return (
    <form /* TODO 3: onSubmit */>
      <div style={{ display: "grid", gap: 8, maxWidth: 320 }}>
        <input
          type="email"
          placeholder="email"
          /* TODO 1: bind email */
        />
        <input
          // TODO 4: swap type based on `show`
          type="password"
          placeholder="password"
          /* TODO 1: bind password */
        />
        <label>
          <input
            type="checkbox"
            checked={show}
            onChange={(e) => setShow(e.target.checked)}
          />{" "}
          show password
        </label>
        <button type="submit" /* TODO 2: disabled={!canSubmit} */>sign in</button>
      </div>
      {submitted && (
        <p style={{ marginTop: 12 }}>
          signed in as <b>{submitted.email}</b> (pw length: {submitted.password.length})
        </p>
      )}
    </form>
  );
}
