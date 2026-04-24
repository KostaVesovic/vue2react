import { Component, type ReactNode } from "react";

// EXERCISE — turn the provided class ErrorBoundary into a *reusable* one:
// 1. Accept an optional `onError` prop that logs the error.
// 2. Add a `resetKey` prop — if it changes, reset the error state.
//    (Hint: getDerivedStateFromProps or componentDidUpdate.)
// 3. Wrap <Widget /> below and test it.

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
    // TODO 1: call this.props.onError if provided
    console.error(err);
  }

  // TODO 2: componentDidUpdate — if prevProps.resetKey !== this.props.resetKey,
  // reset state to { error: null }

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
  // pressing the button changes the key; the boundary should also reset
  // once you implement TODO 2
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
