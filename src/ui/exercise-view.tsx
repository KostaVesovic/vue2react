import { Sandpack } from "@codesandbox/sandpack-react";
import { useState, type ReactNode } from "react";

interface ExerciseViewProps {
  instructions: ReactNode;
  starter: string;
  solution?: string | undefined;
  appWrapper?: string | undefined;
  dependencies?: Record<string, string> | undefined;
}

const defaultAppWrapper = `import Exercise from "./Exercise";

export default function App() {
  return (
    <div style={{ padding: 16, fontFamily: "-apple-system, system-ui, sans-serif", color: "#e8eaed", background: "#0f1115", minHeight: "100vh" }}>
      <Exercise />
    </div>
  );
}
`;

export function ExerciseView({ instructions, starter, solution, appWrapper, dependencies }: ExerciseViewProps) {
  const [showSolution, setShowSolution] = useState(false);
  const code = showSolution && solution ? solution : starter;

  return (
    <div className="exercise-view">
      <div className="exercise-instructions">
        <div className="exercise-label">
          <span>Your task</span>
          {solution && (
            <button
              type="button"
              className="solution-toggle"
              onClick={() => setShowSolution((v) => !v)}
            >
              {showSolution ? "Reset to starter" : "Show solution"}
            </button>
          )}
        </div>
        <div className="exercise-instructions-body">{instructions}</div>
      </div>

      {dependencies ? (
        <Sandpack
          key={showSolution ? "solution" : "starter"}
          template="react-ts"
          theme={sandpackTheme}
          files={{
            "/App.tsx": { code: appWrapper ?? defaultAppWrapper },
            "/Exercise.tsx": { code, active: true },
          }}
          customSetup={{ dependencies }}
          options={sandpackOptions}
        />
      ) : (
        <Sandpack
          key={showSolution ? "solution" : "starter"}
          template="react-ts"
          theme={sandpackTheme}
          files={{
            "/App.tsx": { code: appWrapper ?? defaultAppWrapper },
            "/Exercise.tsx": { code, active: true },
          }}
          options={sandpackOptions}
        />
      )}
    </div>
  );
}

const sandpackOptions = {
  editorHeight: 480,
  showLineNumbers: true,
  showTabs: false,
  showNavigator: false,
  wrapContent: false,
};

const sandpackTheme = {
  colors: {
    surface1: "#13151c",
    surface2: "#1a1d26",
    surface3: "#262a35",
    clickable: "#b4b8cc",
    base: "#e8eaed",
    disabled: "#8b90a8",
    hover: "#f5f6f8",
    accent: "#7aa2f7",
  },
  syntax: {
    plain: "#e8eaed",
    comment: { color: "#8b90a8", fontStyle: "italic" as const },
    keyword: "#c99af7",
    tag: "#61dafb",
    punctuation: "#b4b8cc",
    definition: "#7aa2f7",
    property: "#42b883",
    static: "#f7bb7a",
    string: "#7af7aa",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, Menlo, Monaco, Consolas, monospace',
    size: "13px",
    lineHeight: "1.55",
  },
};
