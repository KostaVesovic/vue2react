import { useState } from "react";

// EXERCISE — build a tiny counter + name editor.
// 1. Add useState for `count` (starting at 10) and `name` (starting at "").
// 2. Wire up the + / - buttons.
// 3. Bind the input so typing updates `name`. (Hint: value + onChange)
// 4. The "double click" button should add 2 to count, using the FUNCTIONAL
//    form so two rapid clicks both count. Try both forms to see the bug.

export default function Exercise() {
  // TODO 1
  // const [count, setCount] = useState(...)
  // const [name, setName] = useState(...)

  return (
    <div>
      <h3>count: {/* TODO: show count */}</h3>
      <button /* TODO 2: onClick */>-1</button>{" "}
      <button /* TODO 2: onClick */>+1</button>{" "}
      <button /* TODO 4: onClick that adds 2 via two functional updates */>+2</button>

      <h3 style={{ marginTop: 16 }}>name: {/* TODO: show name */}</h3>
      <input
        placeholder="type your name"
        /* TODO 3: value + onChange */
      />
    </div>
  );

  // State to guide you:
  // - Why `setCount(c => c + 1)` works twice in a row but `setCount(count + 1)` doesn't?
  //   In Vue, `count.value++` reads the current value synchronously. In React, `count` inside
  //   the handler is a CLOSURE over the value at render time — stale after the first update.
  //   The functional form `setCount(c => c + 1)` receives the freshest value.
}
