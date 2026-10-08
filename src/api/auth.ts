import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import TokenService, { TokenDetails } from "@/shared/service/service-token";
import { useAuthStore } from "@/shared/stores/auth.store";
import { queryClient } from "@/shared/provider/Provider";
import {
  errorNotification,
  successNotification,
} from "@/shared/utils/notification";

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

export type AuthStatus =
  | "SUCCESS"
  | "PASSWORD_CHANGE_REQUIRED"
  | "MFA_SETUP_REQUIRED"
  | "MFA_REQUIRED";

export interface AuthResponse {
  status: AuthStatus;
  accessToken?: string;
  refreshToken?: string;
  passwordChangeToken?: string;
  mfaToken?: string;
  mfaQrCodeUri?: string;
  mfaManualKey?: string;
  expiresIn?: number;
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
      successNotification(response.data.message || "OTP sent successful!");
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string; error: string }>;
      errorNotification(
        err.response?.data?.message ??
          err.response?.data?.error ??
          "Login failed!"
      );
    },
  });
};

// --- Logout ---

// Short timeout so a hanging request can never leave the user stuck on an
// authenticated page — local cleanup runs as soon as it settles.
const LOGOUT_TIMEOUT_MS = 10000;

// Module-level guard: rapid clicks must not fire duplicate logout requests.
let isLoggingOut = false;

/**
 * Full logout flow used by every logout entry point:
 *
 * 1. POST auth/logout (no request body) — ends the session server-side.
 * 2. Clear in-memory auth state (zustand store).
 * 3. Clear persisted credentials (tokens).
 * 4. Clear the React Query cache so no protected data stays cached.
 * 5. Navigate to Login with `replace` so protected routes are unreachable.
 *
 * The API call is attempted first, but a network/server failure must never
 * leave the user looking authenticated — local cleanup always runs.
 */
export const performLogout = async (): Promise<void> => {
  if (isLoggingOut) return;
  isLoggingOut = true;

  try {
    await LawFirmCRMClient.post(api.logout, undefined, {
      timeout: LOGOUT_TIMEOUT_MS,
    });
  } catch {
    // Intentionally ignored: local state is still cleared below so the UI
    // never stays authenticated when the logout request fails.
  }

  useAuthStore.getState().clearUser();
  TokenService.clearToken();
  queryClient.clear();
  window.location.replace("/auth/login");
};

export interface ForgotPasswordRequest {
  lawFirmCode: string;
  username: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      LawFirmCRMClient.post(api.forgotPassword, { data }),
    onSuccess: (response) => {
      successNotification(
        response.data.message ||
          "If the account details are valid, a password reset link/token has been sent to the registered email address."
      );
    },
    onError: (error) => {
      const err = error as AxiosError<{ message?: string; error?: string }>;
      errorNotification(
        err.response?.data?.message ??
          err.response?.data?.error ??
          "Failed to request password reset. Please try again."
      );
    },
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) =>
      LawFirmCRMClient.post(api.resetPassword, { data }),
    onSuccess: (response) => {
      successNotification(
        response.data.message || "Password reset successful!"
      );
    },
    onError: (error) => {
      const err = error as AxiosError<{ message?: string; error?: string }>;
      errorNotification(
        err.response?.data?.message ??
          err.response?.data?.error ??
          "Failed to reset password. Please check your token and try again."
      );
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (data: any) =>
      LawFirmCRMClient.post(api.changePassword, { data }),
    onSuccess: (response) => {
      successNotification(
        response.data.message || "Password changed successfully"
      );
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string; error: string }>;
      errorNotification(
        err.response?.data?.message ??
          err.response?.data?.error ??
          "Failed to change password"
      );
    },
  });
};

export const useConfirmMfaSetupMutation = () => {
  return useMutation({
    mutationFn: (data: any) =>
      LawFirmCRMClient.post(api.mfaSetupConfirm, { data }),
    onSuccess: (response) => {
      successNotification(response.data.message || "MFA setup successful");
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string; error: string }>;
      errorNotification(
        err.response?.data?.message ??
          err.response?.data?.error ??
          "Invalid code"
      );
    },
  });
};

export const useValidateMfaMutation = () => {
  return useMutation({
    mutationFn: (data: any) => LawFirmCRMClient.post(api.mfaValidate, { data }),
    onSuccess: (response) => {
      successNotification(response.data.message || "Logged In Succesfully");
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string; error: string }>;
      errorNotification(
        err.response?.data?.message ??
          err.response?.data?.error ??
          "Invalid code"
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
      successNotification("Account created successfully");
    },
    onError: (error) => {
      const err = error as AxiosError<{ message?: string; error?: string }>;
      errorNotification(
        err.response?.data?.message ??
          err.response?.data?.error ??
          "Signup failed!"
      );
    },
  });
};
export const initRefreshToken = async () => {
  try {
    const refreshToken = TokenService.getToken()?.refresh_token;
    if (!refreshToken) {
      return false;
    }

    const response = await LawFirmCRMClient.get<TokenDetails>(
      api.refreshToken,
      {
        params: {
          refreshToken,
        },
      }
    );
    const tokens = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token || refreshToken,
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
