import { lazyImport } from "@/lib/lazyImport";

const { Dashboard } = lazyImport(() => import("./Dashboard"), "Dashboard");
const { Users } = lazyImport(() => import("./Users"), "Users");
const { ContentList } = lazyImport(() => import("./ContentList"), "ContentList");
const { ContentAdd } = lazyImport(() => import("./ContentAdd"), "ContentAdd");
const { ContentEdit } = lazyImport(() => import("./ContentEdit"), "ContentEdit");
const { ContentView } = lazyImport(() => import("./ContentView"), "ContentView");
const { ProfileView } = lazyImport(() => import("./ProfileView"), "ProfileView");
const { ProfileEdit } = lazyImport(() => import("./ProfileEdit"), "ProfileEdit");

export const AdminRoutes = [
  {
    path: "",
    element: <Dashboard />,
  },
  {
    path: "users",
    element: <Users />,
  },
  {
    path: "content",
    element: <ContentList />,
  },
  {
    path: "content/add",
    element: <ContentAdd />,
  },
  {
    path: "content/edit/:id",
    element: <ContentEdit />,
  },
  {
    path: "content/view/:id",
    element: <ContentView />,
  },
  {
    path: "profile",
    element: <ProfileView />,
  },
  {
    path: "profile/edit",
    element: <ProfileEdit />,
  },
  {
    path: "*",
    element: <p>Not found</p>,
  },
];
