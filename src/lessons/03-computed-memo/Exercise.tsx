import { useState } from "react";

// EXERCISE
// Given a list of products and a min-price filter:
// 1. Compute `visible` — the filtered list. NO useMemo; it's cheap.
// 2. Compute `total` — the sum of visible prices. Same.
// 3. Compute `sorted` — visible sorted by price descending.
//    Sorting is "expensive-feeling"; use useMemo so the TODO comment later asks
//    you to observe when it runs.
// 4. BONUS: Change `minPrice` to a string-typed input. What goes wrong?
//    How do you fix it? (Hint: Number(...))

interface Product { id: number; name: string; price: number }

const products: Product[] = [
  { id: 1, name: "Mechanical keyboard", price: 180 },
  { id: 2, name: "USB-C cable", price: 12 },
  { id: 3, name: "Monitor arm", price: 140 },
  { id: 4, name: "Notebook", price: 8 },
  { id: 5, name: "Standing desk", price: 520 },
];

export default function Exercise() {
  const [minPrice, setMinPrice] = useState(0);

  // TODO 1
  const visible: Product[] = [];

  // TODO 2
  const total = 0;

  // TODO 3 (use useMemo)
  const sorted: Product[] = [];

  return (
    <div>
      <label>
        min price:{" "}
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(Number(e.target.value))}
        />
      </label>
      <p>showing {visible.length} of {products.length}, total ${total}</p>
      <ol>
        {sorted.map((p) => (
          <li key={p.id}>{p.name} — ${p.price}</li>
        ))}
      </ol>
    </div>
  );
}
