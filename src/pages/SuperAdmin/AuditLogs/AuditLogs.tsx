import { Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

import { usePlatformAuditLogsQuery } from "@/api/auditLogs.ts";
import { Pagination } from "@/shared/components/datatable/pagination/Pagination";

import { AuditFilters, AuditLog } from "./types";
import { AuditLogsHeader } from "./components/AuditLogsHeader";
import { AuditLogsFilters } from "./components/AuditLogsFilters";
import { AuditLogsTimeline } from "./components/AuditLogsTimeline";
import { AuditLogDetailsDrawer } from "./components/AuditLogDetailsDrawer";
import { AuditLogsSkeleton } from "./components/AuditLogsSkeleton";
import { AuditLogsEmptyState } from "./components/AuditLogsEmptyState";
import { AuditLogsErrorState } from "./components/AuditLogsErrorState";

const DEFAULT_PAGE_SIZE = 10;
const defaultFilters: AuditFilters = {
  action: undefined,
  fromDate: undefined,
  toDate: undefined,
  page: 0,
  size: DEFAULT_PAGE_SIZE,
};

const AuditLogs = () => {
  const [filters, setFilters] = useState<AuditFilters>(defaultFilters);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    data: auditData,
    isLoading,
    error,
    refetch,
  } = usePlatformAuditLogsQuery(filters);

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value || undefined,
      page: 0,
    }));
  };

  const handleApplyFilters = () => {
    setFilters((prev) => ({ ...prev, page: 0 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page: page - 1 }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, size: pageSize, page: 0 }));
  };

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedLog(null);
  };

  const hasFilters = !!(filters.action || filters.fromDate || filters.toDate);
  const logs = auditData?.data?.content ?? [];
  const totalElements = auditData?.data?.totalElements ?? 0;
  const totalPages = auditData?.data?.totalPages ?? 0;

  const startIndex = filters.page * filters.size + 1;
  const endIndex = Math.min((filters.page + 1) * filters.size, totalElements);

  return (
    <Stack gap={6} padding={8}>
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
          {totalPages > 1 && (
            <Stack align="center">
              <Text fontSize="sm" color="gray.500">
                Showing {startIndex}-{endIndex} of {totalElements} logs
              </Text>
              <Pagination
                currentPage={filters.page + 1}
                pageCount={totalPages}
                pageSize={filters.size}
                onPaginationChange={handlePageChange}
                setPageSize={handlePageSizeChange}
              />
            </Stack>
          )}
        </>
      )}

      {/* Details Drawer */}
      <AuditLogDetailsDrawer
        log={selectedLog}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </Stack>
  );
};

export default AuditLogs;
