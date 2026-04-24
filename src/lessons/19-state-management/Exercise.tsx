import { createContext, useContext, useReducer, type ReactNode } from "react";

// EXERCISE — build a counter "store" with useReducer + Context.
// Steps are laid out; just fill them in.
// 1. Finish the reducer: support "inc", "dec", "reset", "set" (with payload).
// 2. Write useCounter() that throws if outside provider.
// 3. Wire <Buttons /> to call dispatch for each action.
// 4. Try it: clicking buttons updates the count everywhere.

interface State { count: number }
type Action =
  | { type: "inc" }
  | { type: "dec" }
  | { type: "reset" }
  | { type: "set"; value: number };

function reducer(state: State, action: Action): State {
  // TODO 1
  switch (action.type) {
    default:
      return state;
  }
}

interface Ctx { state: State; dispatch: React.Dispatch<Action> }
const CounterContext = createContext<Ctx | null>(null);

function CounterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return <CounterContext.Provider value={{ state, dispatch }}>{children}</CounterContext.Provider>;
}

// TODO 2
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
      <button /* TODO 3: onClick dispatch inc */>+1</button>
      <button /* TODO 3: dec */>-1</button>
      <button /* TODO 3: reset */>reset</button>
      <button /* TODO 3: set to 42 */>set 42</button>
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
