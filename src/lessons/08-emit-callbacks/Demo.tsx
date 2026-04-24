import { useState } from "react";

interface CounterProps {
  value: number;
  onIncrement: () => void;            // like @update:value in Vue
  onReset: () => void;
  onChange: (next: number) => void;   // callback with a payload
}

function Counter({ value, onIncrement, onReset, onChange }: CounterProps) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <button onClick={onReset}>reset</button>
      <button onClick={onIncrement}>+1</button>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: 80 }}
      />
    </div>
  );
}

export default function Demo() {
  const [count, setCount] = useState(5);
  const [history, setHistory] = useState<number[]>([5]);

  const update = (n: number) => {
    setCount(n);
    setHistory((h) => [...h, n].slice(-8));
  };

  return (
    <div>
      <Counter
        value={count}
        onIncrement={() => update(count + 1)}
        onReset={() => update(0)}
        onChange={update}
      />
      <p style={{ marginTop: 10 }}>history: [{history.join(", ")}]</p>
      <p className="sub">
        The child never owns <code>count</code>. It calls callbacks; the parent
        chooses what to do.
      </p>
    </div>
  );
}
