import { useMemo, useState } from "react";

export default function Demo() {
  const [query, setQuery] = useState("");
  const [showExpensive, setShowExpensive] = useState(false);

  const users = ["Ada Lovelace", "Alan Turing", "Grace Hopper", "Linus Torvalds", "Rich Hickey"];

  // plain derived value — just compute it. No useMemo needed.
  // Runs on every render, which is fine for cheap work.
  const filtered = users.filter((u) =>
    u.toLowerCase().includes(query.toLowerCase()),
  );

  // expensive derived value — memoize it.
  // The function only re-runs when `query` changes.
  const expensiveStat = useMemo(() => {
    if (!showExpensive) return null;
    console.log("[expensive] recomputing for:", query);
    let n = 0;
    for (let i = 0; i < 5_000_000; i++) n += i % (query.length + 1);
    return n;
  }, [query, showExpensive]);

  return (
    <div>
      <input
        placeholder="filter users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {filtered.map((u) => <li key={u}>{u}</li>)}
      </ul>

      <label style={{ display: "block", marginTop: 12 }}>
        <input
          type="checkbox"
          checked={showExpensive}
          onChange={(e) => setShowExpensive(e.target.checked)}
        />{" "}
        run an expensive computation (check console)
      </label>
      {expensiveStat !== null && <p>expensive: {expensiveStat}</p>}
    </div>
  );
}
