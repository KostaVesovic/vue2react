import { Component, type ReactNode } from "react";

interface EBProps {
  children: ReactNode;
  fallback: ReactNode;
  onError?: (err: Error) => void;
  resetKey?: unknown;
}

interface EBState { error: Error | null }

class ErrorBoundary extends Component<EBProps, EBState> {
  override state: EBState = { error: null };

  static getDerivedStateFromError(error: Error): EBState {
    return { error };
  }

  override componentDidCatch(err: Error) {
    this.props.onError?.(err);
    console.error(err);
  }

  override componentDidUpdate(prevProps: EBProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  override render() {
    if (this.state.error) return this.props.fallback;
    return this.props.children;
  }
}

function Widget({ seed }: { seed: number }) {
  if (seed % 2 === 0) throw new Error(`even seed ${seed} is forbidden`);
  return <p>seed {seed} is fine.</p>;
}

export default function Exercise() {
  const seeds = [1, 2, 3, 4, 5, 6];
  return (
    <div>
      <p>Use the buttons; even seeds throw. Test that onError logs and that changing seed recovers.</p>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {seeds.map((s) => <SeedCell key={s} seed={s} />)}
      </div>
    </div>
  );
}

function SeedCell({ seed }: { seed: number }) {
  return (
    <div style={{ border: "1px solid #262a35", padding: 8, borderRadius: 6 }}>
      <ErrorBoundary
        resetKey={seed}
        fallback={<em style={{ color: "#f77a7a" }}>seed {seed} blew up</em>}
        onError={(e) => console.log("caught:", e.message)}
      >
        <Widget seed={seed} />
      </ErrorBoundary>
    </div>
  );
}
