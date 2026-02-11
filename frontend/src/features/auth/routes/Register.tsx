import { RegisterForm } from "../components/RegisterForm";
import { LoginLayout } from "../components/Layout";

export const Register = () => {
  return (
    <LoginLayout title="Register">
      <RegisterForm />
    </LoginLayout>
  );
};
