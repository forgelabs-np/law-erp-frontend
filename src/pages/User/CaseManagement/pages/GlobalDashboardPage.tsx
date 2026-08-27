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
  Building2,
  Calendar,
  FileText,
  RefreshCw,
  Users,
  XOctagon,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { FieldSelect } from "../components/ui";

import { DashboardKpiCard } from "../components/dashboard/DashboardKpiCard";
import { UserRoleDistribution } from "../components/dashboard/UserRoleDistribution";
import { FirmOverview } from "../components/dashboard/FirmOverview";
import { CaseOverview } from "../components/dashboard/CaseOverview";
import { ScraperStatus } from "../components/dashboard/ScraperStatus";
import { RecentActivity } from "../components/dashboard/RecentActivity";
import { TodaysEvents } from "../components/dashboard/TodaysEvents";
import { QuickInsights } from "../components/dashboard/QuickInsights";
import { ReportCta } from "../components/dashboard/ReportCta";
import { useGlobalDashboard } from "../components/dashboard/useGlobalDashboard";
import { getDashboardInsights } from "../components/dashboard/dashboardInsights";

// ============================================================
// Skeleton Loaders
// ============================================================

const KpiCardSkeleton = () => (
  <Box
    p={5}
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="xl"
  >
    <HStack justify="space-between" mb={3}>
      <Stack gap={2} flex={1}>
        <Box h="10px" w="80px" bg="gray.100" borderRadius="md" />
        <Box h="32px" w="50px" bg="gray.100" borderRadius="md" />
      </Stack>
      <Box w="10" h="10" borderRadius="lg" bg="gray.100" />
    </HStack>
    <Box h="10px" w="100px" bg="gray.100" borderRadius="md" mb={2} />
    <Box h="40px" w="100%" bg="gray.50" borderRadius="md" />
  </Box>
);

const ChartSkeleton = () => (
  <Box
    p={6}
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="xl"
  >
    <Stack gap={4}>
      <HStack gap={3}>
        <Box w="8" h="8" borderRadius="lg" bg="gray.100" />
        <Box h="14px" w="120px" bg="gray.100" borderRadius="md" />
      </HStack>
      <HStack gap={3}>
        {[1, 2, 3].map((i) => (
          <Box key={i} flex={1} h="60px" bg="gray.50" borderRadius="md" />
        ))}
      </HStack>
      <Box h="180px" w="100%" bg="gray.50" borderRadius="md" />
    </Stack>
  </Box>
);

const ScraperStatusSkeleton = () => (
  <Box
    p={6}
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="xl"
  >
    <Stack gap={4}>
      <HStack gap={3}>
        <Box w="8" h="8" borderRadius="lg" bg="gray.100" />
        <Box h="14px" w="100px" bg="gray.100" borderRadius="md" />
      </HStack>
      <Box h="32px" w="140px" bg="gray.100" borderRadius="lg" />
      <HStack gap={2}>
        {[1, 2, 3, 4].map((i) => (
          <Box key={i} flex={1} h="72px" bg="gray.50" borderRadius="lg" />
        ))}
      </HStack>
      <Box h="12px" w="160px" bg="gray.100" borderRadius="md" />
      <Box h="28px" w="140px" bg="gray.100" borderRadius="lg" />
    </Stack>
  </Box>
);

const RecentActivitySkeleton = () => (
  <Box
    p={6}
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="xl"
  >
    <Stack gap={3}>
      <HStack gap={3}>
        <Box w="8" h="8" borderRadius="lg" bg="gray.100" />
        <Box h="14px" w="120px" bg="gray.100" borderRadius="md" />
      </HStack>
      {[1, 2, 3, 4].map((i) => (
        <HStack key={i} gap={3} py={3}>
          <Box w="8" h="8" borderRadius="lg" bg="gray.100" flexShrink={0} />
          <Stack gap={1.5} flex={1}>
            <Box h="12px" w="140px" bg="gray.100" borderRadius="md" />
            <Box h="10px" w="220px" bg="gray.50" borderRadius="md" />
          </Stack>
          <Box h="10px" w="50px" bg="gray.100" borderRadius="md" />
        </HStack>
      ))}
    </Stack>
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
        {message || "Something went wrong while loading the platform overview."}
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
        You don't have permission to view the platform overview.
      </Text>
    </Stack>
  </Stack>
);

// ============================================================
// Main Component
// ============================================================

const GlobalDashboardPage = () => {
  const [days, setDays] = useState(30);
  const { computedData, isLoading, isError, error, refetch, isFetching } =
    useGlobalDashboard(days);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const isForbidden = useMemo(() => {
    if (!isError || !error) return false;
    const axiosError = error as { response?: { status?: number } };
    return axiosError?.response?.status === 403;
  }, [isError, error]);

  const errorMessage = useMemo(() => {
    if (!isError || !error) return "";
    const axiosError = error as {
      response?: {
        data?: { message?: string; error?: { errorMessage?: string } };
      };
    };
    return (
      axiosError?.response?.data?.message ??
      axiosError?.response?.data?.error?.errorMessage ??
      ""
    );
  }, [isError, error]);

  const insights = useMemo(
    () => getDashboardInsights(computedData),
    [computedData]
  );

  // Build sparkline data from real trend data (must be before early returns)
  const userTrendsData = useMemo(
    () => computedData?.userTrends ?? [],
    [computedData]
  );
  const totalUsersSparkline = useMemo(
    () => userTrendsData.map((t) => t.totalUsers),
    [userTrendsData]
  );
  const activeUsersSparkline = useMemo(
    () => userTrendsData.map((t) => t.activeUsers),
    [userTrendsData]
  );
  const inactiveUsersSparkline = useMemo(
    () => userTrendsData.map((t) => t.inactiveUsers),
    [userTrendsData]
  );
  const clientsSparkline = useMemo(
    () => userTrendsData.map((t) => t.clients),
    [userTrendsData]
  );

  // Loading state
  if (isLoading) {
    return (
      <Stack gap={6} padding={2}>
        {/* Header skeleton */}
        <HStack justify="space-between" flexWrap="wrap" gap={4}>
          <Stack gap={2}>
            <Box h="28px" w="220px" bg="gray.100" borderRadius="md" />
            <Box h="14px" w="360px" bg="gray.100" borderRadius="md" />
          </Stack>
          <Box h="32px" w="100px" bg="gray.100" borderRadius="md" />
        </HStack>

        {/* KPI skeletons */}
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={4}
        >
          {[1, 2, 3, 4].map((i) => (
            <KpiCardSkeleton key={i} />
          ))}
        </Grid>

        {/* Distribution + Events skeleton */}
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
          <Box
            p={5}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="xl"
          >
            <Stack gap={3}>
              <Box h="14px" w="120px" bg="gray.100" borderRadius="md" />
              <Box h="8px" w="100%" bg="gray.100" borderRadius="full" />
              <HStack gap={4}>
                {[1, 2, 3, 4].map((i) => (
                  <Box
                    key={i}
                    h="12px"
                    w="80px"
                    bg="gray.100"
                    borderRadius="md"
                  />
                ))}
              </HStack>
            </Stack>
          </Box>
          <ChartSkeleton />
        </Grid>

        {/* Chart skeletons */}
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
          <ChartSkeleton />
          <ChartSkeleton />
        </Grid>

        {/* Scraper + Recent Activity skeletons */}
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
          <ScraperStatusSkeleton />
          <RecentActivitySkeleton />
        </Grid>
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

  if (!computedData) return null;

  const {
    userStats,
    firmStats,
    caseStats,
    scraperStats,
    recentActivity,
    matterTrends,
  } = computedData;

  // KPI card data
  const kpiCards = [
    {
      label: "Total Users",
      value: userStats.totalUsers,
      icon: <Users size={20} />,
      color: "gray",
      sparklineColor: "#6b7280",
      sparklineData:
        totalUsersSparkline.length > 0
          ? totalUsersSparkline
          : [userStats.totalUsers],
      trend: { value: 0, label: `Last ${days} days` },
    },
    {
      label: "Active Users",
      value: userStats.activeUsers,
      icon: <Activity size={20} />,
      color: "green",
      sparklineColor: "#10b981",
      sparklineData:
        activeUsersSparkline.length > 0
          ? activeUsersSparkline
          : [userStats.activeUsers],
      trend: { value: 0, label: `Last ${days} days` },
    },
    {
      label: "Inactive Users",
      value: userStats.inactiveUsers,
      icon: <Users size={20} />,
      color: "red",
      sparklineColor: "#ef4444",
      sparklineData:
        inactiveUsersSparkline.length > 0
          ? inactiveUsersSparkline
          : [userStats.inactiveUsers],
      trend:
        userStats.inactiveUsers === 0
          ? undefined
          : { value: 0, label: `Last ${days} days` },
    },
    {
      label: "Total Clients",
      value: userStats.totalClients,
      icon: <Users size={20} />,
      color: "purple",
      sparklineColor: "#8b5cf6",
      sparklineData:
        clientsSparkline.length > 0
          ? clientsSparkline
          : [userStats.totalClients],
      trend: { value: 0, label: `Last ${days} days` },
    },
  ];

  return (
    <Stack gap={6} padding={2}>
      {/* ==================== HEADER ==================== */}
      <HStack
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={4}
      >
        <Stack gap={1}>
          <Text fontSize="xl" fontWeight="700" color="gray.900">
            Global Dashboard
          </Text>
          <Text fontSize="sm" color="gray.500">
            Monitor users, firms, matters and court data from one place.
          </Text>
        </Stack>
        <HStack gap={2}>
          <HStack gap={2}>
            <Calendar size={14} color="gray.400" />
            <FieldSelect
              size="sm"
              value={String(days)}
              onChange={(val) => setDays(Number(val))}
              w="110px"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </FieldSelect>
          </HStack>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
            color="green.600"
            _hover={{ bg: "green.50" }}
          >
            {isFetching ? (
              <Spinner size="sm" color="green.500" />
            ) : (
              <RefreshCw size={15} />
            )}
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
        </HStack>
      </HStack>

      {/* ==================== KPI CARDS ==================== */}
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={4}
      >
        {kpiCards.map((card) => (
          <DashboardKpiCard key={card.label} {...card} />
        ))}
      </Grid>

      {/* ==================== USER DISTRIBUTION + TODAY'S EVENTS ==================== */}
      <Grid
        templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
        gap={6}
        alignItems="start"
      >
        {/* User Distribution */}
        <UserRoleDistribution stats={userStats} />

        {/* Today's Events */}
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          p={5}
        >
          <TodaysEvents count={caseStats.todayEvents} />
        </Box>
      </Grid>

      {/* ==================== FIRM + CASE OVERVIEW ==================== */}
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={6}
        alignItems="start"
      >
        {/* Firm Overview */}
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          p={6}
        >
          <HStack gap={3} mb={5}>
            <Box
              w="8"
              h="8"
              borderRadius="lg"
              bg="blue.50"
              color="blue.600"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Building2 size={18} />
            </Box>
            <Text fontSize="lg" fontWeight="600" color="gray.900">
              Firm Overview
            </Text>
          </HStack>
          <FirmOverview data={firmStats} />
        </Box>

        {/* Case Overview */}
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          p={6}
        >
          <HStack gap={3} mb={5}>
            <Box
              w="8"
              h="8"
              borderRadius="lg"
              bg="green.50"
              color="green.600"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FileText size={18} />
            </Box>
            <Text fontSize="lg" fontWeight="600" color="gray.900">
              Case Overview
            </Text>
          </HStack>
          <CaseOverview data={caseStats} trends={matterTrends} />
        </Box>
      </Grid>

      {/* ==================== SCRAPER STATUS + RECENT ACTIVITY ==================== */}
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={6}
        alignItems="start"
      >
        {/* Scraper Status */}
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          p={6}
        >
          <ScraperStatus stats={scraperStats} />
        </Box>

        {/* Recent Activity — compact, scrollable */}
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          p={6}
          h="420px"
          display="flex"
          flexDirection="column"
          overflow="hidden"
        >
          <RecentActivity activities={recentActivity} compact />
        </Box>
      </Grid>

      {/* ==================== INSIGHTS + REPORT CTA ==================== */}
    </Stack>
  );
};

export default GlobalDashboardPage;
