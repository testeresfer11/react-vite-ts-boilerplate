import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateContent } from "../api/content";
import { MutationConfig } from "@/lib/react-query";
import { contentKeys } from "./keys";

type UpdateContentMutationFnType = typeof updateContent;

export const useUpdateContent = (
    config?: MutationConfig<UpdateContentMutationFnType>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateContent,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: contentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: contentKeys.detail(variables.id) });
            toast.success(data.message || "Content updated successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update content");
        },
        ...config,
    });
};
