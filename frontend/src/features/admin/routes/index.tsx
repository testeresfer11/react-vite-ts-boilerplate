import { lazyImport } from "@/lib/lazyImport";

const { Dashboard } = lazyImport(() => import("./Dashboard"), "Dashboard");
const { Users } = lazyImport(() => import("./Users"), "Users");

export const AdminRoutes = [
  {
    path: "",
    element: <Dashboard />,
  },
  {
    path: "users",
    element: <Users />,
  },
];
