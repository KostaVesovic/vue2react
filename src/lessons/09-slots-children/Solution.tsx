import { useState, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

function Modal({ open, onClose, title, children, actions }: ModalProps) {
  if (!open) return null;
  return (
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
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <div>{children}</div>
        {actions && <div style={{ marginTop: 16, display: "flex", gap: 6, justifyContent: "flex-end" }}>{actions}</div>}
      </div>
    </div>
  );
}

export default function Exercise() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)}>open modal</button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm delete"
        actions={
          <>
            <button onClick={() => setOpen(false)}>cancel</button>{" "}
            <button onClick={() => setOpen(false)}>delete</button>
          </>
        }
      >
        <p>Are you sure? This cannot be undone.</p>
      </Modal>
    </div>
  );
}
