import {
  Badge,
  Box,
  Button,
  Grid,
  HStack,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CalendarDays,
  FileText,
  History,
  Plus,
  RefreshCw,
  XOctagon,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useFirmDashboardQuery } from "../api/dashboard.api";
import {
  CaseDashboardStats,
  CasePositioning,
  TodayEvent,
} from "../types/dashboard.types";
import { formatDate, formatDateTime, formatTime } from "../utils/matterHelpers";
import {
  CourtEventStatusBadge,
  CourtEventTypeBadge,
  MatterStatusBadge,
  MatterTypeBadge,
} from "../components/MatterBadges";

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

const EventSkeleton = () => (
  <Box
    p={4}
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="lg"
  >
    <Stack gap={2}>
      <Box h="16px" w="200px" bg="gray.100" borderRadius="md" />
      <Box h="12px" w="140px" bg="gray.100" borderRadius="md" />
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
    return formatDate(isoString);
  } catch {
    return isoString;
  }
};

// ============================================================
// Days since hearing display
// ============================================================

const daysSinceHearingDisplay = (days: number | null): string => {
  if (days === null) return "No hearing recorded";
  return `${days} days`;
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
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
          <Stack gap={3}>
            <EventSkeleton />
            <EventSkeleton />
            <EventSkeleton />
          </Stack>
          <Stack gap={3}>
            <EventSkeleton />
            <EventSkeleton />
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
          <Button variant="primary" onClick={() => navigate("/cases/create")}>
            <Plus size={16} color="white" /> New Matter
          </Button>
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

      {/* ==================== TODAY'S EVENTS ==================== */}
      <Stack gap={4}>
        <HStack justify="space-between">
          <HStack gap={2}>
            <CalendarClock size={18} color="#6b7280" />
            <Text fontSize="lg" fontWeight="600" color="gray.900">
              Today's Court Events
            </Text>
          </HStack>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/task-calendar")}
          >
            Open Calendar <ArrowRight size={14} />
          </Button>
        </HStack>

        {todayEvents.length === 0 ? (
          <Box
            p={6}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            textAlign="center"
          >
            <Text fontSize="sm" color="gray.500">
              No court events scheduled for today
            </Text>
          </Box>
        ) : (
          <Stack gap={3}>
            {todayEvents.map((event) => (
              <Box
                key={event.eventId}
                p={4}
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                cursor="pointer"
                onClick={() => navigate(`/cases/${event.matterNumber}`)}
                _hover={{ borderColor: "blue.300" }}
              >
                <HStack justify="space-between" flexWrap="wrap" gap={2}>
                  <Stack gap={1}>
                    <Text fontSize="sm" fontWeight="600" color="gray.900">
                      {event.matterTitle}
                    </Text>
                    <Text fontSize="xs" color="gray.500" fontFamily="monospace">
                      {event.matterNumber} · {event.ourCourtCaseRef}
                    </Text>
                  </Stack>
                  <HStack gap={2}>
                    <Badge
                      px={2}
                      py={0.5}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="600"
                      bg="blue.50"
                      color="blue.700"
                    >
                      {event.eventType}
                    </Badge>
                    <Badge
                      px={2}
                      py={0.5}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="600"
                      bg={
                        event.status === "SCHEDULED"
                          ? "green.50"
                          : event.status === "HELD"
                            ? "blue.50"
                            : "gray.50"
                      }
                      color={
                        event.status === "SCHEDULED"
                          ? "green.700"
                          : event.status === "HELD"
                            ? "blue.700"
                            : "gray.700"
                      }
                    >
                      {event.status}
                    </Badge>
                  </HStack>
                </HStack>
                <HStack gap={4} mt={2}>
                  <Text fontSize="sm" color="gray.600">
                    {formatTime(event.scheduledTime) ||
                      formatDate(event.scheduledDate)}
                  </Text>
                  {event.courtRoom && (
                    <Text fontSize="sm" color="gray.600">
                      Room {event.courtRoom}
                    </Text>
                  )}
                  {event.judgeName && (
                    <Text fontSize="sm" color="gray.600">
                      Judge: {event.judgeName}
                    </Text>
                  )}
                  {event.attendingAdvocateName && (
                    <Text fontSize="sm" color="gray.600">
                      Advocate: {event.attendingAdvocateName}
                    </Text>
                  )}
                </HStack>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>

      {/* ==================== CASE POSITIONING ==================== */}
      <Stack gap={4}>
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="600" color="gray.900">
            Case Positioning
          </Text>
          <Button variant="ghost" size="sm" onClick={() => navigate("/cases")}>
            View All <ArrowRight size={14} />
          </Button>
        </HStack>

        {casePositioning.length === 0 ? (
          <Box
            p={6}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            textAlign="center"
          >
            <Text fontSize="sm" color="gray.500">
              No matters found
            </Text>
          </Box>
        ) : (
          <Stack gap={2}>
            {casePositioning.slice(0, 10).map((matter) => (
              <Box
                key={matter.matterId}
                p={4}
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                cursor="pointer"
                onClick={() => navigate(`/cases/${matter.matterNumber}`)}
                _hover={{ borderColor: "blue.300" }}
              >
                <HStack justify="space-between" flexWrap="wrap" gap={2}>
                  <VStack align="flex-start" gap={1} flex={1} minW="200px">
                    <Text fontSize="sm" fontWeight="600" color="gray.900">
                      {matter.matterTitle}
                    </Text>
                    <Text fontSize="xs" color="gray.500" fontFamily="monospace">
                      {matter.matterNumber}
                    </Text>
                  </VStack>
                  <HStack gap={4} flexWrap="wrap">
                    {matter.courtName && (
                      <Text fontSize="sm" color="gray.600">
                        {matter.courtName}
                      </Text>
                    )}
                    {matter.stage && (
                      <Text fontSize="sm" color="gray.600">
                        {matter.stage}
                      </Text>
                    )}
                  </HStack>
                </HStack>
                <HStack gap={4} mt={2} flexWrap="wrap">
                  {matter.lastHearingDate && (
                    <Text fontSize="xs" color="gray.500">
                      Last: {formatDate(matter.lastHearingDate)} ·{" "}
                      {matter.lastHearingType}
                    </Text>
                  )}
                  {matter.nextEventDate && (
                    <Text fontSize="xs" color="gray.500">
                      Next: {formatDate(matter.nextEventDate)} ·{" "}
                      {matter.nextEventType}
                    </Text>
                  )}
                  <Badge
                    px={2}
                    py={0.5}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="600"
                    bg={
                      matter.matterStatus === "ACTIVE"
                        ? "green.50"
                        : matter.matterStatus === "DORMANT"
                          ? "yellow.50"
                          : "gray.50"
                    }
                    color={
                      matter.matterStatus === "ACTIVE"
                        ? "green.700"
                        : matter.matterStatus === "DORMANT"
                          ? "yellow.700"
                          : "gray.700"
                    }
                  >
                    {matter.matterStatus}
                  </Badge>
                </HStack>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>

      {/* ==================== STALE CASES ==================== */}
      <Stack gap={4}>
        <HStack justify="space-between">
          <HStack gap={2}>
            <AlertTriangle size={18} color="#d97706" />
            <Text fontSize="lg" fontWeight="600" color="gray.900">
              Stale Matters
            </Text>
          </HStack>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/stale-matters")}
          >
            View All <ArrowRight size={14} />
          </Button>
        </HStack>

        {staleCases.length === 0 ? (
          <Box
            p={6}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            textAlign="center"
          >
            <Text fontSize="sm" color="gray.500">
              All matters are up to date
            </Text>
          </Box>
        ) : (
          <Stack gap={2}>
            {staleCases.slice(0, 10).map((matter) => (
              <Box
                key={matter.matterId}
                p={4}
                bg="amber.50"
                border="1px solid"
                borderColor="amber.200"
                borderRadius="lg"
                cursor="pointer"
                onClick={() => navigate(`/cases/${matter.matterNumber}`)}
                _hover={{ borderColor: "amber.300" }}
              >
                <HStack justify="space-between" flexWrap="wrap" gap={2}>
                  <VStack align="flex-start" gap={1} flex={1} minW="200px">
                    <Text fontSize="sm" fontWeight="600" color="gray.900">
                      {matter.matterTitle}
                    </Text>
                    <Text fontSize="xs" color="gray.500" fontFamily="monospace">
                      {matter.matterNumber}
                    </Text>
                  </VStack>
                  <HStack gap={2}>
                    <Badge
                      px={2}
                      py={0.5}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="600"
                      bg="amber.100"
                      color="amber.800"
                    >
                      {daysSinceHearingDisplay(matter.daysSinceLastHearing)}
                    </Badge>
                  </HStack>
                </HStack>
                {matter.courtName && (
                  <Text fontSize="xs" color="gray.600" mt={2}>
                    {matter.courtName}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default CaseDashboardPage;
