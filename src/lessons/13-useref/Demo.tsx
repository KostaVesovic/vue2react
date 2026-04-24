import { useEffect, useRef, useState } from "react";

export default function Demo() {
  // === 1. DOM ref — Vue's template ref ===
  const inputRef = useRef<HTMLInputElement>(null);

  // === 2. Instance-like mutable box — NOT reactive ===
  // Writes to ref.current don't schedule a render.
  const clicks = useRef(0);
  const [shown, setShown] = useState(0);

  // === 3. Capturing the previous value of a state ===
  const [count, setCount] = useState(0);
  const prev = useRef<number>(count);
  useEffect(() => {
    prev.current = count;
  }, [count]);

  return (
    <div>
      <h3>DOM ref</h3>
      <input ref={inputRef} placeholder="click focus →" />{" "}
      <button onClick={() => inputRef.current?.focus()}>focus</button>{" "}
      <button onClick={() => inputRef.current?.select()}>select all</button>

      <h3 style={{ marginTop: 16 }}>Mutable ref (not reactive)</h3>
      <p>
        count = {count} (previously {prev.current}) —{" "}
        <button onClick={() => setCount((c) => c + 1)}>+1</button>
      </p>
      <p>
        <button onClick={() => (clicks.current += 1)}>silent click (no re-render)</button>{" "}
        <button onClick={() => setShown(clicks.current)}>show ref value</button>
      </p>
      <p>
        ref value at last "show": <b>{shown}</b>. Silent clicks don't trigger renders — the number
        only updates when state changes.
      </p>
    </div>
  );
}
