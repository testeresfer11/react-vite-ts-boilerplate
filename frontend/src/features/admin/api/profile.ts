import { axios } from "@/lib/axios";

// Types
export interface Profile {
    _id: string;
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    image?: string;
    address?: string;
    role: string;
    status?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProfileResponse {
    success: boolean;
    message: string;
    data: Profile;
}

export interface UpdateProfilePayload {
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    image?: string;
    address?: string;
}

export interface ChangePasswordPayload {
    oldPassword: string;
    newPassword: string;
}

export interface ChangePasswordResponse {
    success: boolean;
    message: string;
}

// API functions
export const getProfile = (): Promise<ProfileResponse> => {
    return axios.get("/auth/me");
};

export const updateProfile = (data: UpdateProfilePayload): Promise<ProfileResponse> => {
    return axios.post("/users/edit", data);
};

export const changePassword = (data: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
    return axios.post("/users/password", data);
};
