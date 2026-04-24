import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

// Modal mounts its DOM outside the normal tree (directly under <body>),
// but stays in the React tree for props/state/context.
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#13151c",
          border: "1px solid #262a35",
          borderRadius: 12,
          padding: 20,
          minWidth: 320,
        }}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <div style={{ overflow: "hidden", padding: 8, border: "1px dashed #3a4a68" }}>
      <p className="sub">
        This parent div has <code>overflow: hidden</code>, yet the modal below
        escapes it because its DOM is portaled to <code>document.body</code>.
      </p>
      <p>count: {count} <button onClick={() => setCount((c) => c + 1)}>+1</button></p>
      <button onClick={() => setOpen(true)}>open modal</button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h3 style={{ marginTop: 0 }}>I'm portaled</h3>
        <p>But I still read parent state: count = {count}</p>
        <p className="sub">press Escape or click the backdrop to close.</p>
        <button onClick={() => setOpen(false)}>close</button>
      </Modal>
    </div>
  );
}
