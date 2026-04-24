import { useState } from "react";

// EXERCISE
// 1. Use useEffect to sync `count` into localStorage under key "ex4-count".
//    When the component mounts, INITIALIZE count from localStorage (hint: the
//    useState initializer function runs once).
// 2. Add a `useEffect` that logs to the console every time `name` changes,
//    but NOT on the first render. (Hint: useRef — we'll cover that in lesson 13;
//    for now just use a module-level flag or a second state field.)
// 3. Add an event listener on window for "keydown" that increments count on Space.
//    Remember to remove the listener in cleanup, or you'll leak.

export default function Exercise() {
  const [count, setCount] = useState(0);      // TODO: initialize from localStorage
  const [name, setName] = useState("");

  // TODO 1: persist count
  // TODO 2: log name change (but not on first render)
  // TODO 3: space-to-increment

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
