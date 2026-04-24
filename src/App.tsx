import { Link, NavLink, Route, Routes, useLocation, useParams } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import { lessons } from "./lessons";
import Landing from "./pages/Landing";
import { DemoView } from "./ui/demo-view";
import { ExerciseView } from "./ui/exercise-view";
import { Logo } from "./ui/logo";
import { ThemeToggle } from "./ui/theme-toggle";

export default function App() {
  return (
    <>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/lesson/:slug/*" element={<LessonLayout />} />
        <Route path="*" element={<p>Not found.</p>} />
      </Routes>
    </>
  );
}

function LessonLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className={`app ${sidebarOpen ? "sidebar-visible" : ""}`}>
      <button
        type="button"
        className="sidebar-burger"
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        aria-expanded={sidebarOpen}
        aria-controls="lesson-sidebar"
      >
        {sidebarOpen ? <CloseIcon /> : <BurgerIcon />}
      </button>
      <div
        className="sidebar-backdrop"
        onClick={() => setSidebarOpen(false)}
        aria-hidden
      />
      <aside
        id="lesson-sidebar"
        className="sidebar"
        aria-label="Lesson navigation"
      >
        <Link to="/" className="sidebar-brand">
          <Logo size={24} />
          <span className="sidebar-wordmark">
            <span className="wm-vue">vue</span>
            <span className="wm-two">2</span>
            <span className="wm-react">react</span>
          </span>
        </Link>
        <ol>
          {lessons.map((l) => (
            <li key={l.slug}>
              <NavLink
                to={`/lesson/${l.slug}`}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {l.title}
              </NavLink>
            </li>
          ))}
        </ol>
      </aside>
      <main className="main">
        <LessonRoute />
      </main>
    </div>
  );
}

function BurgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LessonRoute() {
  const { slug } = useParams<{ slug: string }>();
  return <LessonView key={slug} slug={slug ?? ""} />;
}

type Tab = "read" | "demo" | "exercise";

function LessonView({ slug }: { slug: string }) {
  const lesson = lessons.find((l) => l.slug === slug);
  const [tab, setTab] = useState<Tab>("read");

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!lesson) return <p>Lesson not found.</p>;

  const { Demo, Instructions, Readme } = lesson;

  return (
    <div>
      <div className="lesson-header">
        <h1>{lesson.title}</h1>
        <div className="sub">{lesson.subtitle}</div>
      </div>
      <div className="tabs">
        <button className={tab === "read" ? "active" : ""} onClick={() => setTab("read")}>
          <span className="tab-index">1</span> Documentation
        </button>
        <button className={tab === "demo" ? "active" : ""} onClick={() => setTab("demo")}>
          <span className="tab-index">2</span> Demo
        </button>
        <button className={tab === "exercise" ? "active" : ""} onClick={() => setTab("exercise")}>
          <span className="tab-index">3</span> Exercise
        </button>
      </div>

      {tab === "read" && <Readme />}
      {tab === "demo" && (
        <DemoView Demo={Demo} reactSource={lesson.demoSource} vueSource={lesson.vueSource} />
      )}
      {tab === "exercise" && (
        <ExerciseView
          instructions={<Instructions />}
          starter={lesson.exerciseStarter}
          solution={lesson.exerciseSolution}
          appWrapper={lesson.exerciseAppWrapper}
          dependencies={lesson.exerciseDependencies}
        />
      )}
    </div>
  );
}
