import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { Button } from "@/components/Elements";
import { Form, InputField } from "@/components/Form";
import "../routes/auth.css";
import { AnimatePresence, motion } from "framer-motion";
import { animations } from "./Layout";
import useAnimateFn from "@/hooks/animate";
import { useState } from "react";
import { useNotificationStore } from "@/stores/notifications";

const schema = z.object({
  new_password: z.string().min(1, "Please enter new password"),
  confirm_password: z.string().min(1, "Please enter confirm password"),
});

type ForgetValues = {
  new_password: string;
  confirm_password: string;
};

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  const { animate, callAfterAnimateFn } = useAnimateFn();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: ForgetValues) => {
    try {
      setLoading(true);
      values;
      // await forgetPassword(values);
      addNotification({
        type: "success",
        title: "Success",
        message: "Reset password link has been to sent to your email address!",
      });
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {animate && (
        <motion.div {...animations}>
          <div className="card p-4 mt-4 mx-4">
            <h5>Reset Password</h5>
            <h6 className="mb-4 font-light">Please enter your new password</h6>
            <Form<ForgetValues, typeof schema>
              onSubmit={handleSubmit}
              schema={schema}
            >
              {({ register, formState }) => (
                <>
                  <InputField
                    type="password"
                    label="New Password"
                    error={formState.errors["new_password"]}
                    registration={register("new_password")}
                  />
                  <InputField
                    type="password"
                    label="Confirm Password"
                    error={formState.errors["confirm_password"]}
                    registration={register("confirm_password")}
                  />
                  <div className="d-flex justify-content-center">
                    <Button
                      startIcon={<i className="fa-solid fa-lock" />}
                      isLoading={loading}
                      type="submit"
                      className="w-100 mt-2"
                    >
                      Submit
                    </Button>
                  </div>
                </>
              )}
            </Form>
          </div>
          <p className="text-center mt-2">
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
