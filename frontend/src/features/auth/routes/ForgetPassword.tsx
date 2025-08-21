// import { useNavigate } from "react-router-dom";

import { LoginLayout } from "../components/Layout";
import { ForgetPasswordForm } from "../components/ForgetPasswordForm";

export const ForgetPassword = () => {
  // const navigate = useNavigate();

  return (
    <LoginLayout title="Forget Password">
      <ForgetPasswordForm />
    </LoginLayout>
  );
};
