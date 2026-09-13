import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { FirmPayload } from "@/pages/SuperAdmin/FirmManagement/types";
import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiErrorResponse, ApiResponse } from "@/shared/types/response";
import {
  errorNotification,
  successNotification,
} from "@/shared/utils/notification";

export interface FirmResponse {
  id: string;
  lawFirmCode: string;
  name: string;
  firmType: "SOLO" | "CLIENT";
  email: string;
  phone: string;
  address: string;
  jurisdiction: string;
  adminUsername: string;
  adminEmail: string;
  adminMobileNo: string;
  adminFullName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  firmId: string;
  roleId?: string;
  roleName?: string;
  fullName?: string;
  firmName?: string;
  firmCode?: string;
  // New lifecycle fields - currently not returned by backend
  isTrial: boolean | null;
  isSuspended: boolean | null;
}

// ─── GET ALL FIRMS ─────────────────────────────────────────────────────────────

const getFirms = () => {
  return LawFirmCRMClient.get<ApiResponse<FirmResponse[]>>(
    api.FIRM_MANAGEMENT.GET_FIRMS
  );
};

export const useGetFirmsQuery = () => {
  return useQuery({
    queryKey: [api.FIRM_MANAGEMENT.GET_FIRMS],
    queryFn: getFirms,
    select: (response) => response?.data,
  });
};

// ─── GET FIRM BY ID ────────────────────────────────────────────────────────────

const getFirmById = async (id: string) => {
  return LawFirmCRMClient.get(
    api.FIRM_MANAGEMENT.GET_BY_ID.replace("{firmId}", id)
  );
};

export const useFirmByIdQuery = (
  id: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [`firm-${id}`],
    enabled: options?.enabled !== undefined ? options.enabled : !!id,
    queryFn: async () => getFirmById(id),
    select: (response) => {
      // API returns { data: { data: [...] } } where data is an array of firm/admin records
      const items = response?.data?.data;
      // Return the first item for single firm lookup
      return Array.isArray(items) ? items[0] : items;
    },
  });
};

// ─── CREATE / EDIT FIRM ────────────────────────────────────────────────────────

const createEditFirm = (payload: FirmPayload) => {
  return LawFirmCRMClient.post(api.FIRM_MANAGEMENT.POST, {
    data: payload,
  });
};

export const useCreateEditFirmMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEditFirm,
    onSuccess: (response) => {
      successNotification(response?.data?.message || "Firm saved successfully");
      queryClient.invalidateQueries({
        queryKey: [api.FIRM_MANAGEMENT.GET_FIRMS],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ?? "Something went wrong!";
      errorNotification(errorMessage);
    },
  });
};

// ─── TOGGLE FIRM STATUS ────────────────────────────────────────────────────────

const toggleFirm = (id: string) => {
  const url = api.FIRM_MANAGEMENT.TOGGLE.replace("{adminId}", id);
  return LawFirmCRMClient.patch(url);
};

export const useToggleFirmMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleFirm(id),
    onSuccess: (response, id) => {
      successNotification(response?.data?.message || "Status updated");
      queryClient.invalidateQueries({
        queryKey: [api.FIRM_MANAGEMENT.GET_FIRMS],
      });
      queryClient.invalidateQueries({ queryKey: [`firm-${id}`] });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ?? "Something went wrong!";
      errorNotification(errorMessage);
    },
  });
};

// ─── FIRM MODULES & ROLES ──────────────────────────────────────────────────────

const getFirmModules = () => {
  return LawFirmCRMClient.get<ApiResponse<FirmResponse[]>>(
    api.FIRM_MANAGEMENT.GET_FIRMS_MODULES
  );
};

export const useGetFirmModulesQuery = () => {
  return useQuery({
    queryKey: [api.FIRM_MANAGEMENT.GET_FIRMS_MODULES],
    queryFn: getFirmModules,
    select: (response) => response?.data,
  });
};

const getFirmRoles = () => {
  return LawFirmCRMClient.get<ApiResponse<FirmResponse[]>>(
    api.FIRM_MANAGEMENT.GET_FIRM_ROLES
  );
};

export const useGetFirmRolesQuery = () => {
  return useQuery({
    queryKey: [api.FIRM_MANAGEMENT.GET_FIRM_ROLES],
    queryFn: getFirmRoles,
    select: (response) => response?.data,
  });
};

// ─── FIRM LIFECYCLE APIs ───────────────────────────────────────────────────────

// Suspend Firm
const suspendFirm = (firmId: string) => {
  const url = api.FIRM_LIFECYCLE.SUSPEND.replace("{firmId}", firmId);
  return LawFirmCRMClient.put(url);
};

export const useSuspendFirmMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: suspendFirm,
    onSuccess: (response) => {
      successNotification(
        response?.data?.message || "Firm suspended successfully"
      );
      queryClient.invalidateQueries({
        queryKey: [api.FIRM_MANAGEMENT.GET_FIRMS],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ?? "Failed to suspend firm";
      errorNotification(errorMessage);
    },
  });
};

// Activate Firm
const activateFirm = (firmId: string) => {
  const url = api.FIRM_LIFECYCLE.ACTIVATE.replace("{firmId}", firmId);
  return LawFirmCRMClient.put(url);
};

export const useActivateFirmMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activateFirm,
    onSuccess: (response) => {
      successNotification(
        response?.data?.message || "Firm activated successfully"
      );
      queryClient.invalidateQueries({
        queryKey: [api.FIRM_MANAGEMENT.GET_FIRMS],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ?? "Failed to activate firm";
      errorNotification(errorMessage);
    },
  });
};

// Extend Trial
interface ExtendTrialPayload {
  additionalDays: number;
}

const extendTrial = (firmId: string, payload: ExtendTrialPayload) => {
  const url = api.FIRM_LIFECYCLE.EXTEND_TRIAL.replace("{firmId}", firmId);
  return LawFirmCRMClient.put(url, { data: payload });
};

export const useExtendTrialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      firmId,
      additionalDays,
    }: {
      firmId: string;
      additionalDays: number;
    }) => extendTrial(firmId, { additionalDays }),
    onSuccess: (response) => {
      successNotification(
        response?.data?.message || "Trial extended successfully"
      );
      queryClient.invalidateQueries({
        queryKey: [api.FIRM_MANAGEMENT.GET_FIRMS],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ?? "Failed to extend trial";
      errorNotification(errorMessage);
    },
  });
};

// Convert to Permanent
const convertToPermanent = (firmId: string) => {
  const url = api.FIRM_LIFECYCLE.CONVERT_TO_PERMANENT.replace(
    "{firmId}",
    firmId
  );
  return LawFirmCRMClient.put(url);
};

export const useConvertToPermanentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: convertToPermanent,
    onSuccess: (response) => {
      successNotification(
        response?.data?.message || "Firm converted to permanent successfully"
      );
      queryClient.invalidateQueries({
        queryKey: [api.FIRM_MANAGEMENT.GET_FIRMS],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ?? "Failed to convert firm";
      errorNotification(errorMessage);
    },
  });
};
