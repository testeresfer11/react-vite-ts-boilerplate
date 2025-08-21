import * as React from "react";

import logo from "@/assets/logo.png";
import { Head } from "@/components/Head";
import { Link } from "react-router-dom";

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const animations = {
  initial: { opacity: 0, x: -1000 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 300 },
};

export const LoginLayout = ({ children, title }: LayoutProps) => {
  
  return (
    <>
      <Head title={title} />
      <div className="d-flex flex-column mx-auto w-40 align-content-center justify-content-center py-5">
        <div className="mx-auto">
          <Link to="/auth/login">
          <img width="200" src={logo} alt="Workflow" />
          </Link>
        </div>

        <div>{children}</div>
      </div>
    </>
  );
};
