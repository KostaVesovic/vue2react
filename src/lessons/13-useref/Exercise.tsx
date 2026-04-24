import { useRef, useState } from "react";

// EXERCISE
// 1. Create a ref for the <textarea> element.
// 2. The "clear & focus" button should empty the textarea (via state) AND
//    call .focus() on the ref.
// 3. Create a second ref that stores the last value `onBlur` so you can
//    "undo" back to it. The undo button restores it.
//    (The undo ref should NOT trigger re-renders when it changes.)

export default function Exercise() {
  const [text, setText] = useState("type something, blur, edit, then undo");

  // TODO 1: const ref = useRef<HTMLTextAreaElement>(null)
  // TODO 3: const lastSaved = useRef<string>(text)

  return (
    <div>
      <textarea
        // TODO 1: ref={...}
        value={text}
        onChange={(e) => setText(e.target.value)}
        // TODO 3: onBlur -> lastSaved.current = text
        rows={4}
        style={{ width: "100%" }}
      />
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        <button
          onClick={() => {
            setText("");
            // TODO 2: focus the textarea
          }}
        >
          clear & focus
        </button>
        <button
          onClick={() => {
            // TODO 3: setText(lastSaved.current)
          }}
        >
          undo to last blur
        </button>
      </div>
    </div>
  );
}

// unused imports kept in scope as hints
void useRef;
