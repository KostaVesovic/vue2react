import type { ReactNode } from "react";

export function Prose({ children }: { children: ReactNode }) {
  return <div className="prose">{children}</div>;
}

export function C({ children }: { children: ReactNode }) {
  return <code className="inline">{children}</code>;
}

export function Code({ lang, children }: { lang?: string; children: string }) {
  return (
    <pre className={lang ? `code-block lang-${lang}` : "code-block"}>
      <code>{children.replace(/^\n+|\n+$/g, "")}</code>
    </pre>
  );
}

interface CompareItem {
  label?: ReactNode;
  vue: ReactNode;
  react: ReactNode;
  note?: ReactNode;
}

export function Compare({ items, dense = false }: { items: CompareItem[]; dense?: boolean }) {
  return (
    <div className={dense ? "compare compare-dense" : "compare"}>
      <div className="compare-header">
        <div className="compare-label vue">Vue</div>
        <div className="compare-label react">React</div>
      </div>
      {items.map((it, i) => (
        <div className="compare-row" key={i}>
          {it.label && <div className="compare-desc">{it.label}</div>}
          <div className="compare-pair">
            <div className="compare-cell vue">
              {typeof it.vue === "string" ? <code>{it.vue}</code> : it.vue}
            </div>
            <div className="compare-cell react">
              {typeof it.react === "string" ? <code>{it.react}</code> : it.react}
            </div>
          </div>
          {it.note && <div className="compare-note">{it.note}</div>}
        </div>
      ))}
    </div>
  );
}

interface SideBySideProps {
  vue: string;
  react: string;
  vueTitle?: string;
  reactTitle?: string;
  caption?: ReactNode;
}

export function SideBySide({ vue, react, vueTitle = "Vue", reactTitle = "React", caption }: SideBySideProps) {
  return (
    <div className="sbs-wrapper">
      {caption && <div className="sbs-caption">{caption}</div>}
      <div className="sbs">
        <div className="sbs-col vue">
          <div className="sbs-title">{vueTitle}</div>
          <pre><code>{vue.replace(/^\n+|\n+$/g, "")}</code></pre>
        </div>
        <div className="sbs-col react">
          <div className="sbs-title">{reactTitle}</div>
          <pre><code>{react.replace(/^\n+|\n+$/g, "")}</code></pre>
        </div>
      </div>
    </div>
  );
}

type CalloutType = "info" | "warn" | "gotcha" | "success" | "tip";

export function Callout({
  type = "info",
  title,
  children,
}: { type?: CalloutType; title?: ReactNode; children: ReactNode }) {
  const icons: Record<CalloutType, string> = {
    info: "i",
    warn: "!",
    gotcha: "⚠",
    success: "✓",
    tip: "💡",
  };
  return (
    <div className={`callout callout-${type}`}>
      <div className="callout-icon" aria-hidden>{icons[type]}</div>
      <div className="callout-body">
        {title && <div className="callout-title">{title}</div>}
        {children}
      </div>
    </div>
  );
}

export function Practice({ children }: { children: ReactNode }) {
  return (
    <div className="practice">
      <div className="practice-label">Practice</div>
      <div>{children}</div>
    </div>
  );
}

export function KeyGotcha({ children }: { children: ReactNode }) {
  return <Callout type="gotcha" title="Gotcha for Vue devs">{children}</Callout>;
}
