import { axios } from "@/lib/axios"

export const resetPassword = (token:any,data:any) => {
    return axios.post(`/auth/reset-password/${token}`, data)
}