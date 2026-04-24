import { createContext, useContext, useReducer, useState, type ReactNode } from "react";

// === Option 1: useState + lift state up (small apps) ===
function StateLifted() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Child label="child A" count={count} onInc={() => setCount((c) => c + 1)} />
      <Child label="child B" count={count} onInc={() => setCount((c) => c + 1)} />
    </div>
  );
}
function Child({ label, count, onInc }: { label: string; count: number; onInc: () => void }) {
  return <p>{label}: {count} <button onClick={onInc}>+1</button></p>;
}

// === Option 2: useReducer + Context (medium apps, zero-dep) ===
interface TodoState { todos: { id: number; text: string; done: boolean }[] }
type TodoAction =
  | { type: "add"; text: string }
  | { type: "toggle"; id: number }
  | { type: "remove"; id: number };

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case "add":
      return { todos: [...state.todos, { id: Date.now(), text: action.text, done: false }] };
    case "toggle":
      return {
        todos: state.todos.map((t) => t.id === action.id ? { ...t, done: !t.done } : t),
      };
    case "remove":
      return { todos: state.todos.filter((t) => t.id !== action.id) };
  }
}

interface TodoCtx { state: TodoState; dispatch: React.Dispatch<TodoAction> }
const TodoContext = createContext<TodoCtx | null>(null);

function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("needs TodoProvider");
  return ctx;
}

function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, { todos: [] });
  return <TodoContext.Provider value={{ state, dispatch }}>{children}</TodoContext.Provider>;
}

function TodoAdd() {
  const { dispatch } = useTodos();
  const [text, setText] = useState("");
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (text) { dispatch({ type: "add", text }); setText(""); } }}
      style={{ display: "flex", gap: 6 }}
    >
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="new todo" />
      <button type="submit">add</button>
    </form>
  );
}

function TodoList() {
  const { state, dispatch } = useTodos();
  if (state.todos.length === 0) return <p><em>no todos</em></p>;
  return (
    <ul>
      {state.todos.map((t) => (
        <li key={t.id}>
          <label style={{ textDecoration: t.done ? "line-through" : "none" }}>
            <input type="checkbox" checked={t.done} onChange={() => dispatch({ type: "toggle", id: t.id })} />
            {" "}{t.text}
          </label>
          {" "}
          <button onClick={() => dispatch({ type: "remove", id: t.id })}>×</button>
        </li>
      ))}
    </ul>
  );
}

export default function Demo() {
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div>
        <h3>1. useState + lift state up</h3>
        <StateLifted />
      </div>
      <div>
        <h3>2. useReducer + Context (Pinia-ish, zero dependencies)</h3>
        <TodoProvider>
          <TodoAdd />
          <TodoList />
        </TodoProvider>
      </div>
      <div>
        <h3>3. Dedicated stores — Zustand / Redux Toolkit (not installed here)</h3>
        <p>See the Read tab for code.</p>
      </div>
    </div>
  );
}
