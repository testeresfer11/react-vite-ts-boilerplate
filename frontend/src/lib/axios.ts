import Axios, { InternalAxiosRequestConfig } from "axios";
import { API_URL } from "@/lib/config";
import toast from "react-hot-toast";
import storage from "@/lib/storage";

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const token = storage.getToken();
  if (config && config.headers) {
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    config.headers.Accept = "application/json";
  }
  return config;
}

// Axios instance that returns response.data (default behavior)
export const axios = Axios.create({
  baseURL: API_URL,
});

axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error?.response?.status === 401) {
      storage.clearToken();
      // window.location.assign(window.location.origin as unknown as string);
    }

    const message = error.response?.data?.message || error.message;
    toast.error(message);

    return Promise.reject(error);
  }
);

// Axios instance that returns full response object
export const axios2 = Axios.create({
  baseURL: API_URL,
});

axios2.interceptors.request.use(authRequestInterceptor);
axios2.interceptors.response.use(
  (response) => {
    return response; // Returns full response object
  },
  (error) => {
    if (error?.response?.status === 401) {
      storage.clearToken();
      window.location.assign(window.location.origin as unknown as string);
    }

    const message = error.response?.data?.message || error.message;
    toast.error(message);

    return Promise.reject(error);
  }
);
