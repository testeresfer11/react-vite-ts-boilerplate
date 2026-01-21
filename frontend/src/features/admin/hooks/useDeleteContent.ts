import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteContent } from "../api/content";
import { MutationConfig } from "@/lib/react-query";
import { contentKeys } from "./keys";

type DeleteContentMutationFnType = typeof deleteContent;

export const useDeleteContent = (
    config?: MutationConfig<DeleteContentMutationFnType>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteContent,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: contentKeys.lists() });
            toast.success(data.message || "Content deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to delete content");
        },
        ...config,
    });
};
