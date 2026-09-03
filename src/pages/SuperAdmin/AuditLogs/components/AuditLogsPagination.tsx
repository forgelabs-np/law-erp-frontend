import { Stack, Text } from "@chakra-ui/react";
import { Pagination } from "@/shared/components/datatable/pagination/Pagination";

interface AuditLogsPaginationProps {
  /** Zero-based current page (matches the API). */
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

/**
 * Shared pagination for audit log views: "Showing X–Y of Z logs" summary plus
 * the project's Pagination control. Handles the 1-based UI <-> 0-based API
 * conversion so every page behaves identically.
 */
export const AuditLogsPagination = ({
  page,
  size,
  totalElements,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: AuditLogsPaginationProps) => {
  if (totalPages <= 1) return null;

  const startIndex = page * size + 1;
  const endIndex = Math.min((page + 1) * size, totalElements);

  return (
    <Stack align="center">
      <Text fontSize="sm" color="gray.500">
        Showing {startIndex}-{endIndex} of {totalElements} logs
      </Text>
      <Pagination
        currentPage={page + 1}
        pageCount={totalPages}
        pageSize={size}
        onPaginationChange={(newPage) => onPageChange(newPage - 1)}
        setPageSize={onPageSizeChange}
      />
    </Stack>
  );
};
