import { useQuery } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiResponse } from "@/shared/types/response";

import { AuditFilters, AuditLogData } from "@/pages/SuperAdmin/AuditLogs/types";

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

const getFirmAuditLogs = (firmId: string, params: AuditFilters) => {
  return LawFirmCRMClient.get<ApiResponse<AuditLogData>>(
    api.AUDIT_LOGS.FIRM_AUDIT.replace("{firmId}", firmId),
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
