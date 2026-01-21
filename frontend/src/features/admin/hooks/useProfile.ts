import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/profile";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { profileKeys } from "./keys";

type GetProfileQueryFnType = typeof getProfile;

export const useProfile = (
    config?: QueryConfig<GetProfileQueryFnType>
) => {
    return useQuery<ExtractFnReturnType<GetProfileQueryFnType>>({
        queryKey: profileKeys.detail(),
        queryFn: getProfile,
        ...config,
    });
};
