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
import { useGlobalDashboard } from "../components/dashboard/useGlobalDashboard";

// ============================================================
// Skeleton Loaders
// ============================================================

const KpiCardSkeleton = () => (
  <Box
    px={5}
    py={4}
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="lg"
  >
    <HStack justify="space-between" mb={2}>
      <Stack gap={1.5} flex={1}>
        <Box h="8px" w="70px" bg="gray.100" borderRadius="sm" />
        <Box h="24px" w="40px" bg="gray.100" borderRadius="sm" />
      </Stack>
      <Box w="4" h="4" bg="gray.100" borderRadius="sm" />
    </HStack>
    <Box h="8px" w="80px" bg="gray.100" borderRadius="sm" mb={1} />
    <Box h="32px" w="100%" bg="gray.50" borderRadius="sm" />
  </Box>
);

const SectionSkeleton = () => (
  <Box
    p={5}
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="lg"
  >
    <Stack gap={3}>
      <Box h="12px" w="100px" bg="gray.100" borderRadius="sm" />
      <HStack gap={3}>
        {[1, 2, 3, 4].map((i) => (
          <Box key={i} flex={1} h="48px" bg="gray.50" borderRadius="sm" />
        ))}
      </HStack>
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
  <Stack gap={3} align="center" py={16} textAlign="center">
    <Box
      w="10"
      h="10"
      borderRadius="full"
      bg="red.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <XOctagon size={20} color="#dc2626" />
    </Box>
    <Stack gap={0.5}>
      <Text fontSize="sm" fontWeight="600" color="gray.900">
        Unable to load dashboard
      </Text>
      <Text fontSize="xs" color="gray.500" maxW="320px">
        {message || "Something went wrong while loading the platform overview."}
      </Text>
    </Stack>
    <Button variant="outline" size="xs" onClick={onRetry}>
      Try again
    </Button>
  </Stack>
);

const ForbiddenState = () => (
  <Stack gap={3} align="center" py={16} textAlign="center">
    <Box
      w="10"
      h="10"
      borderRadius="full"
      bg="amber.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <XOctagon size={20} color="#d97706" />
    </Box>
    <Stack gap={0.5}>
      <Text fontSize="sm" fontWeight="600" color="gray.900">
        Access restricted
      </Text>
      <Text fontSize="xs" color="gray.500">
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

  // Build sparkline data from real trend data
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
      <Stack gap={5}>
        {/* Header skeleton */}
        <HStack justify="space-between" flexWrap="wrap" gap={3}>
          <Stack gap={1}>
            <Box h="22px" w="180px" bg="gray.100" borderRadius="sm" />
            <Box h="12px" w="300px" bg="gray.100" borderRadius="sm" />
          </Stack>
          <Box h="28px" w="90px" bg="gray.100" borderRadius="sm" />
        </HStack>

        {/* KPI skeletons */}
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={3}
        >
          {[1, 2, 3, 4].map((i) => (
            <KpiCardSkeleton key={i} />
          ))}
        </Grid>

        {/* Distribution + Events skeleton */}
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={4}>
          <SectionSkeleton />
          <SectionSkeleton />
        </Grid>

        {/* Firm + Case skeleton */}
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={4}>
          <SectionSkeleton />
          <SectionSkeleton />
        </Grid>

        {/* Scraper + Activity skeleton */}
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={4}>
          <SectionSkeleton />
          <SectionSkeleton />
        </Grid>
      </Stack>
    );
  }

  if (isForbidden) {
    return (
      <Stack gap={5}>
        <ForbiddenState />
      </Stack>
    );
  }

  if (isError) {
    return (
      <Stack gap={5}>
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
      icon: <Users size={16} />,
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
      icon: <Activity size={16} />,
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
      icon: <Users size={16} />,
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
      icon: <Users size={16} />,
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
    <Stack gap={5}>
      {/* ==================== HEADER ==================== */}
      <HStack
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={3}
      >
        <Stack gap={0.5}>
          <Text fontSize="xl" fontWeight="700" color="gray.900">
            Global Dashboard
          </Text>
          <Text fontSize="sm" color="gray.500">
            Monitor users, firms, matters and court data from one place.
          </Text>
        </Stack>
        <HStack gap={2}>
          <HStack gap={1.5}>
            <Calendar size={13} color="gray.400" />
            <FieldSelect
              size="sm"
              value={String(days)}
              onChange={(val) => setDays(Number(val))}
              w="100px"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </FieldSelect>
          </HStack>
          <Button
            variant="ghost"
            size="xs"
            onClick={handleRefresh}
            disabled={isFetching}
            color="gray.600"
            _hover={{ bg: "gray.100" }}
          >
            {isFetching ? (
              <Spinner size="xs" color="gray.400" />
            ) : (
              <RefreshCw size={13} />
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
        gap={3}
      >
        {kpiCards.map((card) => (
          <DashboardKpiCard key={card.label} {...card} />
        ))}
      </Grid>

      {/* ==================== USER DISTRIBUTION + TODAY'S EVENTS ==================== */}
      <Grid
        templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
        gap={4}
        alignItems="start"
      >
        <UserRoleDistribution stats={userStats} />
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)"
          p={5}
        >
          <TodaysEvents count={caseStats.todayEvents} />
        </Box>
      </Grid>

      {/* ==================== FIRM + CASE OVERVIEW ==================== */}
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={4}
        alignItems="start"
      >
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)"
          p={5}
        >
          <HStack gap={2} mb={4}>
            <Box
              w="6"
              h="6"
              borderRadius="md"
              bg="blue.50"
              color="blue.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Building2 size={13} />
            </Box>
            <Text fontSize="sm" fontWeight="600" color="gray.900">
              Firm Overview
            </Text>
          </HStack>
          <FirmOverview data={firmStats} />
        </Box>

        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)"
          p={5}
        >
          <HStack gap={2} mb={4}>
            <Box
              w="6"
              h="6"
              borderRadius="md"
              bg="teal.50"
              color="teal.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FileText size={13} />
            </Box>
            <Text fontSize="sm" fontWeight="600" color="gray.900">
              Case Overview
            </Text>
          </HStack>
          <CaseOverview data={caseStats} trends={matterTrends} />
        </Box>
      </Grid>

      {/* ==================== SCRAPER STATUS + RECENT ACTIVITY ==================== */}
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={4}
        alignItems="start"
      >
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)"
          p={5}
        >
          <ScraperStatus stats={scraperStats} />
        </Box>

        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)"
          p={5}
          h="360px"
          display="flex"
          flexDirection="column"
          overflow="hidden"
        >
          <RecentActivity activities={recentActivity} compact />
        </Box>
      </Grid>
    </Stack>
  );
};

export default GlobalDashboardPage;
