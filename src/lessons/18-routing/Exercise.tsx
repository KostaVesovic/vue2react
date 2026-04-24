import { Link, Route, Routes, useParams } from "react-router-dom";

// EXERCISE — extend this tiny blog router.
// 1. Add a route for /ex/posts that shows a list of posts (provided below).
// 2. Add a dynamic route /ex/posts/:slug that reads the slug with useParams
//    and renders the matching post's body (or "not found" if no match).
// 3. Add a 404 route (path="*") with a friendly message.
//
// All routes here should be nested under /lesson/18-routing/ex/ by this component.

const POSTS: Record<string, { title: string; body: string }> = {
  "welcome": { title: "Welcome!", body: "This is the first post." },
  "react": { title: "Why React?", body: "Because Vue expert wants to learn React." },
};

export default function Exercise() {
  return (
    <div>
      <nav style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <Link to="ex">home</Link>
        {/* TODO: add links to the posts list and each post */}
      </nav>

      <Routes>
        <Route path="ex" element={<p>blog home</p>} />
        {/* TODO 1: /ex/posts */}
        {/* TODO 2: /ex/posts/:slug */}
        {/* TODO 3: * → 404 */}
      </Routes>
    </div>
  );
}

// unused imports kept as hints
void useParams;
void POSTS;
