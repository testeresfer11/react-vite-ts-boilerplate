import { Spinner } from "@/components/Elements";
import Layout from "@/components/Layout/Layout";
import { AdminRoutes } from "@/features/admin";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <Layout>
      <Suspense
        fallback={
          <div className="h-90-vh w-100 d-flex align-items-center justify-content-center">
            <Spinner size="xl" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </Layout>
  );
};

export const protectedRoutes = [
  {
    path: "/admin/*",
    element: <AdminLayout />,
    children: AdminRoutes,
  },
];
