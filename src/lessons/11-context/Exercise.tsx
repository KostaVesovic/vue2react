import { createContext, useContext, useState, type ReactNode } from "react";

// EXERCISE — build a Cart context.
// 1. Create CartContext with:
//    - items: string[]
//    - add: (item: string) => void
//    - remove: (item: string) => void
// 2. Create a CartProvider that holds state and supplies those functions.
// 3. Write a useCart() hook that throws if used outside the provider.
// 4. Fill in <AddButton> and <CartSummary> to use the hook.
// 5. Wrap the component tree in the provider.

// TODO 1
interface Cart {}
const CartContext = createContext<Cart | null>(null);

// TODO 2
function CartProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

// TODO 3
// function useCart() { ... }

function AddButton({ item }: { item: string }) {
  // TODO 4 — get add from useCart()
  return <button /* onClick={() => add(item)} */>add {item}</button>;
}

function CartSummary() {
  // TODO 4 — get items + remove from useCart()
  return <p>cart is empty</p>;
}

export default function Exercise() {
  // TODO 5
  return (
    <div>
      <AddButton item="apple" />{" "}
      <AddButton item="banana" />{" "}
      <AddButton item="cherry" />
      <CartSummary />
    </div>
  );
}

// hint: you'll also need useState here
void useState;
