// import { useNavigate } from "react-router-dom";

import { LoginLayout } from "../components/Layout";
import { ResetPasswordForm } from "../components/ResetPasswordForm";

export const ResetPassword = () => {
  // const navigate = useNavigate();

  return (
    <LoginLayout title="Reset Password">
      <ResetPasswordForm />
    </LoginLayout>
  );
};
