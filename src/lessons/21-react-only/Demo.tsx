import { useDeferredValue, useId, useImperativeHandle, useRef, useState, useTransition, type Ref } from "react";

// === useId — stable ids for a11y ===
function IdDemo() {
  const id = useId();
  return (
    <div>
      <label htmlFor={`${id}-name`}>name</label>{" "}
      <input id={`${id}-name`} />
      <p className="sub">id = <code>{id}</code> — unique per instance, SSR-safe</p>
    </div>
  );
}

// === key-as-remount — change the key, get a fresh component ===
function KeyDemo() {
  const [userId, setUserId] = useState(1);
  return (
    <div>
      <div style={{ display: "flex", gap: 6 }}>
        {[1, 2, 3].map((id) => (
          <button
            key={id}
            onClick={() => setUserId(id)}
            style={{ opacity: userId === id ? 1 : 0.5 }}
          >
            user {id}
          </button>
        ))}
      </div>
      {/* When userId changes, key changes → UserForm unmounts and remounts fresh. */}
      <UserForm key={userId} initialName={`user${userId}`} />
    </div>
  );
}

function UserForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  return (
    <p style={{ marginTop: 8 }}>
      local state: <input value={name} onChange={(e) => setName(e.target.value)} />{" "}
      (resets when you pick a different user — no useEffect needed)
    </p>
  );
}

// === useImperativeHandle — expose methods like Vue's defineExpose ===
interface FancyInputHandle { focus: () => void; shake: () => void }

function FancyInput({ ref }: { ref?: Ref<FancyInputHandle> }) {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    shake: () => {
      const el = inputRef.current;
      if (!el) return;
      el.animate([{ transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "translateX(0)" }], { duration: 180 });
    },
  }), []);
  return <input ref={inputRef} />;
}

function ExposeDemo() {
  const handle = useRef<FancyInputHandle>(null);
  return (
    <div>
      <FancyInput ref={handle} />{" "}
      <button onClick={() => handle.current?.focus()}>focus</button>{" "}
      <button onClick={() => handle.current?.shake()}>shake</button>
    </div>
  );
}

// === useTransition / useDeferredValue — mark updates as non-urgent ===
function ConcurrentDemo() {
  const [text, setText] = useState("");
  const deferred = useDeferredValue(text);
  const [pending, startTransition] = useTransition();
  const [priority, setPriority] = useState("");

  const isStale = deferred !== text;

  const slowList = Array.from({ length: 500 }, (_, i) =>
    `${deferred.slice(0, 4) || "x"}-${i}`.repeat(1),
  );

  return (
    <div>
      <p>
        Typing updates <code>text</code> urgently; <code>deferred</code> lags
        so the heavy list doesn't block input.
      </p>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="type fast" />
      <p>deferred: <code>{deferred}</code> {isStale && <span style={{ color: "#f7bb7a" }}>(stale)</span>}</p>
      <p className="sub">list filtered by deferred value (500 items):</p>
      <ul style={{ maxHeight: 120, overflow: "auto", margin: 0 }}>
        {slowList.filter((s) => s.includes(deferred)).slice(0, 20).map((s) => <li key={s}>{s}</li>)}
      </ul>

      <p style={{ marginTop: 16 }}>
        <code>useTransition</code>: mark an update as non-urgent.
      </p>
      <button
        onClick={() =>
          startTransition(() => {
            // imagine this triggers an expensive re-render
            setPriority(`ran at ${new Date().toLocaleTimeString()}`);
          })
        }
      >
        kick off transition
      </button>{" "}
      {pending && <span>pending…</span>}
      <p>{priority}</p>
    </div>
  );
}

export default function Demo() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <section>
        <h3>useId</h3>
        <IdDemo />
      </section>
      <section>
        <h3>key as "remount"</h3>
        <KeyDemo />
      </section>
      <section>
        <h3>useImperativeHandle — expose methods (like Vue's defineExpose)</h3>
        <ExposeDemo />
      </section>
      <section>
        <h3>useTransition / useDeferredValue — concurrent features</h3>
        <ConcurrentDemo />
      </section>
    </div>
  );
}
