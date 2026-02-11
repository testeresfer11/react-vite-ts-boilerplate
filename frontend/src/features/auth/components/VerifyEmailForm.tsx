import "../routes/auth.css";
import { AnimatePresence, motion } from "framer-motion";
import { animations } from "./Layout";
import useAnimateFn from "@/hooks/animate";
import { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { Button } from "@/components/Elements";
import { useLocation } from "react-router-dom";
import { verifyEmail } from "../api/verifyEmail";
import toast from "react-hot-toast";
import storage from "@/lib/storage";

export const VerifyEmailForm = () => {
    const { animate } = useAnimateFn();
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Try to get email from location state (passed from RegisterForm)
        const state = location.state as { email?: string };
        if (state?.email) {
            setEmail(state.email);
        }
    }, [location]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }
        try {
            setLoading(true);
            const response: any = await verifyEmail({ email, otp });

            if (response?.user && response?.tokens) {
                storage.setToken(response.tokens.access.token);
                toast.success("Email verified successfully!");
                // We might want to reload or navigate to home
                window.location.assign("/");
            } else {
                toast.error(response?.message || "Verification failed");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "OTP verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {animate && (
                <motion.div {...animations}>
                    <div className="card p-4 mt-4 mx-4">
                        <h5>Verify Email</h5>
                        <h6 className="mb-4 font-light">Please enter the 6-digit code sent to your email</h6>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4 text-center">
                                <p className="font-light">
                                    Verify OTP for email <br />
                                    <strong className="text-primary">{
                                        email ? email.replace(/^(.{2})(.*)(@.*)$/, (_, a, b, c) => a + b.replace(/./g, '*') + c) : 'your email'
                                    }</strong>
                                </p>
                            </div>

                            <div className="otp-container mb-4">
                                <label className="form-label d-block text-center mb-3">Verification Code</label>
                                <OtpInput
                                    value={otp}
                                    onChange={setOtp}
                                    numInputs={6}
                                    renderSeparator={<span className="mx-1"></span>}
                                    renderInput={(props) => (
                                        <input
                                            {...props}
                                            className="otp-input-field"
                                        />
                                    )}
                                    containerStyle="justify-content-center"
                                />
                            </div>

                            <div className="d-flex justify-content-center">
                                <Button
                                    type="submit"
                                    className="w-100"
                                    isLoading={loading}
                                    disabled={loading || otp.length !== 6 || !email}
                                >
                                    Verify & Login
                                </Button>
                            </div>
                        </form>
                        <p className="text-center mt-3">
                            Didn't receive the code?{" "}
                            <span
                                className="forget-link cursor-pointer"
                                style={{ cursor: 'pointer', color: 'var(--primary)' }}
                                onClick={() => toast.success("Resend logic not implemented yet, but coming soon!")}
                            >
                                Resend
                            </span>
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
