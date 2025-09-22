import { LoginLayout } from "../components/Layout";
import { OtpVerifyForm } from "../components/OtpVerifyForm";

export const OtpVerify = () => {
  return (
    <LoginLayout title="Otp Verify">
      <OtpVerifyForm />
    </LoginLayout>
  );
};
