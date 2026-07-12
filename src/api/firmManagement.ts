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

export const useFirmByIdQuery = (id: string) => {
  return useQuery({
    queryKey: [`firm-${id}`],
    enabled: !!id,
    queryFn: async () => getFirmById(id),
    select: (data) => data?.data?.data,
  });
};

// ─── CREATE / EDIT FIRM ────────────────────────────────────────────────────────

const createEditFirm = (payload: FirmPayload) => {
  console.log(api.FIRM_MANAGEMENT.POST, "hgjhfgd");
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
