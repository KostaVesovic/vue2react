import { useState } from "react";

export default function Demo() {
  const [show, setShow] = useState(true);
  const [items, setItems] = useState([1, 2, 3]);
  const nextId = Math.max(0, ...items) + 1;

  return (
    <div>
      <h3>Pure-CSS enter/leave</h3>
      <p className="sub">
        The classic Vue <code>&lt;Transition&gt;</code> uses CSS classes
        <code>v-enter-from</code>, <code>v-enter-active</code>, etc. React has none of this,
        but you can do the same thing by hand: toggle a class + <code>transition</code>.
      </p>

      <button onClick={() => setShow((s) => !s)}>toggle</button>
      <style>{`
        .fade {
          transition: opacity 300ms, transform 300ms;
          display: inline-block; margin-left: 10px;
        }
        .fade.in { opacity: 1; transform: translateY(0); }
        .fade.out { opacity: 0; transform: translateY(-8px); }
      `}</style>
      <span className={`fade ${show ? "in" : "out"}`}>
        hello, I fade
      </span>

      <h3 style={{ marginTop: 20 }}>List transitions</h3>
      <p className="sub">
        Vue has <code>&lt;TransitionGroup&gt;</code>. React has no built-in.
        You use libraries like <code>framer-motion</code> or
        <code>@formkit/auto-animate</code>. Here's a no-lib CSS-only version.
      </p>
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        <button onClick={() => setItems((xs) => [...xs, nextId])}>add</button>
        <button onClick={() => setItems((xs) => xs.slice(0, -1))} disabled={items.length === 0}>
          pop
        </button>
        <button onClick={() => setItems((xs) => [...xs].reverse())}>reverse</button>
      </div>
      <style>{`
        @keyframes pop { from { transform: scale(0.6); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        .pill {
          display: inline-block; padding: 6px 12px; border-radius: 999px;
          background: #273449; border: 1px solid #3a4a68; margin: 3px;
          animation: pop 220ms ease-out;
        }
      `}</style>
      <div>
        {items.map((n) => <span key={n} className="pill">{n}</span>)}
      </div>

      <h3 style={{ marginTop: 20 }}>The honest answer</h3>
      <p>
        If you want Vue's declarative enter/leave + list shuffling, install:
      </p>
      <ul>
        <li><code>framer-motion</code> — the closest to Vue's ergonomics, plus physics-based animation</li>
        <li><code>@formkit/auto-animate</code> — tiny, works with plain DOM, no JSX change</li>
        <li><code>react-transition-group</code> — the old standard, class-based, verbose</li>
      </ul>
    </div>
  );
}
