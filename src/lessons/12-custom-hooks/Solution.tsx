import { useCallback, useState } from "react";

function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn((v) => !v), []);
  return [on, toggle, setOn] as const;
}

export default function Exercise() {
  const [open, toggle, setOpen] = useToggle(false);

  return (
    <div>
      <button onClick={toggle}>{open ? "hide" : "show"} details</button>{" "}
      <button onClick={() => setOpen(false)}>force close</button>
      {open && <p>Secret: The real tutorial is the hooks we wrote along the way.</p>}
    </div>
  );
}
