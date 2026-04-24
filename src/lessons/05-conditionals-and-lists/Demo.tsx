import { useState } from "react";

export default function Demo() {
  const [tab, setTab] = useState<"a" | "b" | "c">("a");
  const [showDetails, setShowDetails] = useState(false);
  const [items, setItems] = useState([
    { id: 1, label: "Alpha" },
    { id: 2, label: "Beta" },
    { id: 3, label: "Gamma" },
  ]);

  return (
    <div>
      <h3>Conditionals</h3>

      {/* ternary — v-if / v-else */}
      {showDetails ? <p>Here are the details.</p> : <p>Details hidden.</p>}
      <button onClick={() => setShowDetails((s) => !s)}>toggle</button>

      {/* && — v-if without an else */}
      {showDetails && <p style={{ color: "#7aa2f7" }}>(only visible when open)</p>}

      {/* chained — v-if / v-else-if / v-else */}
      {tab === "a" ? <p>You chose A.</p>
        : tab === "b" ? <p>You chose B.</p>
        : <p>You chose C.</p>}

      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        {(["a", "b", "c"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{ opacity: tab === t ? 1 : 0.5 }}
          >
            {t}
          </button>
        ))}
      </div>

      <h3 style={{ marginTop: 20 }}>Lists</h3>

      {/* the React v-for — .map(). KEY IS IMPORTANT. */}
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            #{index + 1}: {item.label}
          </li>
        ))}
      </ul>

      <button onClick={() => setItems([{ id: Date.now(), label: "New" }, ...items])}>
        prepend (watch the IDs stay stable)
      </button>{" "}
      <button onClick={() => setItems(items.slice().reverse())}>reverse</button>

      <h3 style={{ marginTop: 20 }}>Empty state</h3>
      {items.length === 0
        ? <p>No items.</p>
        : <p>{items.length} item(s).</p>}
    </div>
  );
}
