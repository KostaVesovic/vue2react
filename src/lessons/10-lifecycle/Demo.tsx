import { useEffect, useState } from "react";

function LifeCycled({ label }: { label: string }) {
  const [n, setN] = useState(0);

  // "onMounted" — deps = []
  useEffect(() => {
    console.log(`[${label}] mounted`);
    return () => console.log(`[${label}] unmounted`);
  }, [label]);

  // "onUpdated" for `n` — deps = [n]
  // Skips the very first call only if you write it that way; by default runs on mount too.
  useEffect(() => {
    console.log(`[${label}] n changed to`, n);
  }, [label, n]);

  // "every render" — no deps array. Rare. Useful for debug.
  useEffect(() => {
    console.log(`[${label}] rendered`);
  });

  return (
    <div style={{ border: "1px dashed #3a4a68", padding: 8, borderRadius: 6 }}>
      <b>{label}</b> — n = {n}{" "}
      <button onClick={() => setN((x) => x + 1)}>+1</button>
    </div>
  );
}

export default function Demo() {
  const [show, setShow] = useState(true);
  const [key, setKey] = useState(0);

  return (
    <div>
      <p>Open your browser console to watch the lifecycle logs.</p>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <button onClick={() => setShow((s) => !s)}>
          {show ? "unmount" : "mount"}
        </button>
        <button onClick={() => setKey((k) => k + 1)}>
          remount (change key → full unmount + mount)
        </button>
      </div>
      {show && <LifeCycled key={key} label={`instance-${key}`} />}

      <p style={{ marginTop: 16, color: "#8b90a8" }}>
        In <b>StrictMode</b> (dev only) you'll see mount → unmount → mount on
        first render. That's intentional.
      </p>
    </div>
  );
}
