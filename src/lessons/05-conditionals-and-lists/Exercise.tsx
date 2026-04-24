import { useState } from "react";

// EXERCISE
// 1. Show <p>loading...</p> when `status === 'loading'`.
//    Show the <ul> of users when `status === 'ready'`.
//    Show <p>failed: {error}</p> when `status === 'error'`.
// 2. Render each user as <li>. Pick a GOOD key (hint: user.id, NOT the index).
// 3. Filter out users with `archived: true` before rendering.
// 4. If the filtered list is empty, show <p>no active users</p>.

interface User { id: string; name: string; archived: boolean }

type Status = { kind: "loading" } | { kind: "ready"; users: User[] } | { kind: "error"; error: string };

export default function Exercise() {
  const [status, setStatus] = useState<Status>({
    kind: "ready",
    users: [
      { id: "u1", name: "Ada", archived: false },
      { id: "u2", name: "Alan", archived: true },
      { id: "u3", name: "Grace", archived: false },
    ],
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <button onClick={() => setStatus({ kind: "loading" })}>loading</button>
        <button onClick={() => setStatus({ kind: "ready", users: [] })}>ready (empty)</button>
        <button onClick={() => setStatus({ kind: "ready", users: [
          { id: "u1", name: "Ada", archived: false },
          { id: "u2", name: "Alan", archived: true },
          { id: "u3", name: "Grace", archived: false },
        ] })}>ready (3)</button>
        <button onClick={() => setStatus({ kind: "error", error: "500 server error" })}>error</button>
      </div>

      {/* TODO 1–4: render according to status. Use a ternary chain. */}
    </div>
  );
}
