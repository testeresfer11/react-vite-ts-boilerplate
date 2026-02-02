import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateProfile } from "../api/profile";
import { MutationConfig } from "@/lib/react-query";
import { profileKeys } from "./keys";

type UpdateProfileMutationFnType = typeof updateProfile;

export const useUpdateProfile = (
    config?: MutationConfig<UpdateProfileMutationFnType>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfile,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: profileKeys.detail() });
            // Also invalidate auth user data
            queryClient.invalidateQueries({ queryKey: ["authenticated-user"] });
            toast.success(data.message || "Profile updated successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update profile");
        },
        ...config,
    });
};
