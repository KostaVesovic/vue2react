import { Link, Route, Routes, useParams } from "react-router-dom";

const POSTS: Record<string, { title: string; body: string }> = {
  "welcome": { title: "Welcome!", body: "This is the first post." },
  "react": { title: "Why React?", body: "Because Vue expert wants to learn React." },
};

function PostsList() {
  return (
    <div>
      <h4>posts</h4>
      <ul>
        {Object.entries(POSTS).map(([slug, post]) => (
          <li key={slug}>
            <Link to={slug}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Post() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? POSTS[slug] : undefined;
  if (!post) return <p>not found</p>;
  return (
    <article>
      <h4>{post.title}</h4>
      <p>{post.body}</p>
    </article>
  );
}

export default function Exercise() {
  return (
    <div>
      <nav style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <Link to="ex">home</Link>
        <Link to="ex/posts">posts</Link>
        {Object.entries(POSTS).map(([slug, post]) => (
          <Link key={slug} to={`ex/posts/${slug}`}>{post.title}</Link>
        ))}
      </nav>

      <Routes>
        <Route path="ex" element={<p>blog home</p>} />
        <Route path="ex/posts" element={<PostsList />} />
        <Route path="ex/posts/:slug" element={<Post />} />
        <Route path="*" element={<p>404 — nothing here, try the home link above.</p>} />
      </Routes>
    </div>
  );
}
