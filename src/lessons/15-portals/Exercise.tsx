import { useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

// EXERCISE — build a <Toast /> that portals into document.body.
// 1. Accept `message: string` and `onClose: () => void`.
// 2. Render it into a portal with position fixed in the bottom-right.
// 3. Auto-dismiss after 2500ms (useEffect + setTimeout + cleanup).
// 4. Don't render anything if message is empty.

interface ToastProps {
  message: string;
  onClose: () => void;
}

function Toast(_: ToastProps): ReactNode {
  // TODO 1–4
  return null;
}

export default function Exercise() {
  const [message, setMessage] = useState("");

  return (
    <div>
      <button onClick={() => setMessage("saved at " + new Date().toLocaleTimeString())}>
        fire toast
      </button>
      <Toast message={message} onClose={() => setMessage("")} />
    </div>
  );
}

void createPortal;   // hint
