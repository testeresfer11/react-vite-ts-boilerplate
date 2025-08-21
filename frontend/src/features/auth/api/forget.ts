import { axios } from '@/lib/axios';

export type ForgetPasswordDTO = {
  email: string;
};

export const forgetPassword  = (data: ForgetPasswordDTO) => {
  return axios.post('/auth/forgot-password', data);
};
