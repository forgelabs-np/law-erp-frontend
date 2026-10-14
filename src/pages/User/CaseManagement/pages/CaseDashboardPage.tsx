import {
  Box,
  Button,
  HStack,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { FileText, Plus, RefreshCw, XOctagon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useFirmDashboardQuery } from "../api/dashboard.api";
import { useModulePermissions } from "@/shared/hooks/usePermissions";
import { ApiErrorResponse } from "@/shared/types/response";

import { CaseDashboardLayout } from "../components/dashboard/CaseDashboardLayout";
import { CasePositioningSection } from "../components/dashboard/CasePositioningSection";
import { ContextualHelpCard } from "../components/dashboard/ContextualHelpCard";
import { CourtEventsPanel } from "../components/dashboard/CourtEventsPanel";
import { DashboardStatsPanel } from "../components/dashboard/DashboardStatsPanel";
import { StaleMattersPanel } from "../components/dashboard/StaleMattersPanel";

// ============================================================
// Error & Forbidden States
// ============================================================

interface DashboardErrorProps {
  message: string;
  onRetry: () => void;
}

const DashboardError = ({ message, onRetry }: DashboardErrorProps) => (
  <Stack gap={4} align="center" py={16} textAlign="center">
    <Box
      w="16"
      h="16"
      borderRadius="full"
      bg="red.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <XOctagon size={28} color="#dc2626" />
    </Box>
    <Stack gap={1}>
      <Text fontSize="lg" fontWeight="600" color="gray.900">
        Unable to load dashboard
      </Text>
      <Text fontSize="sm" color="gray.500" maxW="400px">
        {message || "Something went wrong while loading your dashboard."}
      </Text>
    </Stack>
    <Button variant="outline" size="sm" onClick={onRetry}>
      Try again
    </Button>
  </Stack>
);

const ForbiddenState = () => (
  <Stack gap={4} align="center" py={16} textAlign="center">
    <Box
      w="16"
      h="16"
      borderRadius="full"
      bg="amber.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <XOctagon size={28} color="#d97706" />
    </Box>
    <Stack gap={1}>
      <Text fontSize="lg" fontWeight="600" color="gray.900">
        Access restricted
      </Text>
      <Text fontSize="sm" color="gray.500">
        You don't have permission to view this dashboard.
      </Text>
    </Stack>
  </Stack>
);

// ============================================================
// Skeleton Loader for Dashboard
// ============================================================

const DashboardSkeleton = () => (
  <CaseDashboardLayout
    leftContent={
      <Stack gap={4} w="100%">
        <Skeleton h="54px" borderRadius="xl" />
        <Skeleton h="360px" borderRadius="xl" />
      </Stack>
    }
    rightContent={
      <Stack gap={5} w="100%">
        <Skeleton h="240px" borderRadius="xl" />
        <Skeleton h="160px" borderRadius="xl" />
        <Skeleton h="160px" borderRadius="xl" />
      </Stack>
    }
  />
);

// ============================================================
// Main Component
// ============================================================

const CaseDashboardPage = () => {
  const navigate = useNavigate();
  const { canCreate } = useModulePermissions("CASE_MANAGEMENT");

  const {
    data: dashboard,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFirmDashboardQuery();

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const isForbidden = useMemo(() => {
    if (!isError || !error) return false;
    if (axios.isAxiosError(error)) {
      return error.response?.status === 403;
    }
    return false;
  }, [isError, error]);

  const errorMessage = useMemo(() => {
    if (!isError || !error) return "";
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as
        | { message?: string; error?: { errorMessage?: string } }
        | undefined;
      return data?.message ?? data?.error?.errorMessage ?? "";
    }
    return error instanceof Error ? error.message : "";
  }, [isError, error]);

  const stats = dashboard?.stats;
  const todayEvents = dashboard?.todayEvents ?? [];
  const casePositioning = dashboard?.casePositioning ?? [];
  const staleCases = dashboard?.staleCases ?? [];

  return (
    <Stack gap={6} padding={{ base: 2, md: 3 }} w="100%" maxW="100%" minW={0}>
      {/* ==================== PAGE HEADER ==================== */}
      <HStack
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={4}
        w="100%"
      >
        <Stack gap={1} minW={0}>
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="700"
            color="gray.900"
            letterSpacing="-0.02em"
          >
            Case Management
          </Text>
          <Text fontSize="xs" color="gray.500">
            Overview of your firm's matters, hearings, and court positioning.
          </Text>
        </Stack>

        <HStack gap={2.5} flexWrap="wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
            color="gray.600"
            _hover={{ bg: "gray.100" }}
          >
            {isFetching ? <Spinner size="xs" /> : <RefreshCw size={14} />}
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/cases")}
            color="gray.700"
            borderColor="gray.200"
            _hover={{ bg: "gray.50", borderColor: "gray.300" }}
          >
            <FileText size={14} />
            View All Matters
          </Button>

          {canCreate && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("/cases/create")}
            >
              <Plus size={15} color="white" />
              New Matter
            </Button>
          )}
        </HStack>
      </HStack>

      {/* ==================== CONTENT BODY ==================== */}
      {isForbidden ? (
        <ForbiddenState />
      ) : isError ? (
        <DashboardError message={errorMessage} onRetry={handleRefresh} />
      ) : isLoading ? (
        <DashboardSkeleton />
      ) : (
        <CaseDashboardLayout
          leftContent={
            <CasePositioningSection
              matters={casePositioning}
              todayEvents={todayEvents}
              isLoading={isLoading}
            />
          }
          rightContent={
            <>
              <DashboardStatsPanel stats={stats} isLoading={isLoading} />
              <CourtEventsPanel events={todayEvents} isLoading={isLoading} />
              <StaleMattersPanel
                matters={staleCases}
                staleCount={stats?.staleCount}
                isLoading={isLoading}
              />
              <ContextualHelpCard />
            </>
          }
        />
      )}
    </Stack>
  );
};

export default CaseDashboardPage;
