import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiResponse } from "@/shared/types/response";
import { toastSuccess, toastFail } from "@/shared/toast";

// ============================================================
// Types
// ============================================================

export interface FirmBrandTheme {
  id: string;
  lawFirmCode: string;
  name: string;
  brandPrimaryHex: string;
  brandSecondaryHex: string;
  isPersonalColor: boolean;
}

export interface UpdateBrandThemeRequest {
  brandPrimaryHex?: string;
  brandSecondaryHex?: string;
}

export interface FirmLogoSettings {
  logoUrl: string | null;
  logoAllowed: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ============================================================
// Change Password
// ============================================================

const changePassword = (data: ChangePasswordRequest) => {
  return LawFirmCRMClient.post(api.changePasswordMe, { data });
};

export const useChangePasswordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toastSuccess("Password changed successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to change password";
      toastFail(message);
    },
  });
};

// ============================================================
// Firm Brand Theme
// ============================================================

const getFirmBrandTheme = () => {
  return LawFirmCRMClient.get<ApiResponse<FirmBrandTheme>>(api.FIRM_BRANDING.GET_THEME);
};

export const useFirmBrandThemeQuery = () => {
  return useQuery({
    queryKey: ["firm-brand-theme"],
    queryFn: getFirmBrandTheme,
    select: (response) => response?.data?.data,
  });
};

const updateFirmBrandTheme = (data: UpdateBrandThemeRequest) => {
  return LawFirmCRMClient.put(api.FIRM_BRANDING.UPDATE_THEME, { data });
};

export const useUpdateFirmBrandThemeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFirmBrandTheme,
    onSuccess: () => {
      toastSuccess("Branding saved successfully");
      // Invalidate /me query to refresh theme
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      queryClient.invalidateQueries({ queryKey: ["firm-brand-theme"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to save branding";
      toastFail(message);
    },
  });
};

// ============================================================
// Firm Logo
// ============================================================

const getFirmLogoSettings = () => {
  return LawFirmCRMClient.get<ApiResponse<FirmLogoSettings>>(api.FIRM_BRANDING.GET_LOGO);
};

export const useFirmLogoSettingsQuery = () => {
  return useQuery({
    queryKey: ["firm-logo-settings"],
    queryFn: getFirmLogoSettings,
    select: (response) => response?.data?.data,
  });
};

const updateLogoAllowed = (logoAllowed: boolean) => {
  return LawFirmCRMClient.patch(api.FIRM_BRANDING.UPDATE_LOGO_ALLOWED, {
    data: { logoAllowed },
  });
};

export const useUpdateLogoAllowedMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLogoAllowed,
    onSuccess: () => {
      toastSuccess("Logo permission updated successfully");
      queryClient.invalidateQueries({ queryKey: ["firm-logo-settings"] });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update logo permission";
      toastFail(message);
    },
  });
};

const uploadLogo = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return LawFirmCRMClient.post<ApiResponse<FirmLogoSettings>>(
    api.FIRM_BRANDING.UPLOAD_LOGO,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const useUploadLogoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadLogo,
    onSuccess: () => {
      toastSuccess("Logo uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["firm-logo-settings"] });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to upload logo";
      toastFail(message);
    },
  });
};
