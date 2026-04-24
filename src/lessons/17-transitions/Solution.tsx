import { useEffect, useState } from "react";

export default function Exercise() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    const id = setTimeout(() => setMounted(false), 300);
    return () => clearTimeout(id);
  }, [open]);

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
          transition: opacity 300ms ease, transform 300ms ease;
        }
        .drawer.open   { opacity: 1; transform: translateY(0); }
        .drawer.closed { opacity: 0; transform: translateY(-8px); }
      `}</style>

      {mounted && (
        <div className={`drawer ${open ? "open" : "closed"}`}>
          <p>Drawer contents.</p>
        </div>
      )}
    </div>
  );
}
