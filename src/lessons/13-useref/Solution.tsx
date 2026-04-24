import { useRef, useState } from "react";

export default function Exercise() {
  const [text, setText] = useState("type something, blur, edit, then undo");
  const ref = useRef<HTMLTextAreaElement>(null);
  const lastSaved = useRef<string>(text);

  return (
    <div>
      <textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          lastSaved.current = text;
        }}
        rows={4}
        style={{ width: "100%" }}
      />
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        <button
          onClick={() => {
            setText("");
            ref.current?.focus();
          }}
        >
          clear & focus
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setText(lastSaved.current)}
        >
          undo to last blur
        </button>
      </div>
    </div>
  );
}
