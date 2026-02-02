import { axios } from '@/lib/axios';

export type VerifyOtpDTO = {
    otp: string;
};

export const verifyOtp = (token: string | null, otp: string) => {
    return axios.post(`/auth/verify-otp/${token}`, { otp });
};
