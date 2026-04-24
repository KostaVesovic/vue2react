import { useState } from "react";

export default function Demo() {
  const [name, setName] = useState("Ada");
  const [agreed, setAgreed] = useState(false);
  const [color, setColor] = useState("blue");
  const [log, setLog] = useState<string[]>([]);

  const append = (s: string) => setLog((l) => [...l, s].slice(-5));

  return (
    <div>
      <h3>events</h3>
      <button onClick={() => append("clicked")}>click me</button>{" "}
      <button onClick={(e) => append(`clicked at ${e.clientX}, ${e.clientY}`)}>
        with event
      </button>{" "}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); append("prevented"); }}
      >
        preventDefault + stopPropagation
      </button>
      <ul>{log.map((l, i) => <li key={i}><code>{l}</code></li>)}</ul>

      <h3>two-way binding (the React way)</h3>
      <p>Vue's <code>v-model</code> is sugar for <code>:value + @input</code>. React makes you write both halves:</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="type your name"
      />
      <p>hello, {name}!</p>

      <label style={{ display: "block", marginTop: 12 }}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />{" "}
        agreed: {String(agreed)}
      </label>

      <div style={{ marginTop: 12 }}>
        <label>
          color:{" "}
          <select value={color} onChange={(e) => setColor(e.target.value)}>
            <option value="red">red</option>
            <option value="green">green</option>
            <option value="blue">blue</option>
          </select>
        </label>
        <span style={{ color, marginLeft: 10 }}>● you picked {color}</span>
      </div>

      <h3 style={{ marginTop: 20 }}>modifiers (do it yourself)</h3>
      <form
        onSubmit={(e) => { e.preventDefault(); append("submitted"); }}
        style={{ display: "flex", gap: 6 }}
      >
        <input placeholder="press enter" />
        <button type="submit">go</button>
      </form>
      <p className="sub">
        No <code>.prevent</code> — call <code>e.preventDefault()</code>.
        No <code>.stop</code> — call <code>e.stopPropagation()</code>.
        No <code>.enter</code> — check <code>e.key === 'Enter'</code> in <code>onKeyDown</code>.
      </p>
    </div>
  );
}
