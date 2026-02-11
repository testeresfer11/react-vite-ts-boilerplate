import { axios } from '@/lib/axios';
import { UserResponse } from '../types';

export type VerifyEmailDTO = {
    email: string;
    otp: string;
};

export const verifyEmail = (data: VerifyEmailDTO): Promise<UserResponse> => {
    return axios.post('/auth/verify-email', data);
};
