// import axios, { InternalAxiosRequestConfig, AxiosInstance } from "axios";

// export const createHttpClient = ({
//   baseURL,
//   withAuth = true,
//   attachRefresh,
// }: CreateHttpClientOptions) => {
//   const instance = axios.create({ baseURL });

//   instance.interceptors.request.use(
//     (config: InternalAxiosRequestConfig) => {
//       const urn = Date.now();
//       config.headers["X-Channel"] = "WEB";
//       if (urn) config.headers["X-URN"] = urn;
//       if (withAuth) {
//         const token = Cookies.get("accessToken");
//         if (token) {
//           config.headers["Authorization"] = `Bearer ${token}`;
//         }
//       }

//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   if (attachRefresh) {
//     attachRefresh(instance);
//   }

//   return instance;
// };

// type CreateHttpClientOptions = {
//   baseURL: string;
//   withAuth?: boolean;
//   attachRefresh?: (instance: AxiosInstance) => void;
// };
