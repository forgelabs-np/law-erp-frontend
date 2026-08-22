import {
  Badge,
  Box,
  Button,
  Grid,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  Activity,
  AlertTriangle,
  Building2,
  CalendarDays,
  Database,
  FileText,
  Globe,
  RefreshCw,
  Users,
  XOctagon,
} from "lucide-react";
import { useCallback, useMemo } from "react";

import { useGlobalDashboardQuery } from "../api/dashboard.api";
import {
  FirmStats,
  GlobalCaseStats,
  RecentActivity,
  ScraperStats,
  UserStats,
} from "../types/dashboard.types";

// ============================================================
// Metric Card
// ============================================================

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const MetricCard = ({ label, value, icon, color }: MetricCardProps) => (
  <Box
    p={5}
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="lg"
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
// Section Card
// ============================================================

const SectionCard = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number | string; color?: string }>;
  children: React.ReactNode;
}) => (
  <Box
    bg="white"
    borderRadius="xl"
    border="1px solid"
    borderColor="gray.200"
    boxShadow="sm"
    p={6}
  >
    <HStack gap={3} mb={5}>
      <Box
        w="8"
        h="8"
        borderRadius="lg"
        bg="primary.50"
        color="primary.600"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Icon size={18} />
      </Box>
      <Text fontSize="lg" fontWeight="600" color="gray.900">
        {title}
      </Text>
    </HStack>
    {children}
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

const ActivitySkeleton = () => (
  <Box p={4} bg="gray.50" borderRadius="lg">
    <Stack gap={2}>
      <Box h="12px" w="200px" bg="gray.100" borderRadius="md" />
      <Box h="10px" w="140px" bg="gray.100" borderRadius="md" />
    </Stack>
  </Box>
);

// ============================================================
// Human-friendly relative time
// ============================================================

const relativeTime = (isoString: string | null): string => {
  if (!isoString) return "Not available";
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  } catch {
    return isoString;
  }
};

// ============================================================
// Role Breakdown List
// ============================================================

const RoleBreakdown = ({ stats }: { stats: UserStats }) => {
  const items = [
    { label: "Advocates", value: stats.totalAdvocates, color: "blue" },
    { label: "Paralegals", value: stats.totalParalegals, color: "teal" },
    { label: "Clients", value: stats.totalClients, color: "purple" },
    { label: "Firm Admins", value: stats.totalFirmAdmins, color: "orange" },
  ];

  return (
    <HStack gap={4} flexWrap="wrap" p={4} bg="gray.50" borderRadius="lg">
      {items.map((item) => (
        <HStack key={item.label} gap={2}>
          <Badge
            colorScheme={item.color}
            px={2}
            py={0.5}
            borderRadius="full"
            fontSize="xs"
            fontWeight="600"
          >
            {item.value}
          </Badge>
          <Text fontSize="sm" color="gray.600">
            {item.label}
          </Text>
        </HStack>
      ))}
    </HStack>
  );
};

// ============================================================
// Scraper Info Row
// ============================================================

const ScraperInfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <HStack
    justify="space-between"
    py={2}
    borderBottom="1px solid"
    borderColor="gray.100"
  >
    <Text fontSize="sm" color="gray.500">
      {label}
    </Text>
    <Text fontSize="sm" fontWeight="600" color="gray.900">
      {value}
    </Text>
  </HStack>
);

// ============================================================
// Activity Action Badge
// ============================================================

const ActionBadge = ({ action }: { action: string }) => {
  const normalizedAction = action.toUpperCase().replace(/_/g, " ");
  const colorScheme =
    normalizedAction.includes("CREATE") || normalizedAction.includes("ADD")
      ? "green"
      : normalizedAction.includes("UPDATE") || normalizedAction.includes("EDIT")
        ? "blue"
        : normalizedAction.includes("DELETE") ||
            normalizedAction.includes("REMOVE")
          ? "red"
          : "gray";

  return (
    <Badge
      colorScheme={colorScheme}
      px={2}
      py={0.5}
      borderRadius="full"
      fontSize="xs"
      fontWeight="600"
    >
      {normalizedAction}
    </Badge>
  );
};

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
    <Button
      variant="outline"
      size="sm"
      onClick={onRetry}
    >
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
  const {
    data: dashboard,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGlobalDashboardQuery();

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

  const userStats = dashboard?.userStats;
  const firmStats = dashboard?.firmStats;
  const caseStats = dashboard?.caseStats;
  const scraperStats = dashboard?.scraperStats;
  const recentActivity = dashboard?.recentActivity ?? [];

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
          {[1, 2, 3, 4].map((i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </Grid>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
          <Stack gap={3}>
            <ActivitySkeleton />
            <ActivitySkeleton />
            <ActivitySkeleton />
          </Stack>
          <Stack gap={3}>
            <ActivitySkeleton />
            <ActivitySkeleton />
          </Stack>
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
          <Text textStyle="heading_4">Platform Overview</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            Monitor users, firms, matters and court data from one place.
          </Text>
        </Stack>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isFetching}
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          {isFetching ? "Refreshing..." : "Refresh"}
        </Button>
      </HStack>

      {/* ==================== SECTION 1: USER OVERVIEW ==================== */}
      <SectionCard title="User Overview" icon={Users}>
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={4}
          mb={4}
        >
          <MetricCard
            label="Total Users"
            value={userStats?.totalUsers ?? 0}
            icon={<Users size={20} />}
            color="gray"
          />
          <MetricCard
            label="Active Users"
            value={userStats?.activeUsers ?? 0}
            icon={<Activity size={20} />}
            color="green"
          />
          <MetricCard
            label="Inactive Users"
            value={userStats?.inactiveUsers ?? 0}
            icon={<Users size={20} />}
            color="red"
          />
          <MetricCard
            label="Total Clients"
            value={userStats?.totalClients ?? 0}
            icon={<Users size={20} />}
            color="purple"
          />
        </Grid>
        {userStats && <RoleBreakdown stats={userStats} />}
      </SectionCard>

      {/* ==================== SECTION 2 + 3 (side by side) ==================== */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
        {/* Firm Overview */}
        <SectionCard title="Firm Overview" icon={Building2}>
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            <MetricCard
              label="Total Firms"
              value={firmStats?.totalFirms ?? 0}
              icon={<Building2 size={20} />}
              color="blue"
            />
            <MetricCard
              label="Active"
              value={firmStats?.activeFirms ?? 0}
              icon={<Activity size={20} />}
              color="green"
            />
            <MetricCard
              label="Suspended"
              value={firmStats?.suspendedFirms ?? 0}
              icon={<AlertTriangle size={20} />}
              color="yellow"
            />
          </Grid>
        </SectionCard>

        {/* Case Overview */}
        <SectionCard title="Case Overview" icon={FileText}>
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={4}>
            <MetricCard
              label="Total Matters"
              value={caseStats?.totalMatters ?? 0}
              icon={<FileText size={20} />}
              color="gray"
            />
            <MetricCard
              label="Active"
              value={caseStats?.activeMatters ?? 0}
              icon={<Activity size={20} />}
              color="green"
            />
            <MetricCard
              label="Closed"
              value={caseStats?.closedMatters ?? 0}
              icon={<FileText size={20} />}
              color="gray"
            />
            <MetricCard
              label="Stale"
              value={caseStats?.staleMatters ?? 0}
              icon={<AlertTriangle size={20} />}
              color="red"
            />
            <MetricCard
              label="Today's Events"
              value={caseStats?.todayEvents ?? 0}
              icon={<CalendarDays size={20} />}
              color="blue"
            />
          </Grid>
        </SectionCard>
      </Grid>

      {/* ==================== SECTION 4: SCRAPER + SECTION 5: RECENT ACTIVITY ==================== */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
        {/* Court Data / Scraper */}
        <SectionCard title="Court Data / Scraper" icon={Database}>
          <Stack gap={0}>
            <ScraperInfoRow
              label="Courts Tracked"
              value={scraperStats?.courtsTracked ?? 0}
            />
            <ScraperInfoRow
              label="Daily Hearings"
              value={scraperStats?.totalDailyHearings ?? 0}
            />
            <ScraperInfoRow
              label="Weekly Hearings"
              value={scraperStats?.totalWeeklyHearings ?? 0}
            />
            <ScraperInfoRow
              label="Matches"
              value={scraperStats?.totalMatches ?? 0}
            />
            <ScraperInfoRow
              label="Last Scrape"
              value={relativeTime(scraperStats?.lastScrapeTime ?? null)}
            />
          </Stack>
        </SectionCard>

        {/* Recent Activity */}
        <SectionCard title="Recent Activity" icon={Globe}>
          {recentActivity.length === 0 ? (
            <Box py={8} textAlign="center">
              <Text fontSize="sm" color="gray.500">
                No recent activity.
              </Text>
            </Box>
          ) : (
            <Stack
              gap={0}
              maxH="400px"
              overflowY="auto"
              pr={1}
              css={{
                "&::-webkit-scrollbar": { width: "5px" },
                "&::-webkit-scrollbar-track": { background: "transparent" },
                "&::-webkit-scrollbar-thumb": {
                  background: "#CBD5E0",
                  borderRadius: "3px",
                },
              }}
            >
              {recentActivity
                .slice(0, 10)
                .map((activity: RecentActivity, index: number) => (
                  <Box
                    key={`${activity.createdAt}-${index}`}
                    py={3}
                    borderBottom={
                      index < Math.min(recentActivity.length, 10) - 1
                        ? "1px solid"
                        : "none"
                    }
                    borderColor="gray.100"
                  >
                    <HStack justify="space-between" align="flex-start" mb={1}>
                      <HStack gap={2}>
                        <ActionBadge action={activity.action} />
                        <Text fontSize="sm" fontWeight="500" color="gray.900">
                          {activity.entityType}
                        </Text>
                      </HStack>
                      <Text fontSize="xs" color="gray.400" whiteSpace="nowrap">
                        {relativeTime(activity.createdAt)}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600">
                      {activity.summary}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      by {activity.userName}
                    </Text>
                  </Box>
                ))}
            </Stack>
          )}
        </SectionCard>
      </Grid>
    </Stack>
  );
};

export default GlobalDashboardPage;
