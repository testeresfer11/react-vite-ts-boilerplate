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
            <h5>Forget Password</h5>
            <h6 className="mb-4 font-light">Please enter your email address</h6>
            <Form<ForgetValues, typeof schema>
              onSubmit={handleSubmit}
              schema={schema}
            >
              {({ register, formState }) => (
                <>
                  <InputField
                    type="email"
                    label="Email Address"
                    error={formState.errors["email"]}
                    registration={register("email")}
                  />
                  <div className="d-flex justify-content-center">
                    <Button
                      startIcon={<i className="fa-solid fa-lock" />}
                      isLoading={loading}
                      type="submit"
                      className="w-100"
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
