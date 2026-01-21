import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { changePassword } from "../api/profile";
import { MutationConfig } from "@/lib/react-query";

type ChangePasswordMutationFnType = typeof changePassword;

export const useChangePassword = (
    config?: MutationConfig<ChangePasswordMutationFnType>
) => {
    return useMutation({
        mutationFn: changePassword,
        onSuccess: (data) => {
            toast.success(data.message || "Password changed successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to change password");
        },
        ...config,
    });
};
