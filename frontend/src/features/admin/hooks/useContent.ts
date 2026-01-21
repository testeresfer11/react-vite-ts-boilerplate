import { useQuery } from "@tanstack/react-query";
import { getContentById } from "../api/content";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { contentKeys } from "./keys";

type GetContentByIdQueryFnType = typeof getContentById;

export const useContent = (
    id: string,
    config?: QueryConfig<GetContentByIdQueryFnType>
) => {
    return useQuery<ExtractFnReturnType<GetContentByIdQueryFnType>>({
        queryKey: contentKeys.detail(id),
        queryFn: () => getContentById(id),
        enabled: !!id,
        ...config,
    });
};
