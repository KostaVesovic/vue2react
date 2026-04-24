import { useState } from "react";

// EXERCISE
// Use the `key` trick to reset a form when a "user" is switched.
// 1. The <Profile /> component owns local state for bio/age.
//    Currently, switching users does NOT reset that state — bio leaks across.
// 2. Fix this by passing a different `key` to <Profile /> for each user.
//    (Don't change Profile itself — only the call site.)

function Profile({ user }: { user: { id: number; name: string } }) {
  const [bio, setBio] = useState(`I'm ${user.name}`);
  const [age, setAge] = useState<string>("");

  return (
    <fieldset style={{ marginTop: 10 }}>
      <legend>{user.name}</legend>
      <label style={{ display: "block" }}>
        bio: <input value={bio} onChange={(e) => setBio(e.target.value)} />
      </label>
      <label style={{ display: "block", marginTop: 6 }}>
        age: <input value={age} onChange={(e) => setAge(e.target.value)} />
      </label>
    </fieldset>
  );
}

const USERS = [
  { id: 1, name: "Ada" },
  { id: 2, name: "Alan" },
  { id: 3, name: "Grace" },
];

export default function Exercise() {
  const [selected, setSelected] = useState(USERS[0]!);

  return (
    <div>
      <div style={{ display: "flex", gap: 6 }}>
        {USERS.map((u) => (
          <button
            key={u.id}
            onClick={() => setSelected(u)}
            style={{ opacity: selected.id === u.id ? 1 : 0.5 }}
          >
            {u.name}
          </button>
        ))}
      </div>

      {/* TODO: pass a `key` prop here that changes when the user does */}
      <Profile user={selected} />
    </div>
  );
}
