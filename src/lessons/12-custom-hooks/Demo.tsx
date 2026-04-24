import { useEffect, useState } from "react";

// === 1. useLocalStorage — a tiny typed hook ===
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch { return initial; }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

// === 2. useMouse — subscribes to events, returns coords ===
function useMouse() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return pos;
}

// === 3. useDebounced — returns a debounced copy of a value ===
function useDebounced<T>(value: T, ms: number) {
  const [d, setD] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setD(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return d;
}

export default function Demo() {
  const [name, setName] = useLocalStorage("demo-name", "");
  const { x, y } = useMouse();
  const [q, setQ] = useState("");
  const debouncedQ = useDebounced(q, 400);

  return (
    <div>
      <h3>useLocalStorage (refresh the page — name persists)</h3>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="your name" />

      <h3>useMouse</h3>
      <p>mouse is at ({x}, {y}) — move around</p>

      <h3>useDebounced</h3>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="type fast…" />
      <p>live: <code>{q}</code></p>
      <p>debounced (400ms): <code>{debouncedQ}</code></p>
    </div>
  );
}
