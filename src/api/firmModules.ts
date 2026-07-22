import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiErrorResponse, ApiResponse } from "@/shared/types/response";
import {
  errorNotification,
  successNotification,
} from "@/shared/utils/notification";

import { ConfigureModulePayload, FirmModule, MasterModule, MergedModule } from "@/pages/SuperAdmin/FirmModules/types";

export type { FirmModule, MasterModule, MergedModule };

const getAllModules = () => {
  return LawFirmCRMClient.get<ApiResponse<MasterModule[]>>(
    api.USER_MANAGEMENT.MENU_MANAGEMENT.GET_MODULES
  );
};

export const useGetAllModulesQuery = () => {
  return useQuery({
    queryKey: [api.USER_MANAGEMENT.MENU_MANAGEMENT.GET_MODULES],
    queryFn: getAllModules,
    select: (response) => response?.data?.data,
  });
};

const getFirmModules = (firmId: string) => {
  return LawFirmCRMClient.get<ApiResponse<FirmModule[]>>(
    api.FIRM_MANAGEMENT.GET_FIRM_MODULES.replace("{firmId}", firmId)
  );
};

export const useGetFirmModulesQuery = (firmId: string) => {
  return useQuery({
    queryKey: [api.FIRM_MANAGEMENT.GET_FIRM_MODULES, firmId],
    queryFn: () => getFirmModules(firmId),
    select: (response) => response?.data?.data,
    enabled: !!firmId,
  });
};

const configureFirmModule = (
  firmId: string,
  payload: ConfigureModulePayload
) => {
  return LawFirmCRMClient.post<ApiResponse<any>>(
    api.FIRM_MANAGEMENT.CONFIGURE_FIRM_MODULE.replace("{firmId}", firmId),
    { data: payload }
  );
};

export const useConfigureFirmModuleMutation = (firmId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ConfigureModulePayload) =>
      configureFirmModule(firmId, payload),
    onSuccess: (response) => {
      successNotification(
        response?.data?.message || "Module configured successfully"
      );
      queryClient.invalidateQueries({
        queryKey: [api.FIRM_MANAGEMENT.GET_FIRM_MODULES, firmId],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error?.errorMessage ??
        "Something went wrong!";
      errorNotification(errorMessage);
    },
  });
};
