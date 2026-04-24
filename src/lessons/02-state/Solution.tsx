import { useState } from "react";

export default function Exercise() {
  const [count, setCount] = useState(10);
  const [name, setName] = useState("");

  return (
    <div>
      <h3>count: {count}</h3>
      <button onClick={() => setCount((c) => c - 1)}>-1</button>{" "}
      <button onClick={() => setCount((c) => c + 1)}>+1</button>{" "}
      <button
        onClick={() => {
          setCount((c) => c + 1);
          setCount((c) => c + 1);
        }}
      >
        +2
      </button>

      <h3 style={{ marginTop: 16 }}>name: {name}</h3>
      <input
        placeholder="type your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}
