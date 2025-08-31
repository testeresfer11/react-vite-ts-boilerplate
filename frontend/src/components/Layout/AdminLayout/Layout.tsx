import React from "react";
import { SidebarComponent } from "@/components/Layout/AdminLayout/Sidebar/SidebarComponent";
import TopBar from "./TopBar/TopBar";
import { Spinner } from "@/components/Elements";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
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
  const [toggled, setToggled] = React.useState(false);
  const [broken, setBroken] = React.useState(false);

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <SidebarComponent
        toggled={toggled}
        setToggled={setToggled}
        setBroken={setBroken}
      />
      <main className="w-100">
        <TopBar toggled={toggled} setToggled={setToggled} broken={broken} />
        <div style={{ height: "90vh", overflow: "auto" }}>
          <AdminLayout />
        </div>
      </main>
    </div>
  );
};

export default Layout;
