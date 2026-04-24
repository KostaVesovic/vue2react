import type { ReactNode } from "react";

// EXERCISE
// Build a <Stat /> component that shows a label and a value.
// 1. Define Props with:
//    - label: string (required)
//    - value: number (required)
//    - suffix: string (optional, default "")
//    - children: ReactNode (optional; renders below the value as a hint)
// 2. Destructure props in the function signature, default `suffix` to "".
// 3. Render label, then value + suffix, then the children (if any) below.
// 4. Spread props to <Stat>: use it three times in the page with different content.

// TODO: define StatProps
interface StatProps {}

// TODO: implement Stat
function Stat(_: StatProps) {
  return <div>TODO</div>;
}

export default function Exercise() {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <Stat /* label="Revenue" value={12450} suffix=" USD" */ />
      <Stat /* label="Users" value={1337} */>
        {/* trending up 8% this week */}
      </Stat>
      <Stat /* label="Latency" value={92} suffix=" ms" */>
        {/* <small>p95 over 24h</small> */}
      </Stat>
    </div>
  );
}

// Keep this ReactNode import visible as a hint even if unused
export type _ = ReactNode;
