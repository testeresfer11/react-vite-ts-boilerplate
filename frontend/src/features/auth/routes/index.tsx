import { Route, Routes } from "react-router-dom";

import { Login } from "./Login";
import { Register } from "./Register";
import { ForgetPassword } from "./ForgetPassword";
import { ResetPassword } from "./ResetPassword";
import { OtpVerify } from "./OtpVerify";
import { VerifyEmail } from "./VerifyEmail";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forget" element={<ForgetPassword />} />
      <Route path="reset" element={<ResetPassword />} />
      <Route path="verify-otp" element={<OtpVerify />} />
      <Route path="verify-email" element={<VerifyEmail />} />
    </Routes>
  );
};
