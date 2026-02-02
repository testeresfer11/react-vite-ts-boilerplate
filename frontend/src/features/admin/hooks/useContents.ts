import { useQuery } from "@tanstack/react-query";
import { getContents, ContentQueryParams } from "../api/content";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { contentKeys } from "./keys";

type GetContentsQueryFnType = typeof getContents;

export const useContents = (
    params?: ContentQueryParams,
    config?: QueryConfig<GetContentsQueryFnType>
) => {
    return useQuery<ExtractFnReturnType<GetContentsQueryFnType>>({
        queryKey: contentKeys.list(params || {}),
        queryFn: () => getContents(params),
        ...config,
    });
};
