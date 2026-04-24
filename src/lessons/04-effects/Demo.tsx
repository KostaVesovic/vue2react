import { useEffect, useState } from "react";

export default function Demo() {
  const [count, setCount] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [query, setQuery] = useState("react");
  const [result, setResult] = useState<string>("");

  // Runs after every render where `count` changed.
  // Like watch(count, ...)
  useEffect(() => {
    document.title = `count is ${count}`;
  }, [count]);

  // Runs once on mount (StrictMode in dev runs it twice — see readme).
  // Cleanup runs on unmount. Like onMounted + onUnmounted.
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Debounced fetch — classic watch-with-cleanup pattern.
  useEffect(() => {
    const controller = new AbortController();
    const t = setTimeout(async () => {
      try {
        await new Promise((r) => setTimeout(r, 300));   // fake network
        if (controller.signal.aborted) return;
        setResult(`results for "${query}" (${query.length * 7} hits)`);
      } catch { /* aborted */ }
    }, 250);
    return () => { clearTimeout(t); controller.abort(); };
  }, [query]);

  return (
    <div>
      <p>document title reflects the count — look at your tab.</p>
      <button onClick={() => setCount((c) => c + 1)}>count: {count}</button>

      <p>mounted seconds: {seconds} (interval cleaned up on unmount)</p>

      <div style={{ marginTop: 12 }}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="search" />
        <p>{result}</p>
      </div>
    </div>
  );
}
