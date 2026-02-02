import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createContent } from "../api/content";
import { MutationConfig } from "@/lib/react-query";
import { contentKeys } from "./keys";

type CreateContentMutationFnType = typeof createContent;

export const useCreateContent = (
    config?: MutationConfig<CreateContentMutationFnType>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createContent,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: contentKeys.lists() });
            toast.success(data.message || "Content created successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to create content");
        },
        ...config,
    });
};
