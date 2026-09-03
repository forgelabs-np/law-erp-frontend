import { useQuery } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiResponse } from "@/shared/types/response";

import {
  AuditFilters,
  AuditLogData,
  EntityHistoryParams,
  UserAuditLogParams,
} from "@/pages/SuperAdmin/AuditLogs/types";

// ─── Get All Audit Logs (platform-wide) ──────────────────────────────────────

const getPlatformAuditLogs = (params: AuditFilters) => {
  return LawFirmCRMClient.get<ApiResponse<AuditLogData>>(
    api.AUDIT_LOGS.PLATFORM_AUDIT,
    { params }
  );
};

export const usePlatformAuditLogsQuery = (params: AuditFilters) => {
  return useQuery({
    queryKey: [api.AUDIT_LOGS.PLATFORM_AUDIT, params],
    queryFn: () => getPlatformAuditLogs(params),
    select: (response) => response?.data,
  });
};

// ─── Get Audit Logs for a User ────────────────────────────────────────────────

const getUserAuditLogs = (userId: string, params: UserAuditLogParams) => {
  return LawFirmCRMClient.get<ApiResponse<AuditLogData>>(
    api.AUDIT_LOGS.USER_AUDIT.replace("{userId}", encodeURIComponent(userId)),
    { params }
  );
};

export const useUserAuditLogsQuery = (
  userId: string,
  params: UserAuditLogParams
) => {
  return useQuery({
    queryKey: [api.AUDIT_LOGS.USER_AUDIT, userId, params],
    queryFn: () => getUserAuditLogs(userId, params),
    select: (response) => response?.data,
    enabled: !!userId,
  });
};

// ─── Get Audit Logs for a Firm ────────────────────────────────────────────────

const getFirmAuditLogs = (firmId: string, params: AuditFilters) => {
  return LawFirmCRMClient.get<ApiResponse<AuditLogData>>(
    api.AUDIT_LOGS.FIRM_AUDIT.replace("{firmId}", encodeURIComponent(firmId)),
    { params }
  );
};

export const useFirmAuditLogsQuery = (firmId: string, params: AuditFilters) => {
  return useQuery({
    queryKey: [api.AUDIT_LOGS.FIRM_AUDIT, firmId, params],
    queryFn: () => getFirmAuditLogs(firmId, params),
    select: (response) => response?.data,
    enabled: !!firmId,
  });
};

// ─── Get Entity History ───────────────────────────────────────────────────────

const getEntityHistory = (
  entityType: string,
  entityId: string,
  params: EntityHistoryParams
) => {
  return LawFirmCRMClient.get<ApiResponse<AuditLogData>>(
    api.AUDIT_LOGS.ENTITY_AUDIT.replace(
      "{entityType}",
      encodeURIComponent(entityType)
    ).replace("{entityId}", encodeURIComponent(entityId)),
    { params }
  );
};

export const useEntityHistoryQuery = (
  entityType: string,
  entityId: string,
  params: EntityHistoryParams
) => {
  return useQuery({
    queryKey: [api.AUDIT_LOGS.ENTITY_AUDIT, entityType, entityId, params],
    queryFn: () => getEntityHistory(entityType, entityId, params),
    select: (response) => response?.data,
    enabled: !!entityType && !!entityId,
  });
};
