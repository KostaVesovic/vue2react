import type { ReactNode } from "react";
import { useState } from "react";

// === 1. Default slot → children ===
function Card({ children }: { children: ReactNode }) {
  return (
    <section style={{ border: "1px solid #262a35", borderRadius: 8, padding: 14 }}>
      {children}
    </section>
  );
}

// === 2. Named slots → JSX as props ===
interface LayoutProps {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;     // main content
  footer?: ReactNode;
}

function Layout({ header, sidebar, children, footer }: LayoutProps) {
  return (
    <div style={{ border: "1px solid #262a35", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ padding: 10, background: "#1a1d26" }}>{header}</div>
      <div style={{ display: "grid", gridTemplateColumns: "140px 1fr" }}>
        <div style={{ padding: 10, background: "#14161e" }}>{sidebar}</div>
        <div style={{ padding: 10 }}>{children}</div>
      </div>
      {footer && <div style={{ padding: 10, borderTop: "1px solid #262a35" }}>{footer}</div>}
    </div>
  );
}

// === 3. Scoped slot → render prop ===
// Vue: <DataList :items="..."><template #item="{ row }">...</template></DataList>
// React: the child receives state from the parent via a function you pass in.
interface DataListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  renderEmpty?: () => ReactNode;
}

function DataList<T>({ items, renderItem, renderEmpty }: DataListProps<T>) {
  if (items.length === 0) return <>{renderEmpty?.() ?? <em>No items.</em>}</>;
  return <ul>{items.map((it, i) => <li key={i}>{renderItem(it, i)}</li>)}</ul>;
}

export default function Demo() {
  const [items] = useState([
    { id: 1, name: "Monitor", price: 420 },
    { id: 2, name: "Keyboard", price: 180 },
  ]);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <Card>
        <h4 style={{ margin: 0 }}>Default slot</h4>
        <p>Anything nested inside a component lands in <code>children</code>.</p>
      </Card>

      <Layout
        header={<b>my app</b>}
        sidebar={<nav><a href="#">home</a><br /><a href="#">about</a></nav>}
        footer={<small>© 2026</small>}
      >
        <p>This is the main slot — it's the implicit <code>children</code>.</p>
      </Layout>

      <DataList
        items={items}
        renderItem={(item) => (
          <><b>{item.name}</b> — ${item.price}</>
        )}
        renderEmpty={() => <em>Nothing here yet.</em>}
      />
    </div>
  );
}
