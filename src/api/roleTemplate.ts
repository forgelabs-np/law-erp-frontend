import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { RoleResponseType } from "@/api/roleSetup.ts/index.ts";
import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiErrorResponse, ApiResponse } from "@/shared/types/response";
import {
  errorNotification,
  successNotification,
} from "@/shared/utils/notification";

// ─── TYPES ───────────────────────────────────────────────────────────────────

/** Permission as returned by the template endpoints. */
export interface TemplatePermission {
  id: string;
  action: string;
  scope: string;
  code: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

/** Item of GET /admin/roles/templates */
export interface RoleTemplateResponse {
  id: string;
  name: string;
  code: string;
  description: string;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  permissions: TemplatePermission[];
  userCount: number;
  assignedUserNames: string[];
}

/** Response of GET /admin/roles/templates/{templateId}/permissions */
export interface TemplatePermissionDetail {
  templateId: string;
  templateCode: string;
  templateName: string;
  lastSaEditAt: string;
  currentPermissions: TemplatePermission[];
  addedPermissionCodes: string[];
  removedPermissionCodes: string[];
  chainValidationViolations: string[];
  syncJobId: string | null;
}

/** Body of GET .../permissions/preview (backend `TemplatePermissionRequest`). */
export interface TemplatePermissionRequest {
  permissionIds: string[];
}

/** Backend `ApiRequest<T>` envelope — required on preview + update bodies. */
export interface ApiRequest<T> {
  data: T;
}

/** Hook-level payload for the preview call (templateId goes in the path). */
export interface TemplatePermissionPreviewRequest {
  templateId: string;
  permissionIds: string[];
}

/** Impact of the template change on one firm role clone. */
export interface TemplateCloneImpact {
  roleId: string;
  roleCode: string;
  added: string[];
  removed: string[];
  skippedByCeiling: string[];
  cascadeStripped: string[];
  addedPermissionIds: string[];
  removedPermissionIds: string[];
}

/** Cascade target of a template change within a firm. */
export interface TemplateCascadeTarget {
  roleId: string;
  roleCode: string;
  permissionIds: string[];
  permissionCodes: string[];
}

/** Impact of the template change on one firm. */
export interface TemplateFirmImpact {
  firmId: string;
  firmCode: string;
  cloneImpacts: TemplateCloneImpact[];
  cascadeTargets: TemplateCascadeTarget[];
}

/** Response of GET .../permissions/preview */
export interface TemplatePermissionPreview {
  templateId: string;
  templateCode: string;
  addedPermissionCodes: string[];
  removedPermissionCodes: string[];
  chainValidationViolations: string[];
  wouldViolateChain: boolean;
  firmImpacts: TemplateFirmImpact[];
  firmsAffected: number;
  clonesSynced: number;
  clonesSkippedByCeiling: number;
  cascadeStrippedFromClones: number;
  cascadeStrippedFromTemplates: number;
  employeeTemplateStrips: Record<string, string[]>;
  employeeTemplateStripIds: Record<string, string[]>;
}

/** Response of PUT /admin/roles/templates/{templateId}/permissions */
export type TemplatePermissionUpdateResponse = TemplatePermissionDetail;

// ─── SYNC JOB ────────────────────────────────────────────────────────────────

export type TemplateSyncJobStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "COMPLETED_WITH_FAILURES"
  | "FAILED"
  | (string & {});

export interface TemplateSyncJob {
  jobId: string;
  templateId: string;
  templateCode: string;
  status: TemplateSyncJobStatus;
  firmsTotal: number;
  firmsCompleted: number;
  firmsFailed: number;
  errorSummary: string;
  startedAt: string;
  completedAt: string | null;
}

/** Terminal statuses that stop sync-job polling. */
export const SYNC_JOB_TERMINAL_STATUSES = [
  "COMPLETED",
  "COMPLETED_WITH_FAILURES",
  "FAILED",
] as const;

export const isTerminalSyncStatus = (status?: string): boolean =>
  !!status &&
  (SYNC_JOB_TERMINAL_STATUSES as readonly string[]).includes(status);

// ─── SUPER ADMIN — FIRM ROLES ────────────────────────────────────────────────

/** Role of a specific firm, as returned by GET /super-admin/firms/{firmId}/roles */
export type FirmRoleResponse = RoleResponseType;

/** Request of POST /super-admin/firms/{firmId}/roles (parentRoleId is required) */
export interface CreateFirmRolePayload {
  id: string;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  parentRoleId: string;
  permissionIds: string[];
}

// ─── SERVICES ────────────────────────────────────────────────────────────────

const getRoleTemplates = () => {
  return LawFirmCRMClient.get<ApiResponse<RoleTemplateResponse[]>>(
    api.ROLE_TEMPLATES.LIST
  );
};

const getTemplatePermissions = async (templateId: string) => {
  return LawFirmCRMClient.get<ApiResponse<TemplatePermissionDetail>>(
    api.ROLE_TEMPLATES.PERMISSIONS.replace("{templateId}", templateId)
  );
};

/**
 * NOTE: this endpoint is GET but carries a request body per the backend
 * contract — mirrored exactly here (do not convert to POST).
 * The body must be wrapped in the backend `ApiRequest<T>` envelope:
 * `{ data: { permissionIds: [...] } }` — a bare `{ permissionIds }` fails
 * with 400 "Required request body is missing".
 */
const previewTemplatePermissions = async (
  payload: TemplatePermissionPreviewRequest
) => {
  const body: ApiRequest<TemplatePermissionRequest> = {
    data: { permissionIds: payload.permissionIds },
  };
  return LawFirmCRMClient.post<ApiResponse<TemplatePermissionPreview>>(
    api.ROLE_TEMPLATES.PREVIEW.replace("{templateId}", payload.templateId),
    body
  );
};

const updateTemplatePermissions = async (payload: {
  templateId: string;
  permissionIds: string[];
}) => {
  return LawFirmCRMClient.put<ApiResponse<TemplatePermissionUpdateResponse>>(
    api.ROLE_TEMPLATES.PERMISSIONS.replace("{templateId}", payload.templateId),
    { data: { permissionIds: payload.permissionIds } }
  );
};

const getSyncJob = async (jobId: string) => {
  return LawFirmCRMClient.get<ApiResponse<TemplateSyncJob>>(
    api.ROLE_TEMPLATES.SYNC_JOB.replace("{jobId}", jobId)
  );
};

const getFirmRoles = async (firmId: string) => {
  return LawFirmCRMClient.get<ApiResponse<FirmRoleResponse[]>>(
    api.FIRM_MANAGEMENT.SUPER_ADMIN_FIRM_ROLES.replace("{firmId}", firmId)
  );
};

const createFirmRole = async (payload: {
  firmId: string;
  data: CreateFirmRolePayload;
}) => {
  return LawFirmCRMClient.post(
    api.FIRM_MANAGEMENT.SUPER_ADMIN_FIRM_ROLES.replace(
      "{firmId}",
      payload.firmId
    ),
    { data: payload.data }
  );
};

const getErrorMessage = (error: ApiErrorResponse) =>
  error?.response?.data?.message ??
  error?.response?.data?.error?.errorMessage ??
  "Something went wrong!";

// ─── HOOKS ───────────────────────────────────────────────────────────────────

export const useRoleTemplatesQuery = () => {
  return useQuery({
    queryKey: [api.ROLE_TEMPLATES.LIST],
    queryFn: getRoleTemplates,
    select: (response) => response?.data?.data,
  });
};

export const useTemplatePermissionsQuery = (
  templateId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["template-permissions", templateId],
    enabled: !!templateId && enabled,
    queryFn: async () => getTemplatePermissions(templateId),
    select: (response) => response?.data?.data,
  });
};

export const usePreviewTemplatePermissionsMutation = () => {
  return useMutation({
    mutationFn: previewTemplatePermissions,
    onError: (error: ApiErrorResponse) => {
      errorNotification(getErrorMessage(error));
    },
  });
};

export const useUpdateTemplatePermissionsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTemplatePermissions,
    onSuccess: () => {
      // The PUT only queues the sync job — final refresh happens when the
      // sync job reaches a terminal status (see TemplatePermissionsDrawer).
      queryClient.invalidateQueries({
        queryKey: ["template-permissions"],
      });
    },
    onError: (error: ApiErrorResponse) => {
      errorNotification(getErrorMessage(error));
    },
  });
};

/** Polls a template permission sync job every ~2s until a terminal status. */
export const useTemplateSyncJobQuery = (jobId: string | null) => {
  return useQuery({
    queryKey: ["template-sync-job", jobId],
    enabled: !!jobId,
    queryFn: async () => {
      if (!jobId) throw new Error("Missing sync job id");
      return getSyncJob(jobId);
    },
    select: (response) => response?.data?.data,
    refetchInterval: (query) => {
      const status = query.state.data?.data?.data?.status;
      return isTerminalSyncStatus(status) ? false : 2000;
    },
  });
};

export const useFirmRolesQuery = (firmId: string) => {
  return useQuery({
    queryKey: ["super-admin-firm-roles", firmId],
    enabled: !!firmId,
    queryFn: async () => getFirmRoles(firmId),
    select: (response) => response?.data?.data,
  });
};

export const useCreateFirmRoleMutation = (firmId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFirmRole,
    onSuccess: (response) => {
      successNotification(
        response?.data?.message || "Role created successfully"
      );
      queryClient.invalidateQueries({
        queryKey: ["super-admin-firm-roles", firmId],
      });
    },
    onError: (error: ApiErrorResponse) => {
      errorNotification(getErrorMessage(error));
    },
  });
};
