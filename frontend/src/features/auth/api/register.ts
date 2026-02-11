import { axios } from '@/lib/axios';
import { RegisterResponse } from '../types';

export type RegisterCredentialsDTO = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  countryCode?: string;
};

export const registerWithEmailAndPassword = (
  data: RegisterCredentialsDTO
): Promise<RegisterResponse> => {
  return axios.post('/auth/register', data);
};
