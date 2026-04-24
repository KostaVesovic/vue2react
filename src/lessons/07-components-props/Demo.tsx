import type { ReactNode } from "react";

// A React component is just a function that returns JSX.
// Props are the function's single argument — an object.

interface BadgeProps {
  label: string;
  tone?: "info" | "warn" | "danger";   // optional — note the ?
  count?: number;
}

function Badge({ label, tone = "info", count }: BadgeProps) {
  const colors = { info: "#7aa2f7", warn: "#f7bb7a", danger: "#f77a7a" } as const;
  return (
    <span style={{
      background: colors[tone] + "33",
      border: `1px solid ${colors[tone]}`,
      color: colors[tone],
      padding: "2px 8px",
      borderRadius: 999,
      fontSize: 12,
      marginRight: 8,
    }}>
      {label}{count !== undefined && ` (${count})`}
    </span>
  );
}

// `children` is a special prop — whatever JSX the parent nests inside.
// Equivalent to Vue's default slot.
interface CardProps {
  title: string;
  children: ReactNode;     // <-- the type for "anything React can render"
}

function Card({ title, children }: CardProps) {
  return (
    <section style={{
      border: "1px solid #262a35",
      borderRadius: 10,
      padding: 14,
      marginTop: 12,
    }}>
      <header style={{ color: "#f5f6f8", marginBottom: 8 }}>{title}</header>
      {children}
    </section>
  );
}

export default function Demo() {
  return (
    <div>
      <Badge label="new" />
      <Badge label="unstable" tone="warn" />
      <Badge label="deprecated" tone="danger" count={12} />

      <Card title="Profile">
        <p>This is nested content — it comes in as the <code>children</code> prop.</p>
        <Badge label="admin" />
      </Card>

      <Card title="Another card">
        <p>Cards are reusable because their content is just whatever you nest inside.</p>
      </Card>
    </div>
  );
}
