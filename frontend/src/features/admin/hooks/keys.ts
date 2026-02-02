import { ContentQueryParams } from "../api/content";

// Query Keys
export const contentKeys = {
    all: ["contents"] as const,
    lists: () => [...contentKeys.all, "list"] as const,
    list: (params: ContentQueryParams) => [...contentKeys.lists(), params] as const,
    details: () => [...contentKeys.all, "detail"] as const,
    detail: (id: string) => [...contentKeys.details(), id] as const,
};

export const profileKeys = {
    all: ["profile"] as const,
    detail: () => [...profileKeys.all, "detail"] as const,
};
