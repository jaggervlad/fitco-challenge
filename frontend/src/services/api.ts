import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { getToken, clearAuthData } from "@/utils/storage.utils";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const isClient = typeof window !== "undefined";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (isClient) {
      const token = getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (!isClient) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    switch (status) {
      case 401:
        clearAuthData();
        if (!window.location.pathname.includes("/auth/login")) {
          toast.error("Sesión expirada. Por favor, inicia sesión nuevamente.");
          setTimeout(() => {
            window.location.href = "/auth/login";
          }, 100);
        }
        break;
      case 403:
        toast.error("No tienes permisos para realizar esta acción");
        break;
      default:
        if (typeof navigator !== "undefined" && !navigator.onLine) {
          toast.error("Sin conexión a internet");
        }
    }

    return Promise.reject(error);
  }
);

export default api;
