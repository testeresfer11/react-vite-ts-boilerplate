import React from "react";
import { Spinner } from "@/components/Elements";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import LandingLayout from "@/components/Layout/LandingLayout/Layout";

const UserLayout = () => {
  return (
    <Suspense
      fallback={
        <div className="h-90-vh w-100 d-flex align-items-center justify-content-center">
          <Spinner size="xl" />
        </div>
      }
    >
      <Outlet />
    </Suspense>
  );
};

const Layout = () => {
  return (
    <LandingLayout>
      <UserLayout />
    </LandingLayout>
  );
};

export default Layout;
