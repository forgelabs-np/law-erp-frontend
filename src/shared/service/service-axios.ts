import axios from "axios";

const THREE_MINUTES = 3 * 60 * 1000;
export const baseURL = import.meta.env.VITE_APP_BACKEND_API;

const LawFirmCRMClient = axios.create({
  baseURL,
  timeout: THREE_MINUTES,
});

export { LawFirmCRMClient };
