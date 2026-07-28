import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiResponse } from "@/shared/types/response";
import { errorNotification, successNotification } from "@/shared/utils/notification";

export type ConfigValues = Record<string, string>;

export const CONFIG_QUERY_KEYS = {
  GLOBAL: ["super-admin", "config"] as const,
  FIRM: (firmId: string) => ["super-admin", "firm-config", firmId] as const,
};

// ─── API SERVICES ─────────────────────────────────────────────────────────────

export const getGlobalConfig = () => {
  return LawFirmCRMClient.get<ApiResponse<ConfigValues>>(
    api.CONFIG_MANAGEMENT.GET_GLOBAL
  );
};

export const upsertGlobalConfig = (config: ConfigValues) => {
  return LawFirmCRMClient.put<ApiResponse<string>>(
    api.CONFIG_MANAGEMENT.UPSERT_GLOBAL,
    config
  );
};

export const deleteGlobalConfig = (key: string) => {
  const url = api.CONFIG_MANAGEMENT.DELETE_GLOBAL.replace("{key}", encodeURIComponent(key));
  return LawFirmCRMClient.delete<ApiResponse<string>>(url);
};

export const getFirmConfig = (firmId: string) => {
  const url = api.CONFIG_MANAGEMENT.GET_FIRM.replace("{firmId}", firmId);
  return LawFirmCRMClient.get<ApiResponse<ConfigValues>>(url);
};

export const upsertFirmConfig = ({ firmId, config }: { firmId: string; config: ConfigValues }) => {
  const url = api.CONFIG_MANAGEMENT.UPSERT_FIRM.replace("{firmId}", firmId);
  return LawFirmCRMClient.put<ApiResponse<string>>(url, config);
};

// ─── REACT QUERY HOOKS ─────────────────────────────────────────────────────────────

export const useGlobalConfigQuery = () => {
  return useQuery({
    queryKey: CONFIG_QUERY_KEYS.GLOBAL,
    queryFn: async () => {
      const res = await getGlobalConfig();
      return res.data.data;
    },
  });
};

export const useUpsertGlobalConfigMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertGlobalConfig,
    onSuccess: (res) => {
      successNotification(res.data?.message || "Global configuration updated successfully");
      queryClient.invalidateQueries({ queryKey: CONFIG_QUERY_KEYS.GLOBAL });
    },
    onError: (error: any) => {
      errorNotification(error?.response?.data?.message || "Failed to update global configuration");
    },
  });
};

export const useDeleteGlobalConfigMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGlobalConfig,
    onSuccess: (res) => {
      successNotification(res.data?.message || "Global configuration deleted successfully");
      queryClient.invalidateQueries({ queryKey: CONFIG_QUERY_KEYS.GLOBAL });
    },
    onError: (error: any) => {
      errorNotification(error?.response?.data?.message || "Failed to delete global configuration");
    },
  });
};

export const useFirmConfigQuery = (firmId: string) => {
  return useQuery({
    queryKey: CONFIG_QUERY_KEYS.FIRM(firmId),
    queryFn: async () => {
      const res = await getFirmConfig(firmId);
      return res.data.data;
    },
    enabled: Boolean(firmId),
  });
};

export const useUpsertFirmConfigMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertFirmConfig,
    onSuccess: (res, variables) => {
      successNotification(res.data?.message || "Firm configuration updated successfully");
      queryClient.invalidateQueries({ queryKey: CONFIG_QUERY_KEYS.FIRM(variables.firmId) });
    },
    onError: (error: any) => {
      errorNotification(error?.response?.data?.message || "Failed to update firm configuration");
    },
  });
};
