import type { ComponentType } from "react";

interface DemoViewProps {
  Demo: ComponentType;
  reactSource: string;
  vueSource?: string | undefined;
}

export function DemoView({ Demo, reactSource, vueSource }: DemoViewProps) {
  return (
    <div className="demo-view">
      <div className="demo-stage">
        <div className="demo-stage-label">Live preview</div>
        <div className="demo-stage-box">
          <Demo />
        </div>
      </div>

      <div className="demo-sources">
        {vueSource ? (
          <div className="sbs">
            <div className="sbs-col vue">
              <div className="sbs-title">Vue SFC</div>
              <pre><code>{vueSource.replace(/^\n+|\n+$/g, "")}</code></pre>
            </div>
            <div className="sbs-col react">
              <div className="sbs-title">React (what's running above)</div>
              <pre><code>{reactSource.replace(/^\n+|\n+$/g, "")}</code></pre>
            </div>
          </div>
        ) : (
          <div className="sbs-col react" style={{ border: "1px solid var(--border)", borderRadius: 10 }}>
            <div className="sbs-title">React (what's running above)</div>
            <pre><code>{reactSource.replace(/^\n+|\n+$/g, "")}</code></pre>
          </div>
        )}
      </div>
    </div>
  );
}
