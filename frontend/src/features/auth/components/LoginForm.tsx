import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { Button } from "@/components/Elements";
import { Form, InputField } from "@/components/Form";
import { useLogin } from "@/lib/auth";
import "../routes/auth.css";
import { AnimatePresence, motion } from "framer-motion";
import { animations } from "./Layout";
import useAnimateFn from "@/hooks/animate";
import { AuthUser } from "..";
import { Checkbox, FormControlLabel } from "@mui/material";

const schema = z.object({
  email: z.string().min(1, "Please enter email address"),
  password: z.string().min(1, "Please enter password"),
});

type LoginValues = {
  email: string;
  password: string;
};

type LoginFormProps = {
  onSuccess: (user: AuthUser) => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const login = useLogin();
  const navigate = useNavigate();
  const { animate, callAfterAnimateFn } = useAnimateFn();

  return (
    <AnimatePresence>
      {animate && (
        <motion.div {...animations}>
          <div className="login-form">
            <h2 className="f-32 text-white semi-bold">Welcome back</h2>
            <p className="gray pb-2">Welcome back please enter your details</p>
            <Form<LoginValues, typeof schema>
              onSubmit={async (values) => {
                login.mutate(values, { onSuccess });
              }}
              options={{
                defaultValues: {
                  email: "test@yopmail.com",
                  password: "Test@123",
                },
              }}
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
                      label=""
                      error={formState.errors["email"]}
                      registration={register("email")}
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
                      Password
                    </label>
                    <InputField
                      type="password"
                      label="Password"
                      error={formState.errors["password"]}
                      registration={register("password")}
                    />
                  </div>
                  <div className="forgot-pass d-flex align-items-center justify-content-between">
                  <FormControlLabel className="gray f-14" control={<Checkbox />} label="Remember Me" />
                    <Link 
                      to="#"
                      onClick={callAfterAnimateFn(() =>
                        navigate("/auth/forget")
                      )}
                      className="forget-link text-decoration-none"
                    >
                      Forget Password
                    </Link>
                  </div>
                  <div className="d-flex mt-4 justify-content-center">
                    <Button
                      // startIcon={<i className="fa-solid fa-lock" />}
                      isLoading={login.isLoading}
                      type="submit"
                      className="w-100"
                    >
                      Log In
                    </Button>
                  </div>
                </>
              )}
            </Form>
          </div>
          <p className="text-center gray mt-3">
            Don't have an account?{" "}
            <Link
              to="#"
              onClick={callAfterAnimateFn(() => navigate("/auth/register"))}
              className="forget-link"
            >
              Sign Up
            </Link>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
