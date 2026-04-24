import { Link, Outlet, Route, Routes, useNavigate, useParams, useSearchParams } from "react-router-dom";

// NOTE: this demo routes are NESTED inside the tutorial's own BrowserRouter,
// so we mount them under /lesson/18-routing/nested/... via a small Router.
// For the purpose of the demo we use local paths starting with "/nested/".

function NestedLayout() {
  return (
    <div style={{ border: "1px solid #262a35", borderRadius: 8, padding: 12 }}>
      <nav style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <Link to=".">home</Link>
        <Link to="users">users</Link>
        <Link to="users/42">user 42</Link>
        <Link to="search?q=react">search (?q=react)</Link>
      </nav>
      <Outlet />
    </div>
  );
}

function Home() {
  return <p>Welcome to the nested mini-app.</p>;
}

function UsersList() {
  const nav = useNavigate();
  return (
    <div>
      <p>pick a user:</p>
      <ul>
        {[1, 2, 42, 101].map((id) => (
          <li key={id}>
            <Link to={`${id}`}>user {id}</Link>{" "}
            <button onClick={() => nav(`/lesson/18-routing/nested/users/${id}`)}>
              navigate programmatically
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UserDetail() {
  const { userId } = useParams<{ userId: string }>();
  return <p>You're looking at user <b>#{userId}</b></p>;
}

function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  return (
    <div>
      <input
        value={q}
        onChange={(e) => setParams({ q: e.target.value })}
      />
      <p>querying: <code>{q}</code> (reflected in the URL)</p>
    </div>
  );
}

export default function Demo() {
  return (
    <div>
      <p className="sub">
        These routes are mounted under <code>/lesson/18-routing/nested/*</code> —
        watch the URL as you click.
      </p>
      <Routes>
        <Route path="nested" element={<NestedLayout />}>
          <Route index element={<Home />} />
          <Route path="users" element={<UsersList />} />
          <Route path="users/:userId" element={<UserDetail />} />
          <Route path="search" element={<Search />} />
        </Route>
        <Route
          path="*"
          element={
            <p>
              Navigate into the demo: <Link to="nested">enter</Link>
            </p>
          }
        />
      </Routes>
    </div>
  );
}
