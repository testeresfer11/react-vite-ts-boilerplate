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
          <div className="login-form">
            <h2 className="f-32 text-white semi-bold">Reset Password</h2>
            <p className="gray pb-4">Please enter your new password</p>
            <Form<ForgetValues, typeof schema>
              onSubmit={handleSubmit}
              schema={schema}
            >
              {({ register, formState }) => (
                <>
                  <div className="input-fild">
                    <label className="img-label d-flex gap-2 align-items-center">
                      <svg
                        width="8"
                        height="12"
                        viewBox="0 0 8 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 8.69733C3.73478 8.69733 3.48043 8.59197 3.29289 8.40443C3.10536 8.2169 3 7.96254 3 7.69733C3 7.14233 3.445 6.69733 4 6.69733C4.26522 6.69733 4.51957 6.80268 4.70711 6.99022C4.89464 7.17776 5 7.43211 5 7.69733C5 7.96254 4.89464 8.2169 4.70711 8.40443C4.51957 8.59197 4.26522 8.69733 4 8.69733ZM7 10.1973V5.19733H1V10.1973H7ZM7 4.19733C7.26522 4.19733 7.51957 4.30268 7.70711 4.49022C7.89464 4.67776 8 4.93211 8 5.19733V10.1973C8 10.4625 7.89464 10.7169 7.70711 10.9044C7.51957 11.092 7.26522 11.1973 7 11.1973H1C0.734784 11.1973 0.48043 11.092 0.292893 10.9044C0.105357 10.7169 0 10.4625 0 10.1973V5.19733C0 4.64233 0.445 4.19733 1 4.19733H1.5V3.19733C1.5 2.53429 1.76339 1.8984 2.23223 1.42956C2.70107 0.960719 3.33696 0.697327 4 0.697327C4.3283 0.697327 4.65339 0.761991 4.95671 0.887628C5.26002 1.01326 5.53562 1.19741 5.76777 1.42956C5.99991 1.66171 6.18406 1.9373 6.3097 2.24062C6.43534 2.54393 6.5 2.86902 6.5 3.19733V4.19733H7ZM4 1.69733C3.60218 1.69733 3.22064 1.85536 2.93934 2.13667C2.65804 2.41797 2.5 2.7995 2.5 3.19733V4.19733H5.5V3.19733C5.5 2.7995 5.34196 2.41797 5.06066 2.13667C4.77936 1.85536 4.39782 1.69733 4 1.69733Z"
                          fill="white"
                        />
                      </svg>
                      New Password
                    </label>
                    <InputField
                      type="password"
                      label="New Password"
                      error={formState.errors["new_password"]}
                      registration={register("new_password")}
                    />
                  </div>
                  <div className="input-fild">
                    <label className="img-label d-flex gap-2 align-items-center">
                      <svg
                        width="8"
                        height="12"
                        viewBox="0 0 8 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 8.69733C3.73478 8.69733 3.48043 8.59197 3.29289 8.40443C3.10536 8.2169 3 7.96254 3 7.69733C3 7.14233 3.445 6.69733 4 6.69733C4.26522 6.69733 4.51957 6.80268 4.70711 6.99022C4.89464 7.17776 5 7.43211 5 7.69733C5 7.96254 4.89464 8.2169 4.70711 8.40443C4.51957 8.59197 4.26522 8.69733 4 8.69733ZM7 10.1973V5.19733H1V10.1973H7ZM7 4.19733C7.26522 4.19733 7.51957 4.30268 7.70711 4.49022C7.89464 4.67776 8 4.93211 8 5.19733V10.1973C8 10.4625 7.89464 10.7169 7.70711 10.9044C7.51957 11.092 7.26522 11.1973 7 11.1973H1C0.734784 11.1973 0.48043 11.092 0.292893 10.9044C0.105357 10.7169 0 10.4625 0 10.1973V5.19733C0 4.64233 0.445 4.19733 1 4.19733H1.5V3.19733C1.5 2.53429 1.76339 1.8984 2.23223 1.42956C2.70107 0.960719 3.33696 0.697327 4 0.697327C4.3283 0.697327 4.65339 0.761991 4.95671 0.887628C5.26002 1.01326 5.53562 1.19741 5.76777 1.42956C5.99991 1.66171 6.18406 1.9373 6.3097 2.24062C6.43534 2.54393 6.5 2.86902 6.5 3.19733V4.19733H7ZM4 1.69733C3.60218 1.69733 3.22064 1.85536 2.93934 2.13667C2.65804 2.41797 2.5 2.7995 2.5 3.19733V4.19733H5.5V3.19733C5.5 2.7995 5.34196 2.41797 5.06066 2.13667C4.77936 1.85536 4.39782 1.69733 4 1.69733Z"
                          fill="white"
                        />
                      </svg>
                      Confirm Password
                    </label>
                    <InputField
                      type="password"
                      label="Confirm Password"
                      error={formState.errors["confirm_password"]}
                      registration={register("confirm_password")}
                    />
                  </div>
                  <div className="d-flex justify-content-center">
                    <Button
                   
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
