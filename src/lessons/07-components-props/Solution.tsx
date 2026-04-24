import type { ReactNode } from "react";

interface StatProps {
  label: string;
  value: number;
  suffix?: string;
  children?: ReactNode;
}

function Stat({ label, value, suffix = "", children }: StatProps) {
  return (
    <div style={{ border: "1px solid #262a35", borderRadius: 8, padding: 10 }}>
      <div style={{ color: "#8b90a8", fontSize: 12 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600 }}>
        {value}{suffix}
      </div>
      {children && <div style={{ color: "#8b90a8", fontSize: 12, marginTop: 4 }}>{children}</div>}
    </div>
  );
}

export default function Exercise() {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <Stat label="Revenue" value={12_450} suffix=" USD" />
      <Stat label="Users" value={1337}>
        trending up 8% this week
      </Stat>
      <Stat label="Latency" value={92} suffix=" ms">
        <small>p95 over 24h</small>
      </Stat>
    </div>
  );
}
