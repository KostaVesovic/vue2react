import { memo, useCallback, useMemo, useState } from "react";

// === A child that's expensive to render ===
// Wrapping in React.memo means it skips re-render if props are shallowly equal.
const ExpensiveRow = memo(function ExpensiveRow({ item, onClick }: {
  item: { id: number; text: string };
  onClick: (id: number) => void;
}) {
  // simulate expensive render
  let n = 0;
  for (let i = 0; i < 200_000; i++) n += i;
  return (
    <li>
      [{n % 7}] {item.text}{" "}
      <button onClick={() => onClick(item.id)}>select</button>
    </li>
  );
});

export default function Demo() {
  const [tick, setTick] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [useCallbackOn, setUseCallbackOn] = useState(true);

  // Stable items reference — useMemo so the array identity doesn't change per render
  const items = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({ id: i, text: `row ${i}` })),
    [],
  );

  // A raw inline callback would be a NEW function every render, defeating React.memo.
  // useCallback preserves identity when `deps` don't change.
  const onSelectStable = useCallback((id: number) => setSelected(id), []);
  const onSelectUnstable = (id: number) => setSelected(id);

  return (
    <div>
      <p className="sub">
        Click "tick" to trigger a parent re-render. With <b>useCallback ON</b>,
        <code>ExpensiveRow</code> will skip re-rendering because props are stable.
        Turn it OFF — the rows all re-render (you'll feel the delay).
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        <button onClick={() => setTick((t) => t + 1)}>tick ({tick})</button>
        <label>
          <input
            type="checkbox"
            checked={useCallbackOn}
            onChange={(e) => setUseCallbackOn(e.target.checked)}
          />{" "}
          useCallback ON
        </label>
      </div>

      <ul>
        {items.map((item) => (
          <ExpensiveRow
            key={item.id}
            item={item}
            onClick={useCallbackOn ? onSelectStable : onSelectUnstable}
          />
        ))}
      </ul>

      <p>selected: {selected ?? "(none)"}</p>
    </div>
  );
}
