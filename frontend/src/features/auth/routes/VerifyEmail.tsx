import { LoginLayout } from "../components/Layout";
import { VerifyEmailForm } from "../components/VerifyEmailForm";

export const VerifyEmail = () => {
    return (
        <LoginLayout title="Verify Your Email">
            <VerifyEmailForm />
        </LoginLayout>
    );
};
