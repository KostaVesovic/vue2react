import type { ReactNode } from "react";
import { useState } from "react";

// EXERCISE
// Build a <Modal /> with:
//   - `title` (string)
//   - `children` (body content — default slot)
//   - `actions` (footer — named slot as a prop)
//   - `open` / `onClose`
//
// 1. Render the overlay + modal body when `open` is true.
// 2. Clicking the overlay (but NOT the modal body) should call `onClose`.
// 3. Render `title`, `children`, and `actions` in the appropriate places.

interface ModalProps {
  // TODO
}

function Modal(_: ModalProps) {
  // TODO
  return null;
}

export default function Exercise() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)}>open modal</button>
      <Modal
        // open={open}
        // onClose={() => setOpen(false)}
        // title="Confirm delete"
        // actions={
        //   <>
        //     <button onClick={() => setOpen(false)}>cancel</button>{" "}
        //     <button onClick={() => setOpen(false)}>delete</button>
        //   </>
        // }
      >
        {/* body */}
        {/* <p>Are you sure? This cannot be undone.</p> */}
      </Modal>
    </div>
  );
}

export type _ = ReactNode;
