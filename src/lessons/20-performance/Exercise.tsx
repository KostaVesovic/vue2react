import { memo, useCallback, useState } from "react";

// EXERCISE
// 1. The <Row /> below re-renders every time the parent does.
//    Wrap it in React.memo and verify via the render-count display.
// 2. The `onPick` callback is re-created every render → memo breaks.
//    Fix it with useCallback.
// 3. Add a "typed filter" above the list. Changing the filter should NOT
//    cause unrelated rows to re-render. (They only need to re-render if
//    their item or the filter match changes — here, the filter is only
//    used in the parent's render to decide visibility.)

interface Item { id: number; text: string }
const ITEMS: Item[] = Array.from({ length: 8 }, (_, i) => ({ id: i, text: `item ${i}` }));

// TODO 1: wrap with memo
function Row({ item, onPick }: { item: Item; onPick: (id: number) => void }) {
  // a tiny render counter in module scope per row (hacky but illustrative)
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
}

const renderCounts: Record<number, number> = {};

export default function Exercise() {
  const [tick, setTick] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  // TODO 2: wrap with useCallback
  const onPick = (id: number) => setPicked(id);

  return (
    <div>
      <button onClick={() => setTick((t) => t + 1)}>tick ({tick})</button>
      <p>picked: {picked ?? "(none)"}</p>
      <ul>
        {ITEMS.map((item) => (
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

void memo;
void useCallback;
