import { memo, useCallback, useState } from "react";

interface Item {
  id: number;
  text: string;
}
const ITEMS: Item[] = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  text: `item ${i}`,
}));

const renderCounts: Record<number, number> = {};

const Row = memo(function Row({
  item,
  onPick,
}: {
  item: Item;
  onPick: (id: number) => void;
}) {
  renderCounts[item.id] = (renderCounts[item.id] ?? 0) + 1;
  return (
    <li>
      {item.text}{" "}
      <button onClick={() => onPick(item.id)}>pick</button>
      <span style={{ color: "#6b7290", marginLeft: 8 }}>
        rendered {renderCounts[item.id]}×
      </span>
    </li>
  );
});

export default function Exercise() {
  const [tick, setTick] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [filter, setFilter] = useState("");

  const onPick = useCallback((id: number) => setPicked(id), []);

  return (
    <div>
      <button onClick={() => setTick((t) => t + 1)}>tick ({tick})</button>
      <p>picked: {picked ?? "(none)"}</p>
      <input
        placeholder="filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: 8, display: "block" }}
      />
      <ul>
        {ITEMS.filter((i) => i.text.includes(filter)).map((item) => (
          <Row key={item.id} item={item} onPick={onPick} />
        ))}
      </ul>
      <p className="sub">
        After applying memo + useCallback, ticking should NOT increment row
        render counts. Reload the lesson to reset counters.
      </p>
    </div>
  );
}
