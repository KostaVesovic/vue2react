import { useMemo, useState } from "react";

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

  const visible = products.filter((p) => p.price >= minPrice);

  const total = visible.reduce((sum, p) => sum + p.price, 0);

  const sorted = useMemo(
    () => products
      .filter((p) => p.price >= minPrice)
      .sort((a, b) => b.price - a.price),
    [minPrice],
  );

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
