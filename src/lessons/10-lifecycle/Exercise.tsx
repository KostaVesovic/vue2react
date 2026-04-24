import { useEffect, useState } from "react";

// EXERCISE
// Build a <Timer /> that shows how many seconds have passed since it mounted.
// 1. useState for seconds, useEffect with setInterval + cleanup.
// 2. Log "mounted" and "unmounted" to the console to verify cleanup works.
// 3. The parent has a button that toggles the timer — when you unmount it,
//    the interval MUST stop (otherwise it leaks memory and keeps firing after
//    the component is gone).
// 4. Bonus: only update state if the document is visible (hint: document.visibilityState).
//    You don't strictly need this for correctness — it's a subtle perf pattern.

function Timer() {
  // TODO 1, 2, 4
  return <p>0s elapsed</p>;
}

export default function Exercise() {
  const [show, setShow] = useState(true);
  return (
    <div>
      <button onClick={() => setShow((s) => !s)}>
        {show ? "unmount timer" : "mount timer"}
      </button>
      {show && <Timer />}
    </div>
  );
}

// Keep useEffect imported for you
void useEffect;
