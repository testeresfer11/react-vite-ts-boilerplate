import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { Button } from "@/components/Elements";
import { Form, InputField } from "@/components/Form";
import { useMutation } from "@tanstack/react-query";
import { registerWithEmailAndPassword } from "../api/register";
import toast from "react-hot-toast";
import "../routes/auth.css";
import { AnimatePresence, motion } from "framer-motion";
import { animations } from "./Layout";
import useAnimateFn from "@/hooks/animate";

import { InputPhone } from "@/components/Form/InputPhone";
import { getCountryCallingCode } from "react-phone-number-input";
import type { Country } from "react-phone-number-input";

const schema = z.object({
  name: z.string().min(1, "Please enter name"),
  email: z.string().min(1, "Please enter email address"),
  password: z.string().min(1, "Please enter password"),
  phone: z.string().min(1, "Please enter phone number"),
  countryCode: z.string().min(1, "Please select country code"),
});

type RegisterValues = {
  name: string;
  email: string;
  password: string;
  phone: string;
  countryCode: string;
};

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { animate, callAfterAnimateFn } = useAnimateFn();

  const registerMutation = useMutation({
    mutationFn: registerWithEmailAndPassword,
    onSuccess: (data: any, variables: any) => {
      toast.success(data.message || "OTP sent to your email");
      navigate("/auth/verify-email", { state: { email: variables.email } });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  });

  return (
    <AnimatePresence>
      {animate && (
        <motion.div {...animations}>
          <div className="card p-4 mt-4 mx-4">
            <h5>Register</h5>
            <h6 className="mb-4 font-light">Please enter your detail to sign up</h6>
            <Form<RegisterValues, typeof schema>
              onSubmit={async (values) => {
                registerMutation.mutate(values);
              }}
              schema={schema}
              options={{
                defaultValues: {
                  countryCode: "+91",
                },
              }}
            >
              {({ register, formState, control, setValue }) => (
                <>
                  <InputField
                    type="text"
                    label="Name"
                    blueLabel
                    error={formState.errors["name"]}
                    registration={register("name")}
                  />
                  <InputField
                    type="email"
                    label="Email Address"
                    blueLabel
                    error={formState.errors["email"]}
                    registration={register("email")}
                  />
                  <InputField
                    type="password"
                    label="Password"
                    error={formState.errors["password"]}
                    registration={register("password")}
                  />
                  <InputPhone
                    label="Phone Number"
                    blueLabel
                    error={formState.errors["phone"]}
                    registration={register("phone")}
                    control={control}
                    defaultCountry="IN"
                    onCountryChange={(country) => {
                      if (country) {
                        const code = getCountryCallingCode(country as Country);
                        setValue("countryCode", `+${code}`);
                      }
                    }}
                  />
                  <div className="d-flex justify-content-center">
                    <Button
                      startIcon={<i className="fa-solid fa-lock" />}
                      isLoading={registerMutation.isLoading}
                      type="submit"
                      className="w-100"
                    >
                      Register
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
