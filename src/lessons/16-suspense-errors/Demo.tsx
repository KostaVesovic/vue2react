import { Component, Suspense, lazy, useState, type ErrorInfo, type ReactNode } from "react";

// === 1. Error Boundary — a class component (the ONLY place you need a class) ===
interface EBProps { children: ReactNode; fallback: (err: Error, reset: () => void) => ReactNode }
interface EBState { error: Error | null }

class ErrorBoundary extends Component<EBProps, EBState> {
  override state: EBState = { error: null };

  static getDerivedStateFromError(error: Error): EBState {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("caught:", error, info);
  }

  override render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, () => this.setState({ error: null }));
    }
    return this.props.children;
  }
}

function Boom({ trigger }: { trigger: boolean }) {
  if (trigger) throw new Error("💥 something exploded");
  return <p>✅ no error</p>;
}

// === 2. Suspense — used with lazy components and async resources ===
// simulate a slow import
const SlowChild = lazy(async () => {
  await new Promise((r) => setTimeout(r, 1500));
  return {
    default: () => <p>⚡️ SlowChild finally loaded.</p>,
  };
});

export default function Demo() {
  const [boom, setBoom] = useState(false);
  const [showSlow, setShowSlow] = useState(false);

  return (
    <div>
      <h3>Error boundary</h3>
      <ErrorBoundary fallback={(err, reset) => (
        <div style={{ color: "#f77a7a", padding: 10, border: "1px solid #f77a7a", borderRadius: 6 }}>
          Error: {err.message} <button onClick={reset}>retry</button>
        </div>
      )}>
        <Boom trigger={boom} />
      </ErrorBoundary>
      <button onClick={() => setBoom(true)}>throw</button>

      <h3 style={{ marginTop: 24 }}>Suspense (with React.lazy)</h3>
      <button onClick={() => setShowSlow((s) => !s)}>
        {showSlow ? "hide" : "load SlowChild"}
      </button>
      {showSlow && (
        <Suspense fallback={<p>⏳ loading…</p>}>
          <SlowChild />
        </Suspense>
      )}
    </div>
  );
}
