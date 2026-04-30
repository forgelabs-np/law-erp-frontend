import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import TokenService, { TokenDetails } from "@/shared/service/service-token";
import { toastFail, toastSuccess } from "@/shared/toast";

export interface LoginDetails {
  username: string;
  password: string;
}
export interface SignupDetails {
  fullName: string;
  email: string;
  mobileNo: string;
  username: string;
  password: string;
  barCouncilNumber: string;
  address: string;
  panNumber: string;
}

// --- API endpoints (add to your existing api object) ---
// api.superAdminLogin = "/api/v1/super-admin/login"
// api.superAdminRegister = "/api/v1/super-admin/register"
// api.loginClient = "/api/v1/auth/client/login"
// api.registerClient = "/api/v1/auth/register/client"
// api.registerSolo = "/api/v1/auth/register/solo"
// api.login (existing) = "/api/v1/auth/login"  ← solo login

export type LoginType = "solo" | "client" | "super-admin";
export type RegisterType = "solo" | "client" | "super-admin";

// Map loginType → endpoint
const loginEndpointMap: Record<LoginType, string> = {
  solo: api.login, // /api/v1/auth/login
  client: api.loginClient, // /api/v1/auth/client/login
  "super-admin": api.superAdminLogin, // /api/v1/super-admin/login
};

const registerEndpointMap: Record<RegisterType, string> = {
  solo: api.signup, // /api/v1/auth/register/solo
  client: api.registerClient, // /api/v1/auth/register/client
  "super-admin": api.superAdminLogin, // /api/v1/super-admin/register
};

const initLogin = (data: LoginDetails, type: LoginType) => {
  return LawFirmCRMClient.post(loginEndpointMap[type], { data });
};

export const useLoginMutation = (type: LoginType) => {
  return useMutation({
    mutationFn: (data: LoginDetails) => initLogin(data, type),
    onSuccess: (response) => {
      if (response?.data?.data?.accessToken) {
        const tokens = {
          access_token: response.data.data.accessToken,
          refresh_token: response.data.data.refreshToken,
        };
        TokenService.setToken(tokens);
        localStorage.setItem(
          "lastLoginRole",
          TokenService.getTokenDetails()?.workspace ?? ""
        );
      } else {
        toastSuccess("OTP sent to your device");
      }
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string; error: string }>;
      toastFail(
        err.response?.data?.message ??
          err.response?.data?.error ??
          "Login failed!"
      );
    },
  });
};

// --- Signup ---
const initSignup = (data: SignupDetails, type: RegisterType) => {
  return LawFirmCRMClient.post(registerEndpointMap[type], { data });
};

export const useSignupMutation = (type: RegisterType) => {
  return useMutation({
    mutationFn: (data: SignupDetails) => initSignup(data, type),
    onSuccess: () => {
      toastSuccess("Account created successfully");
    },
    onError: (error) => {
      const err = error as AxiosError<{ message?: string; error?: string }>;
      toastFail(
        err.response?.data?.message ??
          err.response?.data?.error ??
          "Signup failed!"
      );
    },
  });
};
export const initRefreshToken = async () => {
  try {
    const response = await LawFirmCRMClient.get<TokenDetails>(
      api.refreshToken,
      {
        params: {
          refreshToken: TokenService.getToken()?.refresh_token,
        },
        headers: {
          Authorization: "",
        },
      }
    );
    const tokens = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
    };
    TokenService.setToken(tokens);
    return true;
  } catch (error) {
    return false;
  }
};

export const checkAuthentication = async () => {
  if (TokenService.isAuthenticated()) {
    const tokenInfo = TokenService.getTokenDetails();

    if (tokenInfo && tokenInfo.exp * 1000 < Date.now() + 5 * 60 * 1000) {
      return initRefreshToken();
    }
    return Promise.resolve(true);
  } else if (TokenService.getToken()?.refresh_token) {
    return initRefreshToken();
  }
  return Promise.resolve(null);
};
