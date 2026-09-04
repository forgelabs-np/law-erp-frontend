import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CreditCard,
  FileText,
  FolderKanban,
  Gavel,
  History,
  KeyRound,
  LayoutGrid,
  Lock,
  Mail,
  Receipt,
  RefreshCw,
  Scale,
  Settings,
  Shield,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useEntityHistoryQuery } from "@/api/auditLogs.ts";
import { Tooltip } from "@/shared/components/ui";
import { ROUTES_CONFIG } from "@/shared/config";

import { AUDIT_ENTITY_TYPES, AuditLog, EntityType } from "./types";
import { formatEntityTypeLabel } from "./utils";
import { useAuditLogFilters } from "./useAuditLogFilters";
import { AuditLogsTimeline } from "./components/AuditLogsTimeline";
import { AuditLogDetailsDrawer } from "./components/AuditLogDetailsDrawer";
import { AuditLogsSkeleton } from "./components/AuditLogsSkeleton";
import { AuditLogsEmptyState } from "./components/AuditLogsEmptyState";
import { AuditLogsErrorState } from "./components/AuditLogsErrorState";
import { AuditLogsPagination } from "./components/AuditLogsPagination";

const ENTITY_TYPE_ICONS: Partial<Record<EntityType, typeof History>> = {
  USER: UserIcon,
  CLIENT: UserIcon,
  FIRM: Building2,
  FIRM_MODULE: LayoutGrid,
  ROLE: Shield,
  ROLE_PERMISSION: ShieldCheck,
  PERMISSION: ShieldCheck,
  MODULE: LayoutGrid,
  CASE: Briefcase,
  DOCUMENT: FileText,
  INVOICE: Receipt,
  PAYMENT: CreditCard,
  HEARING: Gavel,
  DEPARTMENT: Building2,
  AUTH: Lock,
  MATTER: Briefcase,
  COURT_CASE: Scale,
  COURT_EVENT: Calendar,
  EMAIL_CONFIG: Mail,
  SYSTEM_CONFIG: Settings,
  PROJECT: FolderKanban,
  CREDENTIAL: KeyRound,
  RENEWAL: RefreshCw,
};

/**
 * Generic entity audit history (GET /super-admin/audit/entities/{entityType}/{entityId}).
 * Works for any supported entity type — no per-entity components needed.
 */
const EntityHistory = () => {
  const { entityType, entityId } = useParams<{
    entityType: string;
    entityId: string;
  }>();
  const navigate = useNavigate();
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const normalizedType = (entityType ?? "").toUpperCase();
  const isSupportedType =
    AUDIT_ENTITY_TYPES.includes(normalizedType as EntityType) &&
    normalizedType !== "";

  const {
    filters,
    hasFilters,
    handleReset,
    handlePageChange,
    handlePageSizeChange,
  } = useAuditLogFilters();

  const {
    data: auditData,
    isLoading,
    error,
    refetch,
  } = useEntityHistoryQuery(
    isSupportedType ? normalizedType : "",
    entityId ?? "",
    filters
  );

  const EntityIcon = isSupportedType
    ? (ENTITY_TYPE_ICONS[normalizedType as EntityType] ?? History)
    : History;

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
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} />
        Back
      </Button>

      {/* Header */}
      <Stack gap={2}>
        <Text textStyle="heading_4">Entity History</Text>
        <Text textStyle="paragraph_regular" color="gray.500">
          Audit trail recorded against this entity
        </Text>
      </Stack>

      {/* Entity context */}
      {isSupportedType ? (
        <Box
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.200"
          p={4}
        >
          <HStack gap={4} flexWrap={{ base: "wrap", md: "nowrap" }}>
            <HStack gap={3} flex={1} minW={0}>
              <Box bg="blue.800" borderRadius="lg" p={2.5} flexShrink={0}>
                <EntityIcon size={18} color="white" />
              </Box>
              <Stack gap={0} minW={0}>
                <Text fontWeight="600" fontSize="sm" color="gray.800">
                  {formatEntityTypeLabel(normalizedType)}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Audit history for this{" "}
                  {formatEntityTypeLabel(normalizedType).toLowerCase()}
                </Text>
              </Stack>
            </HStack>
            <Box>
              <Text fontSize="xs" color="gray.500">
                {formatEntityTypeLabel(normalizedType)} ID
              </Text>
              <Tooltip content={entityId ?? ""}>
                <Text
                  fontSize="xs"
                  color="gray.600"
                  fontFamily="mono"
                  maxW="180px"
                  truncate
                >
                  {entityId}
                </Text>
              </Tooltip>
            </Box>
          </HStack>
        </Box>
      ) : (
        <Box
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.200"
          p={4}
        >
          <HStack gap={3}>
            <Box bg="gray.100" borderRadius="lg" p={2.5}>
              <History size={18} color="gray.600" />
            </Box>
            <Stack gap={0}>
              <Text fontSize="sm" fontWeight="600" color="gray.700">
                {entityType || "Missing entity type"}
              </Text>
              <Text fontSize="xs" color="gray.500">
                This entity type is not supported for audit history.
              </Text>
            </Stack>
          </HStack>
        </Box>
      )}

      {/* Content — only fetched for supported entity types */}
      {!isSupportedType ? null : isLoading ? (
        <AuditLogsSkeleton />
      ) : error ? (
        <AuditLogsErrorState
          title="Failed to Load Entity History"
          description="There was an error loading the audit history for this entity. Please try again."
          onRetry={() => refetch()}
        />
      ) : logs.length === 0 ? (
        <AuditLogsEmptyState
          hasFilters={hasFilters}
          onResetFilters={handleReset}
          title="No History Found"
          emptyDescription="This entity does not have any recorded audit activity."
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

export default EntityHistory;
