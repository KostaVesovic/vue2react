import { useState } from "react";

interface User { id: string; name: string; archived: boolean }

type Status =
  | { kind: "loading" }
  | { kind: "ready"; users: User[] }
  | { kind: "error"; error: string };

export default function Exercise() {
  const [status, setStatus] = useState<Status>({
    kind: "ready",
    users: [
      { id: "u1", name: "Ada", archived: false },
      { id: "u2", name: "Alan", archived: true },
      { id: "u3", name: "Grace", archived: false },
    ],
  });

  const active = status.kind === "ready" ? status.users.filter((u) => !u.archived) : [];

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

      {status.kind === "loading" ? (
        <p>loading...</p>
      ) : status.kind === "error" ? (
        <p>failed: {status.error}</p>
      ) : active.length === 0 ? (
        <p>no active users</p>
      ) : (
        <ul>
          {active.map((u) => <li key={u.id}>{u.name}</li>)}
        </ul>
      )}
    </div>
  );
}
