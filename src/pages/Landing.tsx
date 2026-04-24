import { Link } from "react-router-dom";
import { lessons } from "../lessons";
import { Logo } from "../ui/logo";

export default function Landing() {
  const firstSlug = lessons[0]!.slug;

  return (
    <div className="landing">
      <div className="landing-inner">
        <div className="landing-brand">
          <Logo size={44} />
          <span className="landing-wordmark">
            <span className="wm-vue">vue</span>
            <span className="wm-two">2</span>
            <span className="wm-react">react</span>
          </span>
        </div>

        <h1 className="landing-headline">
          Learn React as a Vue developer.
        </h1>

        <p className="landing-sub">
          A free, interactive React tutorial built for developers coming from Vue 3. Twenty-one
          lessons map the Composition API to React Hooks side-by-side — <code>ref</code> →{" "}
          <code>useState</code>, <code>computed</code> → <code>useMemo</code>,{" "}
          <code>watch</code> → <code>useEffect</code>, <code>provide/inject</code> →{" "}
          <code>Context</code>, <code>Pinia</code> → <code>Zustand</code>,{" "}
          <code>Vue Router</code> → <code>React Router</code>.
        </p>

        <p className="landing-sub">
          Every lesson includes documentation, a live demo with Vue and React source
          side-by-side, and an editable exercise you run in the browser. Covers React 19 —
          Actions, the <code>use</code> hook, and the React Compiler.
        </p>

        <Link to={`/lesson/${firstSlug}`} className="landing-cta">
          Start the course
          <span className="landing-cta-arrow" aria-hidden>→</span>
        </Link>

        <div className="landing-meta">
          <span>{lessons.length} lessons</span>
          <span className="landing-meta-dot">·</span>
          <span>live code editor</span>
          <span className="landing-meta-dot">·</span>
          <span>no signup</span>
        </div>
      </div>
    </div>
  );
}
