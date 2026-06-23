import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiErrorResponse, ApiResponse } from "@/shared/types/response";
import {
  errorNotification,
  successNotification,
} from "@/shared/utils/notification";

export interface Module {
  id: string;
  name: string;
  code: string;
  description: string;
  parentId: string | null;
  parent: string | null;
  subModules: string[];
  level: number;
  displayOrder: number;
  icon: string;
  path: string;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionResponse {
  id: string;
  module: Module;
  action: string;
  code: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface PermissionPayload {
  id?: string;
  moduleCode: string;
  action: string;
  code: string;
  scope: string;
  description: string;
  isActive?: boolean;
}

const getPermissions = () => {
  return LawFirmCRMClient.get<ApiResponse<PermissionResponse[]>>(
    api.USER_MANAGEMENT.PERMISSION_SETUP.GET_PERMISSIONS
  );
};

export const useGetPermissionsQuery = () => {
  return useQuery({
    queryKey: [api.USER_MANAGEMENT.PERMISSION_SETUP.GET_PERMISSIONS],
    queryFn: getPermissions,
    select: (response) => response?.data,
  });
};

const addEditPermission = async (data: PermissionPayload) => {
  return LawFirmCRMClient.post(api.USER_MANAGEMENT.PERMISSION_SETUP.POST, {
    data,
  });
};

export const useAddEditPermissionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addEditPermission,
    onSuccess: (response) => {
      successNotification(response?.data?.message || "Menu saved successfully");
      queryClient.invalidateQueries({
        queryKey: [api.USER_MANAGEMENT.PERMISSION_SETUP.GET_PERMISSIONS],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ?? "Something went wrong!";
      errorNotification(errorMessage);
    },
  });
};

const getPermissionById = async (id: string) => {
  return LawFirmCRMClient.get(
    api.USER_MANAGEMENT.PERMISSION_SETUP.GET_BY_ID.replace("{id}", id)
  );
};

export const usePermissionByIdQuery = (id: string) => {
  return useQuery({
    queryKey: [`permission-${id}`],
    enabled: !!id,
    queryFn: async () => {
      return getPermissionById(id);
    },
    select: (data) => data?.data?.data,
  });
};

const togglePermission = (id: string) => {
  const url = api.USER_MANAGEMENT.PERMISSION_SETUP.TOGGLE.replace("{id}", id);
  return LawFirmCRMClient.patch(url);
};

export const useTogglePermissionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => togglePermission(id),
    onSuccess: (response, id) => {
      successNotification(response?.data?.message || "Status updated");
      queryClient.invalidateQueries({
        queryKey: [api.USER_MANAGEMENT.MENU_MANAGEMENT.MODULE_MENUS],
      });
      queryClient.invalidateQueries({ queryKey: [`module-menu-${id}`] });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ?? "Something went wrong!";
      errorNotification(errorMessage);
    },
  });
};
