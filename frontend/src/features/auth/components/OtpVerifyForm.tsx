import "../routes/auth.css";
import { AnimatePresence, motion } from "framer-motion";
import { animations } from "./Layout";
import useAnimateFn from "@/hooks/animate";
import { useState } from "react";
import OtpInput from "react-otp-input";
import { Button, Link } from "@/components/Elements";

export const OtpVerifyForm = () => {
  const { animate } = useAnimateFn();
  const [otp, setOtp] = useState("");

  return (
    <AnimatePresence>
      {animate && (
        <motion.div {...animations}>
          <div className="login-form otp">
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
              <Button type="submit" className="w-100 mt-2">
                Submit
              </Button>
            </div>
            <p className="text-center gray mt-3">
              Don’t received code? {""}
              <Link to="#" className="forget-link">
                Resend Code
              </Link>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
