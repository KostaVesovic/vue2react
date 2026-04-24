import { useState } from "react";

export default function Demo() {
  // like `const count = ref(0)` — but no `.value`
  const [count, setCount] = useState(0);

  // object state — you REPLACE it, not mutate
  const [user, setUser] = useState({ name: "Ada", age: 36 });

  // array state — same rule. Create a new array.
  const [todos, setTodos] = useState<string[]>([]);

  return (
    <div>
      <h3>count: {count}</h3>
      <button onClick={() => setCount(count + 1)}>+1 (stale)</button>{" "}
      <button onClick={() => setCount((c) => c + 1)}>+1 (functional)</button>{" "}
      <button onClick={() => { setCount((c) => c + 1); setCount((c) => c + 1); }}>
        +2 (two updates, batched)
      </button>

      <hr style={{ margin: "16px 0", borderColor: "#262a35" }} />

      <h3>user: {user.name}, {user.age}</h3>
      <button onClick={() => setUser({ ...user, age: user.age + 1 })}>
        birthday (spread + replace)
      </button>

      <hr style={{ margin: "16px 0", borderColor: "#262a35" }} />

      <h3>todos: {todos.length}</h3>
      <button onClick={() => setTodos([...todos, `todo ${todos.length + 1}`])}>
        add (spread into new array)
      </button>{" "}
      <button onClick={() => setTodos(todos.slice(0, -1))} disabled={todos.length === 0}>
        pop
      </button>
      <ul>
        {todos.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}
