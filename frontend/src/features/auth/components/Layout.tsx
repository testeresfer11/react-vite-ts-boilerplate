import * as React from "react";
import logo from "@/assets/logo.svg";
import { Head } from "@/components/Head";
import { Link } from "react-router-dom";
import loginimg from "@/assets/login.png"
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
      <div className="auth-layout bgdark h-100vh">
        <div className="d-flex flex-column align-content-center justify-content-center">
          <div className="row w-100 mx-auto">
            <div className="col-12 col-md-6">
              <div className="left-side-login h-100 d-flex flex-column w-100 align-items-center justify-content-center">
                <div className="mx-auto mb-5">
                  <Link to="/auth/login">
                    <img height="100" className="mx-auto" src={logo} alt="Workflow" />
                  </Link>
                </div>
                <div className="w-100 layout-child px-5">{children}</div>
              </div>
            </div>
            <div className="col-12 col-md-6 p-0">
              <div className="right-layout">
                <img src={loginimg} className="login-img object-cover h-100vh w-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
