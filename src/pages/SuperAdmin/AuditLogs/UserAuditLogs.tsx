import {
  Badge,
  Box,
  Button,
  HStack,
  Skeleton,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useUserAuditLogsQuery } from "@/api/auditLogs.ts";
import { useUserProfileQuery, UserResponseType } from "@/api/userManagement";
import { Avatar, Tooltip } from "@/shared/components/ui";
import { ROUTES_CONFIG } from "@/shared/config";

import { AuditLog } from "./types";
import { useAuditLogFilters } from "./useAuditLogFilters";
import { AuditLogsFilters } from "./components/AuditLogsFilters";
import { AuditLogsTimeline } from "./components/AuditLogsTimeline";
import { AuditLogDetailsDrawer } from "./components/AuditLogDetailsDrawer";
import { AuditLogsSkeleton } from "./components/AuditLogsSkeleton";
import { AuditLogsEmptyState } from "./components/AuditLogsEmptyState";
import { AuditLogsErrorState } from "./components/AuditLogsErrorState";
import { AuditLogsPagination } from "./components/AuditLogsPagination";

/**
 * Super Admin view of the audit trail for a single user
 * (GET /super-admin/audit/users/{userId}).
 *
 * User context comes from navigation state when arriving from User
 * Management; on direct visits/refresh the existing profile query fills in
 * the same fields. If neither is available the page stays functional and
 * only shows the user ID.
 */
const UserAuditLogs = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const userFromState = (location.state as { user?: UserResponseType })?.user;

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useUserProfileQuery(userFromState ? "" : (userId ?? ""));

  const userContext = userFromState ?? profile;

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
  } = useUserAuditLogsQuery(userId ?? "", filters);

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
        onClick={() => navigate(ROUTES_CONFIG.USER.USER_MANAGEMENT)}
      >
        <ArrowLeft size={16} />
        Back to Users
      </Button>

      {/* Header */}
      <Stack gap={2}>
        <Text textStyle="heading_4">User Audit History</Text>
        <Text textStyle="paragraph_regular" color="gray.500">
          Audit events recorded for this user across the platform
        </Text>
      </Stack>

      {/* User context */}
      <Box
        bg="white"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.200"
        p={4}
      >
        {isProfileLoading && !userContext ? (
          <HStack gap={4}>
            <Skeleton boxSize="40px" borderRadius="full" />
            <Stack gap={2} flex={1}>
              <Skeleton height="16px" width="180px" />
              <Skeleton height="12px" width="240px" />
            </Stack>
          </HStack>
        ) : userContext ? (
          <HStack gap={4} flexWrap={{ base: "wrap", md: "nowrap" }}>
            <HStack gap={3} flex={1} minW={0}>
              <Avatar
                name={userContext.fullName}
                size="md"
                colorPalette="blue"
              />
              <Stack gap={0} minW={0}>
                <HStack gap={2} flexWrap="wrap">
                  <Text fontWeight="600" fontSize="sm" color="gray.800">
                    {userContext.fullName}
                  </Text>
                  {userContext.isActive !== undefined && (
                    <Badge
                      bg={userContext.isActive ? "green.100" : "red.100"}
                      color={userContext.isActive ? "green.700" : "red.700"}
                      px="2"
                      py="0.5"
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="600"
                    >
                      {userContext.isActive ? "Active" : "Inactive"}
                    </Badge>
                  )}
                </HStack>
                <Text fontSize="xs" color="gray.500" truncate>
                  {[userContext.email, `@${userContext.username}`]
                    .filter(Boolean)
                    .join(" · ")}
                </Text>
              </Stack>
            </HStack>
            <HStack gap={4} flexWrap="wrap">
              <Box>
                <Text fontSize="xs" color="gray.500">
                  User Type
                </Text>
                <Badge
                  bg="blue.100"
                  color="blue.700"
                  px="2"
                  py="0.5"
                  borderRadius="md"
                  fontSize="xs"
                  fontWeight="600"
                >
                  {userContext.userType}
                </Badge>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500">
                  User ID
                </Text>
                <Tooltip content={userId ?? ""}>
                  <Text
                    fontSize="xs"
                    color="gray.600"
                    fontFamily="mono"
                    maxW="140px"
                    truncate={true}
                  >
                    {userId}
                  </Text>
                </Tooltip>
              </Box>
            </HStack>
          </HStack>
        ) : isProfileError ? (
          <HStack gap={3}>
            <Box bg="gray.100" borderRadius="full" p={2.5}>
              <UserIcon size={18} color="gray.600" />
            </Box>
            <Stack gap={0}>
              <Text fontSize="sm" fontWeight="600" color="gray.700">
                User #{userId}
              </Text>
              <Text fontSize="xs" color="gray.500">
                User details are unavailable for this account.
              </Text>
            </Stack>
          </HStack>
        ) : (
          <HStack gap={3}>
            <Box bg="gray.100" borderRadius="full" p={2.5}>
              <UserIcon size={18} color="gray.600" />
            </Box>
            <Stack gap={0}>
              <Text fontSize="sm" fontWeight="600" color="gray.700">
                User #{userId}
              </Text>
              <Text fontSize="xs" color="gray.500">
                Showing audit events for this user.
              </Text>
            </Stack>
          </HStack>
        )}
      </Box>

      {/* Filters */}
      <AuditLogsFilters
        showAction={false}
        onReset={handleReset}
        onApply={handleApplyFilters}
        onFilterChange={handleFilterChange}
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
          emptyDescription="This user does not have any recorded audit activity yet."
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

export default UserAuditLogs;
