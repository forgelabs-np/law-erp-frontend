import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { RoleSetupPayload } from "@/pages/SuperAdmin/Role/types";
import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiErrorResponse, ApiResponse } from "@/shared/types/response";
import {
  errorNotification,
  successNotification,
} from "@/shared/utils/notification";

export interface Permission {
  featureId: number;
  featureName: string;
  featureCode: string;
  moduleName: string;
  permissionType: string;
  isAllowed: boolean;
}

export interface RoleResposeType {
  id: number;
  name: string;
  code: string;
  description: string;
  isSystem: boolean;
  isActive: boolean;
  permissions: Permission[];
}

const getRole = () => {
  return LawFirmCRMClient.get<ApiResponse<RoleResposeType[]>>(
    api.USER_MANAGEMENT.ROLE_SETUP.GET_ROLES
  );
};

export const useGetRoleQuery = () => {
  return useQuery({
    queryKey: [api.USER_MANAGEMENT.ROLE_SETUP.GET_ROLES],
    queryFn: getRole,
    select: (response) => response?.data,
  });
};

const addEditRole = (data: RoleSetupPayload) => {
  return LawFirmCRMClient.post(api.USER_MANAGEMENT.ROLE_SETUP.GET_ROLES, {
    data,
  });
};

export const useAddEditRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addEditRole,
    onSuccess: (response) => {
      successNotification(response?.data?.message);
      queryClient.invalidateQueries({
        queryKey: [api.USER_MANAGEMENT.ROLE_SETUP.GET_ROLES],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ?? "Something went wrong!";
      errorNotification(errorMessage);
    },
  });
};

const getRoleById = async (id: string) => {
  return LawFirmCRMClient.get(
    api.USER_MANAGEMENT.ROLE_SETUP.GET_BY_ID.replace("{roleId}", id)
  );
};

export const useRoleByIdQuery = (id: string) => {
  return useQuery({
    queryKey: [`role-${id}`],
    enabled: !!id,
    queryFn: async () => {
      return getRoleById(id);
    },
    select: (data) => data?.data?.data,
  });
};

const toggleRole = (id: string) => {
  const url = api.USER_MANAGEMENT.ROLE_SETUP.TOGGLE.replace("{roleId}", id);

  return LawFirmCRMClient.patch(url);
};

export const useToggleRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleRole(id),
    onSuccess: (response, id) => {
      successNotification(response?.data?.message);
      queryClient.invalidateQueries({
        queryKey: [api.USER_MANAGEMENT.ROLE_SETUP.GET_ROLES],
      });
      queryClient.invalidateQueries({ queryKey: [`role-${id}`] });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.error?.errorMessage ?? "Something went wrong!";
      errorNotification(errorMessage);
    },
  });
};

//// Permission

export interface RolePermissionPayload {
  roleId: string;
  permissionIds: string[];
}

const assignRolePermissions = async (data: RolePermissionPayload) => {
  return LawFirmCRMClient.post(
    api.USER_MANAGEMENT.ROLE_SETUP.ROLE_PERMISSIONS,
    {
      roleId: data.roleId,
      permissionIds: data.permissionIds,
    }
  );
};

export const useAssignRolePermissionsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignRolePermissions,
    onSuccess: (response, variables) => {
      successNotification(
        response?.data?.message || "Role permissions assigned successfully"
      );
      queryClient.invalidateQueries({
        queryKey: [`role-permissions-${variables.roleId}`],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ?? "Something went wrong!";
      errorNotification(errorMessage);
    },
  });
};

const getRolePermissions = async (roleId: string) => {
  return LawFirmCRMClient.get(
    api.USER_MANAGEMENT.ROLE_SETUP.GET_ROLE_PERMISSIONS.replace(
      "{roleId}",
      roleId
    )
  );
};

export const useRolePermissionsQuery = (roleId: string) => {
  return useQuery({
    queryKey: [`role-permissions-${roleId}`],
    enabled: !!roleId,
    queryFn: async () => {
      return getRolePermissions(roleId);
    },
    select: (data) => data?.data?.data,
  });
};



export const deleteRole = async (id: string) => {
  const url = api.USER_MANAGEMENT.ROLE_SETUP.DELETE.replace("{roleId}", id);

  return LawFirmCRMClient.delete(url);
};

export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: (response, id) => {
      successNotification(response?.data?.message);
      queryClient.invalidateQueries({
        queryKey: [api.USER_MANAGEMENT.ROLE_SETUP.GET_ROLES],
      });
      // queryClient.invalidateQueries({ queryKey: [`role-${id}`] });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.error?.errorMessage ?? "Something went wrong!";
      errorNotification(errorMessage);
    },
  });
};
