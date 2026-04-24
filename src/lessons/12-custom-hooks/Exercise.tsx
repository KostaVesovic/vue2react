import { useState } from "react";

// EXERCISE — write useToggle()
//
// Signature: const [on, toggle, setOn] = useToggle(initial = false)
//   - on: boolean
//   - toggle: () => void
//   - setOn: (value: boolean) => void
//
// Use it in <Exercise /> to control a details panel.

// TODO: implement useToggle
function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  // TODO
  return [on, () => {}, setOn] as const;
}

// BONUS EXERCISE — useFetch<T>(url) returns { data, error, loading }.
// Assume JSON. Cancel in-flight requests when url changes. Handle errors.
// (Hint: useEffect + AbortController; don't setState after unmount/abort.)

// Try this one after useToggle works.

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
