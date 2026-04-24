import { createContext, useContext, useReducer, type ReactNode } from "react";

interface State {
  count: number;
}
type Action =
  | { type: "inc" }
  | { type: "dec" }
  | { type: "reset" }
  | { type: "set"; value: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "inc":
      return { count: state.count + 1 };
    case "dec":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
    case "set":
      return { count: action.value };
    default:
      return state;
  }
}

interface Ctx {
  state: State;
  dispatch: React.Dispatch<Action>;
}
const CounterContext = createContext<Ctx | null>(null);

function CounterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      {children}
    </CounterContext.Provider>
  );
}

function useCounter(): Ctx {
  const ctx = useContext(CounterContext);
  if (!ctx) throw new Error("useCounter must be used inside CounterProvider");
  return ctx;
}

function Display() {
  const { state } = useCounter();
  return <h3>count: {state.count}</h3>;
}

function Buttons() {
  const { dispatch } = useCounter();
  return (
    <div style={{ display: "flex", gap: 6 }}>
      <button onClick={() => dispatch({ type: "inc" })}>+1</button>
      <button onClick={() => dispatch({ type: "dec" })}>-1</button>
      <button onClick={() => dispatch({ type: "reset" })}>reset</button>
      <button onClick={() => dispatch({ type: "set", value: 42 })}>set 42</button>
    </div>
  );
}

export default function Exercise() {
  return (
    <CounterProvider>
      <Display />
      <Buttons />
    </CounterProvider>
  );
}
