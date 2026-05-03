import axios from "axios";

const THREE_MINUTES = 3 * 60 * 1000;
export const baseURL = import.meta.env.VITE_APP_BACKEND_API;

const LawFirmCRMClient = axios.create({
  baseURL,
  timeout: THREE_MINUTES,
});

LawFirmCRMClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export { LawFirmCRMClient };
