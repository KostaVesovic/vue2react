import { useState } from "react";

// EXERCISE — build a simple enter/leave fade WITHOUT a library.
// 1. When `open` is true, render <div className="drawer open">...</div>.
//    When false, render <div className="drawer closed">...</div>.
//    DO NOT conditionally render (otherwise the leaving animation can't run).
// 2. Add CSS transitioning transform + opacity between `.open` and `.closed`.
// 3. BONUS: Use an `unmountAfter` local state — when open flips to false,
//    wait 300ms (matching your CSS), then set a flag that removes the node.
//    (Hint: useEffect + setTimeout, reset when open flips true again.)

export default function Exercise() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen((o) => !o)}>toggle drawer</button>

      <style>{`
        .drawer {
          margin-top: 10px;
          padding: 14px;
          background: #14212a;
          border: 1px solid #1f3847;
          border-radius: 8px;
          /* TODO 2: transition rules go here */
        }
        .drawer.open   { /* TODO 2 */ }
        .drawer.closed { /* TODO 2 */ }
      `}</style>

      {/* TODO 1: render a div with class "drawer open" or "drawer closed" */}
      {/* (for the bonus, also avoid rendering it at all once closing is done) */}
      <p>Drawer contents.</p>
    </div>
  );
}
