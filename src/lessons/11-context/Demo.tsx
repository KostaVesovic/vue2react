import { createContext, useContext, useState, type ReactNode } from "react";

// 1. Create the context with a default value that shapes the API.
interface ThemeCtx {
  theme: "light" | "dark";
  toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx | null>(null);

// 2. A provider component that actually holds state.
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const value: ThemeCtx = {
    theme,
    toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// 3. A typed hook that enforces usage inside the provider.
function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

// 4. Any depth of nesting reads the context.
function DeepChild() {
  const { theme, toggle } = useTheme();
  return (
    <div style={{
      padding: 12,
      background: theme === "dark" ? "#0f1115" : "#f5f6f8",
      color: theme === "dark" ? "#e8eaed" : "#0f1115",
      border: "1px solid #262a35",
      borderRadius: 8,
    }}>
      <p>I'm 3 levels deep and I read the theme directly.</p>
      <button onClick={toggle}>toggle theme</button>
    </div>
  );
}

function Middle() {
  return <div style={{ padding: 10, border: "1px dashed #3a4a68" }}><DeepChild /></div>;
}

function Top() {
  return <div style={{ padding: 10, border: "1px dashed #3a4a68" }}><Middle /></div>;
}

export default function Demo() {
  return (
    <ThemeProvider>
      <Top />
    </ThemeProvider>
  );
}
