import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const THREE_MINUTES = 3 * 60 * 1000;
export const baseURL = import.meta.env.VITE_APP_BACKEND_API;

// Public endpoints that should not include Authorization header
const PUBLIC_ENDPOINTS = [
  "auth/login",
  "auth/register",
  "auth/client/login",
  "auth/register/client",
  "super-admin/login",
  "super-admin/register",
  "auth/mfa/validate",
  "auth/mfa/setup/confirm",
];

const isPublicEndpoint = (url: string): boolean => {
  return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

const LawFirmCRMClient = axios.create({
  baseURL,
  timeout: THREE_MINUTES,
});

// Refresh token lock to prevent multiple simultaneous refresh requests
let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

const subscribeTokenRefresh = (callback: (token: string | null) => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshCompleted = (token: string | null) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Request interceptor - add Authorization header for protected endpoints only
LawFirmCRMClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    // Only add Authorization header if token exists and endpoint is not public
    if (token && !isPublicEndpoint(config.url || "")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 errors and token refresh
LawFirmCRMClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry if this is a public endpoint or refresh endpoint itself
      if (
        isPublicEndpoint(originalRequest.url || "") ||
        originalRequest.url?.includes("auth/refresh")
      ) {
        return Promise.reject(error);
      }

      // If already refreshing, queue the request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((token: string | null) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(LawFirmCRMClient(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      // Start refresh process
      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call refresh endpoint without Authorization header
        const response = await axios.get(`${baseURL}/auth/refresh`, {
          params: { refreshToken },
          headers: { Authorization: "" },
        });

        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token || refreshToken;

        // Store new tokens
        localStorage.setItem("token", newAccessToken);
        localStorage.setItem("refresh_token", newRefreshToken);

        // Update original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Notify all queued requests
        onRefreshCompleted(newAccessToken);

        // Retry original request
        return LawFirmCRMClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and notify subscribers
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        onRefreshCompleted(null);

        // Redirect to login page
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { LawFirmCRMClient };
