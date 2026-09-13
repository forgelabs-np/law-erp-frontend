import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiErrorResponse, ApiResponse } from "@/shared/types/response";
import {
  errorNotification,
  successNotification,
} from "@/shared/utils/notification";

// ─── TYPES ───────────────────────────────────────────────────────────────────

/** A permission currently attached to a role. */
export interface RolePermissionEntry {
  id: string;
  code: string;
  action: string;
  scope?: string;
  moduleCode?: string;
  description?: string;
  isActive?: boolean;
}

/**
 * A permission the caller is allowed to assign (the Firm Admin ceiling).
 * `assigned` is the initial checkbox state for the role being edited.
 */
export interface AvailableRolePermission {
  id: string;
  code: string;
  action: string;
  moduleCode: string;
  assigned: boolean;
  scope?: string;
  isActive?: boolean;
}

/** A role belonging to a single firm (system clone or custom). */
export interface FirmRole {
  id: string;
  name: string;
  code: string;
  description?: string;
  isSystem: boolean;
  isActive: boolean;
  userCount?: number;
  permissions?: RolePermissionEntry[];
}

/** Response of GET /firm/roles/{roleId}/permissions */
export interface FirmRolePermissions {
  roleId: string;
  roleName: string;
  roleCode: string;
  currentPermissions: RolePermissionEntry[];
  availablePermissions: AvailableRolePermission[];
}

export interface FirmRolePayload {
  name: string;
  code: string;
  description?: string;
}

/**
 * Full-replacement permission payload. The backend replaces the entire
 * permission set, so every selected permission id must be sent.
 */
export interface RolePermissionAssignmentPayload {
  roleId: string;
  permissionIds: string[];
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const resolveErrorMessage = (
  error: ApiErrorResponse,
  fallback = "Something went wrong!"
) =>
  error?.response?.data?.error?.errorMessage ??
  error?.response?.data?.message ??
  fallback;

const ROLE_USERS_FALLBACK = "Role saved, but users may need to re-login.";

// ─── FIRM ADMIN: LIST ROLES ──────────────────────────────────────────────────

const getFirmRoles = () =>
  LawFirmCRMClient.get<ApiResponse<FirmRole[]>>(api.FIRM_ROLE_MANAGEMENT.LIST);

export const useFirmRolesQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [api.FIRM_ROLE_MANAGEMENT.LIST],
    queryFn: getFirmRoles,
    enabled: options?.enabled ?? true,
    select: (response) => response?.data?.data ?? [],
  });
};

// ─── FIRM ADMIN: CREATE ROLE ─────────────────────────────────────────────────

const createFirmRole = (payload: FirmRolePayload) =>
  LawFirmCRMClient.post<ApiResponse<FirmRole>>(
    api.FIRM_ROLE_MANAGEMENT.CREATE,
    { data: payload }
  );

export const useCreateFirmRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFirmRole,
    onSuccess: (response) => {
      successNotification(
        response?.data?.message || "Role created successfully"
      );
      queryClient.invalidateQueries({
        queryKey: [api.FIRM_ROLE_MANAGEMENT.LIST],
      });
    },
    onError: (error: ApiErrorResponse) => {
      errorNotification(resolveErrorMessage(error));
    },
  });
};

// ─── FIRM ADMIN: DELETE ROLE ─────────────────────────────────────────────────

const deleteFirmRole = (roleId: string) =>
  LawFirmCRMClient.delete(
    api.FIRM_ROLE_MANAGEMENT.DELETE.replace("{roleId}", roleId)
  );

export const useDeleteFirmRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFirmRole,
    onSuccess: (response) => {
      successNotification(
        response?.data?.message || "Role deleted successfully"
      );
      queryClient.invalidateQueries({
        queryKey: [api.FIRM_ROLE_MANAGEMENT.LIST],
      });
    },
    onError: (error: ApiErrorResponse) => {
      errorNotification(resolveErrorMessage(error));
    },
  });
};

// ─── FIRM ADMIN: TOGGLE ROLE STATUS ──────────────────────────────────────────

const toggleFirmRole = (roleId: string) =>
  LawFirmCRMClient.patch(
    api.FIRM_ROLE_MANAGEMENT.TOGGLE.replace("{roleId}", roleId)
  );

export const useToggleFirmRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleFirmRole,
    onSuccess: (response, roleId) => {
      successNotification(response?.data?.message || "Role status updated");
      queryClient.invalidateQueries({
        queryKey: [api.FIRM_ROLE_MANAGEMENT.LIST],
      });
      queryClient.invalidateQueries({ queryKey: [`role-${roleId}`] });
    },
    onError: (error: ApiErrorResponse) => {
      errorNotification(resolveErrorMessage(error));
    },
  });
};

// ─── FIRM ADMIN: ROLE PERMISSIONS (WITH CEILING) ─────────────────────────────

const getFirmRolePermissions = (roleId: string) =>
  LawFirmCRMClient.get<ApiResponse<FirmRolePermissions>>(
    api.FIRM_ROLE_MANAGEMENT.PERMISSIONS.replace("{roleId}", roleId)
  );

export const useFirmRolePermissionsQuery = (
  roleId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [api.FIRM_ROLE_MANAGEMENT.PERMISSIONS, roleId],
    enabled: !!roleId && (options?.enabled ?? true),
    queryFn: () => getFirmRolePermissions(roleId),
    select: (response) => response?.data?.data,
  });
};

const updateFirmRolePermissions = (payload: RolePermissionAssignmentPayload) =>
  LawFirmCRMClient.put(
    api.FIRM_ROLE_MANAGEMENT.PERMISSIONS.replace("{roleId}", payload.roleId),
    {
      data: {
        roleId: payload.roleId,
        permissionIds: payload.permissionIds,
      },
    }
  );

export const useUpdateFirmRolePermissionsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFirmRolePermissions,
    onSuccess: (response, variables) => {
      successNotification(response?.data?.message || ROLE_USERS_FALLBACK);
      queryClient.invalidateQueries({
        queryKey: [api.FIRM_ROLE_MANAGEMENT.PERMISSIONS, variables.roleId],
      });
      queryClient.invalidateQueries({
        queryKey: [api.FIRM_ROLE_MANAGEMENT.LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [`role-${variables.roleId}`],
      });
    },
    onError: (error: ApiErrorResponse) => {
      errorNotification(resolveErrorMessage(error));
    },
  });
};

// ─── SUPER ADMIN: VIEW / MANAGE A FIRM'S ROLES ───────────────────────────────

const getSuperAdminFirmRoles = (firmId: string) =>
  LawFirmCRMClient.get<ApiResponse<FirmRole[]>>(
    api.SUPER_ADMIN_FIRM_ROLES.LIST.replace("{firmId}", firmId)
  );

export const useSuperAdminFirmRolesQuery = (
  firmId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [api.SUPER_ADMIN_FIRM_ROLES.LIST, firmId],
    enabled: !!firmId && (options?.enabled ?? true),
    queryFn: () => getSuperAdminFirmRoles(firmId),
    select: (response) => response?.data?.data ?? [],
  });
};

const createSuperAdminFirmRole = ({
  firmId,
  ...payload
}: FirmRolePayload & { firmId: string }) =>
  LawFirmCRMClient.post<ApiResponse<FirmRole>>(
    api.SUPER_ADMIN_FIRM_ROLES.CREATE.replace("{firmId}", firmId),
    { data: payload }
  );

export const useCreateSuperAdminFirmRoleMutation = (firmId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FirmRolePayload) =>
      createSuperAdminFirmRole({ ...payload, firmId }),
    onSuccess: (response) => {
      successNotification(
        response?.data?.message || "Role created successfully"
      );
      queryClient.invalidateQueries({
        queryKey: [api.SUPER_ADMIN_FIRM_ROLES.LIST, firmId],
      });
    },
    onError: (error: ApiErrorResponse) => {
      errorNotification(resolveErrorMessage(error));
    },
  });
};

const overrideFirmRolePermissions = ({
  firmId,
  ...payload
}: RolePermissionAssignmentPayload & { firmId: string }) =>
  LawFirmCRMClient.put(
    api.SUPER_ADMIN_FIRM_ROLES.PERMISSIONS.replace("{firmId}", firmId).replace(
      "{roleId}",
      payload.roleId
    ),
    {
      data: {
        roleId: payload.roleId,
        permissionIds: payload.permissionIds,
      },
    }
  );

export const useOverrideFirmRolePermissionsMutation = (firmId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RolePermissionAssignmentPayload) =>
      overrideFirmRolePermissions({ ...payload, firmId }),
    onSuccess: (response, variables) => {
      successNotification(response?.data?.message || ROLE_USERS_FALLBACK);
      queryClient.invalidateQueries({
        queryKey: [api.SUPER_ADMIN_FIRM_ROLES.LIST, firmId],
      });
      queryClient.invalidateQueries({
        queryKey: [`role-${variables.roleId}`],
      });
      queryClient.invalidateQueries({
        queryKey: [api.FIRM_ROLE_MANAGEMENT.PERMISSIONS, variables.roleId],
      });
    },
    onError: (error: ApiErrorResponse) => {
      errorNotification(resolveErrorMessage(error));
    },
  });
};
