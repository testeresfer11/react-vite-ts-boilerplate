import "../routes/auth.css";
import { AnimatePresence, motion } from "framer-motion";
import { animations } from "./Layout";
import useAnimateFn from "@/hooks/animate";
import { useState } from "react";
import OtpInput from "react-otp-input";
import { Button, Link } from "@/components/Elements";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyOtp } from "../api/verify";
import toast from "react-hot-toast";

export const OtpVerifyForm = () => {
  const { animate } = useAnimateFn();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('resetToken')
  // const emailToken = searchParams.get('emailToken')


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response: any = await verifyOtp(resetToken, otp);
      console.log(response, 'response');
      if (response?.success) {
        navigate(`/auth/reset?token=${resetToken}`)
        toast.success(response?.message)
      }
      else {
        toast.error(response?.message)
      }
      // TODO: Navigate to reset password page or handle success
    } catch (error) {
      console.error('OTP verification failed:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {animate && (
        <motion.div {...animations}>
          <form onSubmit={handleSubmit} className="login-form otp">
            <h2 className="f-32 text-white semi-bold">Welcome back</h2>
            <p className="gray pb-2">Welcome back please enter your details</p>

            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span>-</span>}
              renderInput={(props) => <input {...props} />}
            />
            <div className="d-flex justify-content-center mt-4">
              <Button type="submit" className="w-100 mt-2" isLoading={loading} disabled={loading || otp.length !== 6}>
                Submit
              </Button>
            </div>
            <p className="text-center gray mt-3">
              Don’t received code? {""}
              <Link to="#" className="forget-link">
                Resend Code
              </Link>
            </p>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
