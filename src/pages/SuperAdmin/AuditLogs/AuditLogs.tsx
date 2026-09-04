import { Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePlatformAuditLogsQuery } from "@/api/auditLogs.ts";
import { ROUTES_CONFIG } from "@/shared/config";

import { AuditLog } from "./types";
import { useAuditLogFilters } from "./useAuditLogFilters";
import { AuditLogsHeader } from "./components/AuditLogsHeader";
import { AuditLogsFilters } from "./components/AuditLogsFilters";
import { AuditLogsTimeline } from "./components/AuditLogsTimeline";
import { AuditLogDetailsDrawer } from "./components/AuditLogDetailsDrawer";
import { AuditLogsSkeleton } from "./components/AuditLogsSkeleton";
import { AuditLogsEmptyState } from "./components/AuditLogsEmptyState";
import { AuditLogsErrorState } from "./components/AuditLogsErrorState";
import { AuditLogsPagination } from "./components/AuditLogsPagination";

const AuditLogs = () => {
  const navigate = useNavigate();
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    filters,
    hasFilters,
    handleFilterChange,
    handleApplyFilters,
    handleReset,
    handlePageChange,
    handlePageSizeChange,
  } = useAuditLogFilters();

  const {
    data: auditData,
    isLoading,
    error,
    refetch,
  } = usePlatformAuditLogsQuery(filters);

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedLog(null);
  };

  const handleViewEntityHistory = (log: AuditLog) => {
    handleCloseDrawer();
    navigate(
      ROUTES_CONFIG.SUPER_ADMIN.ENTITY_AUDIT_LOGS.replace(
        ":entityType",
        log.entityType
      ).replace(":entityId", log.entityId)
    );
  };

  const logs = auditData?.data?.content ?? [];
  const totalElements = auditData?.data?.totalElements ?? 0;
  const totalPages = auditData?.data?.totalPages ?? 0;

  return (
    <Stack gap={2} padding={2}>
      {/* Header */}
      <AuditLogsHeader />

      {/* Filters */}
      <AuditLogsFilters
        onReset={handleReset}
        onApply={handleApplyFilters}
        onFilterChange={handleFilterChange}
        actionValue={filters.action}
        fromDateValue={filters.fromDate}
        toDateValue={filters.toDate}
      />

      {/* Content */}
      {isLoading ? (
        <AuditLogsSkeleton />
      ) : error ? (
        <AuditLogsErrorState onRetry={() => refetch()} />
      ) : logs.length === 0 ? (
        <AuditLogsEmptyState
          hasFilters={hasFilters}
          onResetFilters={handleReset}
        />
      ) : (
        <>
          {/* Timeline */}
          <AuditLogsTimeline logs={logs} onViewDetails={handleViewDetails} />

          {/* Pagination */}
          <AuditLogsPagination
            page={filters.page}
            size={filters.size}
            totalElements={totalElements}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}

      {/* Details Drawer */}
      <AuditLogDetailsDrawer
        log={selectedLog}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onViewEntityHistory={handleViewEntityHistory}
      />
    </Stack>
  );
};

export default AuditLogs;
