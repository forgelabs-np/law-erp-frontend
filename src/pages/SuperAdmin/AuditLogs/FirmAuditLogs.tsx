import {
  Badge,
  Box,
  Button,
  HStack,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ArrowLeft, Building2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useFirmAuditLogsQuery } from "@/api/auditLogs.ts";
import { useGetFirmsQuery, FirmResponse } from "@/api/firmManagement";
import { Tooltip } from "@/shared/components/ui";
import { ROUTES_CONFIG } from "@/shared/config";

import { AuditLog } from "./types";
import { useAuditLogFilters } from "./useAuditLogFilters";

/** The firm list endpoint historically returned a few name variants; keep both. */
type FirmListItem = FirmResponse & {
  firmName?: string;
  firmCode?: string;
};

import { AuditLogsFilters } from "./components/AuditLogsFilters";
import { AuditLogsTimeline } from "./components/AuditLogsTimeline";
import { AuditLogDetailsDrawer } from "./components/AuditLogDetailsDrawer";
import { AuditLogsSkeleton } from "./components/AuditLogsSkeleton";
import { AuditLogsEmptyState } from "./components/AuditLogsEmptyState";
import { AuditLogsErrorState } from "./components/AuditLogsErrorState";
import { AuditLogsPagination } from "./components/AuditLogsPagination";

/**
 * Super Admin view of the audit trail for a single firm
 * (GET /super-admin/audit/firms/{firmId}). Supports filtering by action,
 * from date and to date.
 *
 * Firm context comes from navigation state when arriving from Firm
 * Management, otherwise from the (cached) firm list. When unavailable the
 * page stays functional and identifies the firm by its ID.
 */
const FirmAuditLogs = () => {
  const { firmId } = useParams<{ firmId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const firmFromState = (location.state as { firm?: FirmListItem })?.firm;

  const { data: firmsData, isLoading: isFirmsLoading } = useGetFirmsQuery();

  const firm = useMemo(() => {
    if (firmFromState) return firmFromState;
    return firmsData?.data?.find(
      (f) => String(f.firmId) === firmId || String(f.id) === firmId
    );
  }, [firmFromState, firmsData, firmId]);

  const firmDisplayName = firm?.name || firm?.firmName || `Firm #${firmId}`;
  const firmCode = firm?.lawFirmCode || firm?.firmCode;

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
  } = useFirmAuditLogsQuery(firmId ?? "", filters);

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
      {/* Back */}
      <Button
        variant="ghost"
        alignSelf="flex-start"
        size="sm"
        onClick={() => navigate(ROUTES_CONFIG.USER.FIRM_MANAGEMENT)}
      >
        <ArrowLeft size={16} />
        Back to Firms
      </Button>

      {/* Header */}
      <Stack gap={2}>
        <Text textStyle="heading_4">Firm Audit History</Text>
        <Text textStyle="paragraph_regular" color="gray.500">
          Audit events recorded for this firm
        </Text>
      </Stack>

      {/* Firm context */}
      <Box
        bg="white"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.200"
        p={4}
      >
        {isFirmsLoading && !firm ? (
          <HStack gap={3}>
            <Skeleton boxSize="40px" borderRadius="lg" />
            <Stack gap={2} flex={1}>
              <Skeleton height="16px" width="180px" />
              <Skeleton height="12px" width="240px" />
            </Stack>
          </HStack>
        ) : firm ? (
          <HStack gap={4} flexWrap={{ base: "wrap", md: "nowrap" }}>
            <HStack gap={3} flex={1} minW={0}>
              <Box bg="blue.800" borderRadius="lg" p={2.5} flexShrink={0}>
                <Building2 size={18} color="white" />
              </Box>
              <Stack gap={0} minW={0}>
                <HStack gap={2} flexWrap="wrap">
                  <Text fontWeight="600" fontSize="sm" color="gray.800">
                    {firmDisplayName}
                  </Text>
                  {firm.firmType && (
                    <Badge
                      bg={firm.firmType === "SOLO" ? "blue.100" : "purple.100"}
                      color={
                        firm.firmType === "SOLO" ? "blue.700" : "purple.700"
                      }
                      px="2"
                      py="0.5"
                      borderRadius="md"
                      fontSize="xs"
                      textTransform="capitalize"
                    >
                      {firm.firmType}
                    </Badge>
                  )}
                  {firm.isActive !== undefined && (
                    <Badge
                      bg={firm.isActive ? "green.100" : "gray.100"}
                      color={firm.isActive ? "green.700" : "gray.600"}
                      px="2"
                      py="0.5"
                      borderRadius="md"
                      fontSize="xs"
                    >
                      {firm.isActive ? "Active" : "Inactive"}
                    </Badge>
                  )}
                </HStack>
                <Text fontSize="xs" color="gray.500" truncate={true}>
                  {[firmCode, firm.email || firm.adminEmail]
                    .filter(Boolean)
                    .join(" · ")}
                </Text>
              </Stack>
            </HStack>
            <Box>
              <Text fontSize="xs" color="gray.500">
                Firm ID
              </Text>
              <Tooltip content={firmId ?? ""}>
                <Text
                  fontSize="xs"
                  color="gray.600"
                  fontFamily="mono"
                  maxW="150px"
                  truncate={true}
                >
                  {firmId}
                </Text>
              </Tooltip>
            </Box>
          </HStack>
        ) : (
          <HStack gap={3}>
            <Box bg="gray.100" borderRadius="lg" p={2.5}>
              <Building2 size={18} color="gray.600" />
            </Box>
            <Stack gap={0}>
              <Text fontSize="sm" fontWeight="600" color="gray.700">
                Firm #{firmId}
              </Text>
              <Text fontSize="xs" color="gray.500">
                Showing audit events for this firm.
              </Text>
            </Stack>
          </HStack>
        )}
      </Box>

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
          emptyDescription="This firm does not have any recorded audit activity yet."
        />
      ) : (
        <>
          <AuditLogsTimeline logs={logs} onViewDetails={handleViewDetails} />

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

export default FirmAuditLogs;
