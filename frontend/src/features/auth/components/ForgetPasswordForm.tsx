import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { Button } from "@/components/Elements";
import { Form, InputField } from "@/components/Form";
import "../routes/auth.css";
import { AnimatePresence, motion } from "framer-motion";
import { animations } from "./Layout";
import useAnimateFn from "@/hooks/animate";
import { useState } from "react";
import toast from "react-hot-toast";
import { forgetPassword } from "../api/forget";

const schema = z.object({
  email: z
    .string()
    .min(1, "Please enter email address")
    .email("Please enter a valid email address!"),
});

type ForgetValues = {
  email: string;
};

export const ForgetPasswordForm = () => {
  const navigate = useNavigate();

  const { animate, callAfterAnimateFn } = useAnimateFn();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: ForgetValues) => {
    try {
      setLoading(true);
      values;
      const res = await forgetPassword(values);
      console.log(res, 'res')
      navigate(`/auth/verify-otp?resetToken=${res.data.resetToken}&emailToken=${res.data.emailToken}`)

      toast.success("OTP has been sent to your email address!");
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {animate && (
        <motion.div {...animations}>
          <div className="login-form">
            <h2 className="f-32 text-white semi-bold">Forgot Password</h2>
            <p className="gray pb-4">Please enter your details</p>
            <Form<ForgetValues, typeof schema>
              onSubmit={handleSubmit}
              schema={schema}
            >
              {({ register, formState }) => (
                <>
                  <div className="input-fild">
                    <label className="img-label d-flex gap-2 align-items-center">
                      <svg
                        width="12"
                        height="13"
                        viewBox="0 0 12 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.88184 6.95319C5.53032 7.49234 6.47167 7.49242 7.12012 6.95319L11.9229 2.95709C11.9719 3.13042 12 3.313 12 3.50201V8.89264C12 9.99721 11.1046 10.8926 10 10.8926H2C0.895431 10.8926 0 9.99721 0 8.89264V3.50201C0 3.31267 0.0279836 3.12971 0.0771484 2.95612L4.88184 6.95319ZM10 1.50201C10.3655 1.50201 10.7071 1.60133 11.002 1.77252L6.16016 5.79987C6.06756 5.87647 5.9333 5.8767 5.84082 5.79987L0.998047 1.77252C1.29286 1.60133 1.63454 1.50201 2 1.50201H10Z"
                          fill="white"
                        />
                      </svg>
                      Email Address
                    </label>
                    <InputField
                      type="email"
                      label="Email Address"
                      error={formState.errors["email"]}
                      registration={register("email")}
                    />
                  </div>
                  <div className="d-flex mt-4 justify-content-center">
                    <Button isLoading={loading} type="submit" className="w-100">
                      Submit
                    </Button>
                  </div>
                </>
              )}
            </Form>
          </div>
          <p className="text-center gray mt-3">
            Already have an account?{" "}
            <Link
              to="#"
              onClick={callAfterAnimateFn(() => navigate("/auth/login"))}
              className="forget-link"
            >
              Login
            </Link>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
