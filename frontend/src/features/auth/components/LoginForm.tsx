import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { Button } from "@/components/Elements";
import { Form, InputField } from "@/components/Form";
import { useLogin } from "@/lib/auth";
import "../routes/auth.css";
import { AnimatePresence, motion } from "framer-motion";
import { animations } from "./Layout";
import useAnimateFn from "@/hooks/animate";

const schema = z.object({
  email: z.string().min(1, "Please enter email address"),
  password: z.string().min(1, "Please enter password"),
});

type LoginValues = {
  email: string;
  password: string;
};

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const login = useLogin();
  const navigate = useNavigate();
  const { animate, callAfterAnimateFn } = useAnimateFn();

  return (
    <AnimatePresence>
      {animate && (
        <motion.div {...animations}>
          <div className="card p-4 mt-4 mx-4">
            <Form<LoginValues, typeof schema>
              onSubmit={async (values) => {
                values;
                // onSuccess();
                login.mutate(values, { onSuccess });
              }}
              options={{ defaultValues: {
                email: "baba@yopmail.com",
                password: "@3"
              }}}
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
                  <InputField
                    type="password"
                    label="Password"
                    error={formState.errors["password"]}
                    registration={register("password")}
                  />
                  <div className="d-flex justify-content-center">
                    <Button
                      startIcon={<i className="fa-solid fa-lock" />}
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
            <Link
              to="#"
              onClick={callAfterAnimateFn(() => navigate("/auth/forget"))}
              className="forget-link"
            >
              Forget Password
            </Link>
          </div>
          <p className="text-center mt-2">
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
