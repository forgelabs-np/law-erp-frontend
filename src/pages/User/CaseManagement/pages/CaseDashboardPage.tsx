import {
  Box,
  Button,
  Grid,
  HStack,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  FileText,
  Plus,
  RefreshCw,
  XOctagon,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useFirmDashboardQuery } from "../api/dashboard.api";
import { useModulePermissions } from "@/shared/hooks/usePermissions";
import { TodaysCourtEvents } from "../components/dashboard/TodaysCourtEvents";
import { CasePositioningSection } from "../components/dashboard/CasePositioning";
import { StaleMatters } from "../components/dashboard/StaleMatters";

// ============================================================
// Metric Card
// ============================================================

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

const MetricCard = ({
  label,
  value,
  icon,
  color,
  onClick,
}: MetricCardProps) => (
  <Box
    p={5}
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="lg"
    cursor={onClick ? "pointer" : "default"}
    onClick={onClick}
    _hover={onClick ? { borderColor: "blue.300", boxShadow: "md" } : undefined}
    transition="all 0.15s ease"
  >
    <HStack justify="space-between" align="flex-start">
      <Stack gap={1}>
        <Text fontSize="sm" fontWeight="500" color="gray.500">
          {label}
        </Text>
        <Text fontSize="3xl" fontWeight="700" color="gray.900">
          {value}
        </Text>
      </Stack>
      <Box
        w="10"
        h="10"
        borderRadius="lg"
        bg={`${color}.100`}
        color={`${color}.600`}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {icon}
      </Box>
    </HStack>
  </Box>
);

// ============================================================
// Skeleton Loaders
// ============================================================

const MetricCardSkeleton = () => (
  <Box
    p={5}
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="lg"
  >
    <HStack justify="space-between">
      <Stack gap={2} flex={1}>
        <Box h="12px" w="80px" bg="gray.100" borderRadius="md" />
        <Box h="32px" w="50px" bg="gray.100" borderRadius="md" />
      </Stack>
      <Box w="10" h="10" borderRadius="lg" bg="gray.100" />
    </HStack>
  </Box>
);

// ============================================================
// Error State
// ============================================================

const DashboardError = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
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
    const axiosError = error as any;
    return axiosError?.response?.status === 403;
  }, [isError, error]);

  const errorMessage = useMemo(() => {
    if (!isError || !error) return "";
    const axiosError = error as any;
    return (
      axiosError?.response?.data?.message ??
      axiosError?.response?.data?.error?.errorMessage ??
      ""
    );
  }, [isError, error]);

  const stats = dashboard?.stats;
  const todayEvents = dashboard?.todayEvents ?? [];
  const casePositioning = dashboard?.casePositioning ?? [];
  const staleCases = dashboard?.staleCases ?? [];

  // Loading state
  if (isLoading) {
    return (
      <Stack gap={6} padding={2}>
        <HStack justify="space-between" flexWrap="wrap" gap={4}>
          <Stack gap={2}>
            <Box h="28px" w="220px" bg="gray.100" borderRadius="md" />
            <Box h="16px" w="360px" bg="gray.100" borderRadius="md" />
          </Stack>
        </HStack>
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={4}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </Grid>
        <TodaysCourtEvents events={[]} isLoading />
      </Stack>
    );
  }

  if (isForbidden) {
    return (
      <Stack gap={6} padding={2}>
        <ForbiddenState />
      </Stack>
    );
  }

  if (isError) {
    return (
      <Stack gap={6} padding={2}>
        <DashboardError message={errorMessage} onRetry={handleRefresh} />
      </Stack>
    );
  }

  return (
    <Stack gap={6} padding={2}>
      {/* ==================== HEADER ==================== */}
      <HStack
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={4}
      >
        <Stack gap={2}>
          <Text textStyle="heading_4">Case Management</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            Overview of your firm's matters, hearings and case activity.
          </Text>
        </Stack>
        <HStack gap={2}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            {isFetching ? <Spinner size="sm" /> : <RefreshCw size={16} />}
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
          <Button variant="outline" onClick={() => navigate("/cases")}>
            View All Matters
          </Button>
          <Button variant="ghost" onClick={() => navigate("/stale-matters")}>
            Stale Matters
          </Button>
          {canCreate && (
            <Button variant="primary" onClick={() => navigate("/cases/create")}>
              <Plus size={16} color="white" /> New Matter
            </Button>
          )}
        </HStack>
      </HStack>

      {/* ==================== SUMMARY SECTION ==================== */}
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
          xl: "repeat(6, 1fr)",
        }}
        gap={4}
      >
        <MetricCard
          label="Total Matters"
          value={stats?.totalMatters ?? 0}
          icon={<FileText size={20} />}
          color="blue"
          onClick={() => navigate("/cases")}
        />
        <MetricCard
          label="Active Matters"
          value={stats?.activeMatters ?? 0}
          icon={<Activity size={20} />}
          color="green"
          onClick={() => navigate("/cases")}
        />
        <MetricCard
          label="Dormant Matters"
          value={stats?.dormantMatters ?? 0}
          icon={<FileText size={20} />}
          color="gray"
          onClick={() => navigate("/cases")}
        />
        <MetricCard
          label="Closed Matters"
          value={stats?.closedMatters ?? 0}
          icon={<FileText size={20} />}
          color="gray"
          onClick={() => navigate("/cases")}
        />
        <MetricCard
          label="Today's Events"
          value={stats?.todayEventsCount ?? 0}
          icon={<CalendarDays size={20} />}
          color="purple"
          onClick={() => navigate("/task-calendar")}
        />
        <MetricCard
          label="Stale Matters"
          value={stats?.staleCount ?? 0}
          icon={<AlertTriangle size={20} />}
          color="amber"
          onClick={() => navigate("/stale-matters")}
        />
      </Grid>

      {/* ==================== TODAY'S COURT EVENTS ==================== */}
      <TodaysCourtEvents events={todayEvents} />

      {/* ==================== CASE POSITIONING + STALE MATTERS ==================== */}
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "minmax(0, 1.8fr) minmax(320px, 1fr)",
        }}
        gap={6}
        alignItems="start"
      >
        <CasePositioningSection matters={casePositioning} />
        <StaleMatters matters={staleCases} />
      </Grid>
    </Stack>
  );
};

export default CaseDashboardPage;
