import { useEffect, useRef, useState } from "react";

export default function Exercise() {
  const [count, setCount] = useState(() => {
    const raw = localStorage.getItem("ex4-count");
    return raw ? Number(raw) : 0;
  });
  const [name, setName] = useState("");
  const firstRender = useRef(true);

  useEffect(() => {
    localStorage.setItem("ex4-count", String(count));
  }, [count]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    console.log("name changed to:", name);
  }, [name]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") setCount((c) => c + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div>
      <p>count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
      <p style={{ marginTop: 12 }}>
        name:{" "}
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </p>
      <p style={{ color: "#888", fontSize: 12 }}>
        refresh the page — your count should persist.<br />
        press Space (with the page focused) — count should go up.
      </p>
    </div>
  );
}
