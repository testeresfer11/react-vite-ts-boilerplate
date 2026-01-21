import { axios } from "@/lib/axios";

// Types
export interface Content {
    _id: string;
    name: string;
    description: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface ContentListResponse {
    success: boolean;
    message: string;
    data: Content[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ContentResponse {
    success: boolean;
    message: string;
    data: Content;
}

export interface ContentPayload {
    name: string;
    description: string;
    content: string;
}

export interface ContentQueryParams {
    page?: number;
    limit?: number;
    search?: string;
}

// API functions
export const getContents = (params?: ContentQueryParams): Promise<ContentListResponse> => {
    return axios.get("/admin/content", { params });
};

export const getContentById = (id: string): Promise<ContentResponse> => {
    return axios.get(`/admin/content/${id}`);
};

export const createContent = (data: ContentPayload): Promise<ContentResponse> => {
    return axios.post("/admin/content", data);
};

export const updateContent = ({ id, data }: { id: string; data: ContentPayload }): Promise<ContentResponse> => {
    return axios.post(`/admin/content/edit/${id}`, data);
};

export const deleteContent = (id: string): Promise<{ success: boolean; message: string }> => {
    return axios.delete("/admin/content", { params: { id } });
};
