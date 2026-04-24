import { createContext, useContext, useState, type ReactNode } from "react";

interface Cart {
  items: string[];
  add: (item: string) => void;
  remove: (item: string) => void;
}

const CartContext = createContext<Cart | null>(null);

function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const value: Cart = {
    items,
    add: (item) => setItems((prev) => [...prev, item]),
    remove: (item) => setItems((prev) => {
      const idx = prev.indexOf(item);
      if (idx === -1) return prev;
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    }),
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

function AddButton({ item }: { item: string }) {
  const { add } = useCart();
  return <button onClick={() => add(item)}>add {item}</button>;
}

function CartSummary() {
  const { items, remove } = useCart();
  if (items.length === 0) return <p>cart is empty</p>;
  return (
    <ul>
      {items.map((item, i) => (
        <li key={`${item}-${i}`}>
          {item} <button onClick={() => remove(item)}>×</button>
        </li>
      ))}
    </ul>
  );
}

export default function Exercise() {
  return (
    <CartProvider>
      <div>
        <AddButton item="apple" />{" "}
        <AddButton item="banana" />{" "}
        <AddButton item="cherry" />
        <CartSummary />
      </div>
    </CartProvider>
  );
}
