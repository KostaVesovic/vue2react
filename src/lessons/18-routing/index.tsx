import type { Lesson } from "../../types";
import { C, Code, Compare, Practice, Prose } from "../../ui/tutorial";
import Demo from "./Demo";
import demoSource from "./Demo.tsx?raw";
import exerciseStarter from "./Exercise.tsx?raw";
import exerciseSolution from "./Solution.tsx?raw";

function Readme() {
  return (
    <Prose>
      <h2>Vue Router → React Router</h2>
      <p>
        Both solve the same problem; the APIs are cousins. We use{" "}
        <strong>React Router v6</strong> (imports from <C>react-router-dom</C>). v7 is the current
        major release — the core API is nearly identical, but imports move to <C>react-router</C>{" "}
        (with <C>react-router/dom</C> for DOM-only bits), and the data-router mode (per-route{" "}
        <C>loader</C>/<C>action</C>) becomes the default.
      </p>

      <h3>Setup</h3>
      <Code lang="tsx">{`// main.tsx
import { BrowserRouter } from 'react-router-dom'
createRoot(root).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

// App.tsx
import { Route, Routes, Link } from 'react-router-dom'
<Link to="/users">users</Link>

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/users" element={<UsersList />} />
  <Route path="/users/:userId" element={<UserDetail />} />
</Routes>`}</Code>

      <h3>Vue Router → React Router cheat sheet</h3>
      <Compare
        items={[
          {
            vue: `createRouter({ routes })`,
            react: <span><C>{"<BrowserRouter>"}</C> + <C>{"<Routes>"}</C> + <C>{"<Route>"}</C></span>,
          },
          {
            vue: `<router-link to="/x">`,
            react: `<Link to="/x">`,
          },
          {
            vue: `<router-view />`,
            react: <span><C>{"<Outlet />"}</C> (for nested routes)</span>,
          },
          {
            vue: `path: '/users/:id'`,
            react: `<Route path="/users/:id">`,
          },
          {
            vue: `route.params.id`,
            react: `const { id } = useParams()`,
          },
          {
            vue: `route.query.q`,
            react: `const [sp] = useSearchParams(); sp.get('q')`,
          },
          {
            vue: `useRoute()`,
            react: `useLocation()`,
          },
          {
            vue: `useRouter(); router.push('/x')`,
            react: `const nav = useNavigate(); nav('/x')`,
          },
          {
            vue: `beforeEnter guards`,
            react: `Wrap the element with a guard component that redirects`,
          },
          {
            vue: `Nested routes + children: [...]`,
            react: `<Route path="/parent" element={<Layout/>}><Route path="..." .../></Route>`,
          },
          {
            vue: `Named routes`,
            react: `Not a concept — use string paths (or constants)`,
          },
          {
            vue: `Dynamic imports in routes`,
            react: `<Route element={<Suspense><LazyPage/></Suspense>} />`,
          },
        ]}
      />

      <h3>Nested routes and <C>{"<Outlet />"}</C></h3>
      <p>
        Vue's <C>{"<router-view />"}</C> and React's <C>{"<Outlet />"}</C> do the same thing:
        they mark the hole where the child route renders.
      </p>
      <Code lang="tsx">{`<Routes>
  <Route path="/dash" element={<DashLayout />}>
    <Route index element={<Overview />} />
    <Route path="settings" element={<Settings />} />
    <Route path="users/:id" element={<User />} />
  </Route>
</Routes>

function DashLayout() {
  return (
    <>
      <Sidebar />
      <main><Outlet /></main>
    </>
  )
}`}</Code>

      <h3>Params, query string, hash</h3>
      <Code lang="tsx">{`const { userId } = useParams<{ userId: string }>()       // /users/:userId
const [params, setParams] = useSearchParams()             // ?q=react
const { pathname, hash } = useLocation()                 // everything`}</Code>

      <h3>Programmatic navigation</h3>
      <Code lang="tsx">{`const nav = useNavigate()
nav('/home')                // like push
nav('/home', { replace: true })
nav(-1)                     // back
nav('/home', { state: { from: 'search' } })   // state like Vue meta`}</Code>

      <h3>Guards</h3>
      <p>React Router has no <C>beforeEnter</C> concept. Write a wrapper:</p>
      <Code lang="tsx">{`function RequireAuth({ children }: { children: ReactNode }) {
  const user = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

<Route path="/secret" element={<RequireAuth><Secret /></RequireAuth>} />`}</Code>

      <h3>Data loaders (v6.4+ / v7)</h3>
      <p>
        The "data router" mode introduces <C>loader</C> and <C>action</C> per route — the same
        pattern as Remix, which merged into React Router as of v7. Useful for serious apps.
        Beyond scope here, but worth knowing exists so you don't re-invent it.
      </p>

      <Practice>Extend a tiny blog router: list, detail with slug, 404.</Practice>
    </Prose>
  );
}

function Instructions() {
  return (
    <>
      <p>Extend this tiny blog router. All routes here should be nested under <C>/lesson/18-routing/ex/</C> by this component.</p>
      <ol>
        <li>Add a route for <C>/ex/posts</C> that shows a list of posts (provided below).</li>
        <li>
          Add a dynamic route <C>/ex/posts/:slug</C> that reads the slug with <C>useParams</C> and
          renders the matching post's body (or "not found" if no match).
        </li>
        <li>Add a 404 route (<C>path="*"</C>) with a friendly message.</li>
      </ol>
    </>
  );
}

const vueSource = `// router.ts
import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/users', component: UsersList },
    { path: '/users/:userId', component: UserDetail, props: true },
    { path: '/search', component: Search },
  ],
})

<!-- App.vue -->
<template>
  <nav>
    <router-link to="/">home</router-link>
    <router-link to="/users">users</router-link>
  </nav>
  <router-view />
</template>

<!-- UserDetail.vue -->
<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const userId = route.params.userId
</script>
<template><p>#{{ userId }}</p></template>
`;

const exerciseAppWrapper = `import { MemoryRouter } from "react-router-dom";
import Exercise from "./Exercise";

export default function App() {
  return (
    <div style={{ padding: 16, fontFamily: "-apple-system, system-ui, sans-serif", color: "#e8eaed", background: "#0f1115", minHeight: "100vh" }}>
      <MemoryRouter initialEntries={["/ex"]}>
        <Exercise />
      </MemoryRouter>
    </div>
  );
}
`;

const lesson: Lesson = {
  slug: "18-routing",
  title: "Routing: React Router",
  subtitle: "vue-router → react-router-dom. <router-view/> → <Outlet/>. Most concepts map 1:1.",
  Readme,
  Demo,
  demoSource,
  vueSource,
  Instructions,
  exerciseStarter,
  exerciseSolution,
  exerciseAppWrapper,
  exerciseDependencies: { "react-router-dom": "6.28.0" },
};

export default lesson;
