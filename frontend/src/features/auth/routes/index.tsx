import { Route, Routes } from "react-router-dom";

import { Login } from "./Login";
import { Register } from "./Register";
import { ForgetPassword } from "./ForgetPassword";
import { ResetPassword } from "./ResetPassword";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forget" element={<ForgetPassword />} />
      <Route path="reset" element={<ResetPassword />} />
    </Routes>
  );
};
