import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ToastProps {
  message: string;
  onClose: () => void;
}

function Toast({ message, onClose }: ToastProps): ReactNode {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(onClose, 2500);
    return () => clearTimeout(id);
  }, [message, onClose]);

  if (!message) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        background: "#13151c",
        border: "1px solid #262a35",
        borderRadius: 8,
        padding: "10px 14px",
        color: "#e8eaed",
        boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        zIndex: 1000,
      }}
    >
      {message}
    </div>,
    document.body,
  );
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
