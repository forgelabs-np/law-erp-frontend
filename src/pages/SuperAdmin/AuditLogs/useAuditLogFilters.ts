import { useCallback, useState } from "react";

import { AuditFilters } from "./types";

export const DEFAULT_AUDIT_PAGE_SIZE = 10;

const initialFilters = (): AuditFilters => ({
  action: undefined,
  fromDate: undefined,
  toDate: undefined,
  page: 0,
  size: DEFAULT_AUDIT_PAGE_SIZE,
});

/**
 * Owns the filter + pagination state shared by every audit log view.
 * - Filters are stored as `undefined` (not empty strings) so the API client
 *   never serializes `action=""` / `fromDate=""` / `toDate=""`.
 * - `page` is zero-based internally (matching the API) and is reset to 0
 *   whenever a filter or page size changes.
 */
export const useAuditLogFilters = () => {
  const [filters, setFilters] = useState<AuditFilters>(initialFilters);

  const handleFilterChange = useCallback((field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value || undefined,
      page: 0,
    }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    setFilters((prev) => ({ ...prev, page: 0 }));
  }, []);

  const handleReset = useCallback(() => {
    setFilters(initialFilters());
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setFilters((prev) => ({ ...prev, size: pageSize, page: 0 }));
  }, []);

  const hasFilters = !!(filters.action || filters.fromDate || filters.toDate);

  return {
    filters,
    hasFilters,
    handleFilterChange,
    handleApplyFilters,
    handleReset,
    handlePageChange,
    handlePageSizeChange,
  };
};
