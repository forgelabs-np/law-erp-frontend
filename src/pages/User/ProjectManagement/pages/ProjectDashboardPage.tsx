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
  AlertTriangle,
  ArrowRight,
  Briefcase,
  CalendarClock,
  FileKey,
  RefreshCw,
  Users,
  XOctagon,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useProjectDashboardQuery } from "../api/project.api";
import { ProjectDashboard } from "../types/project.types";
import { useModulePermissions } from "@/shared/hooks/usePermissions";

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

const ItemSkeleton = () => (
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

const ProjectDashboardPage = () => {
  const navigate = useNavigate();
  const { canCreate } = useModulePermissions("PROJECT_MANAGEMENT");

  const {
    data: dashboard,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useProjectDashboardQuery();

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
            lg: "repeat(3, 1fr)",
            xl: "repeat(6, 1fr)",
          }}
          gap={4}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </Grid>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
          <Stack gap={3}>
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
          </Stack>
          <Stack gap={3}>
            <ItemSkeleton />
            <ItemSkeleton />
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

  const overdueItems = dashboard?.overdueItems ?? [];
  const upcomingItems = dashboard?.upcomingItems ?? [];

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
          <Text textStyle="heading_4">Project Management</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            Overview of your firm's projects, credentials, and renewals.
          </Text>
        </Stack>
        <HStack gap={2}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
          <Button variant="outline" onClick={() => navigate("/projects")}>
            View All Projects
          </Button>
          {canCreate && (
            <Button
              variant="primary"
              onClick={() => navigate("/projects/create")}
            >
              <Briefcase size={16} color="white" /> New Project
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
          label="Total Projects"
          value={dashboard?.totalProjects ?? 0}
          icon={<Briefcase size={20} />}
          color="blue"
          onClick={() => navigate("/projects")}
        />
        <MetricCard
          label="Active Projects"
          value={dashboard?.activeProjects ?? 0}
          icon={<Briefcase size={20} />}
          color="green"
          onClick={() => navigate("/projects")}
        />
        <MetricCard
          label="Overdue Renewals"
          value={dashboard?.overdueInstances ?? 0}
          icon={<AlertTriangle size={20} />}
          color="red"
          onClick={() => navigate("/projects")}
        />
        <MetricCard
          label="Upcoming Renewals"
          value={dashboard?.upcomingInstances ?? 0}
          icon={<CalendarClock size={20} />}
          color="purple"
          onClick={() => navigate("/projects")}
        />
        <MetricCard
          label="Total Credentials"
          value={dashboard?.totalCredentials ?? 0}
          icon={<FileKey size={20} />}
          color="cyan"
          onClick={() => navigate("/projects")}
        />
        <MetricCard
          label="Total Renewals"
          value={dashboard?.totalRenewals ?? 0}
          icon={<CalendarClock size={20} />}
          color="teal"
          onClick={() => navigate("/projects")}
        />
      </Grid>

      {/* ==================== OVERDUE ALERTS ==================== */}
      <Stack gap={4}>
        <HStack justify="space-between">
          <HStack gap={2}>
            <AlertTriangle size={18} color="#dc2626" />
            <Text fontSize="lg" fontWeight="600" color="gray.900">
              Overdue Renewals
            </Text>
          </HStack>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/projects")}
          >
            View All <ArrowRight size={14} />
          </Button>
        </HStack>

        {overdueItems.length === 0 ? (
          <Box
            p={6}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            textAlign="center"
          >
            <Text fontSize="sm" color="gray.500">
              No overdue renewals
            </Text>
          </Box>
        ) : (
          <Stack gap={2}>
            {overdueItems.slice(0, 10).map((item) => (
              <Box
                key={`${item.projectCode}-${item.renewalTitle}`}
                p={4}
                bg="red.50"
                border="1px solid"
                borderColor="red.200"
                borderRadius="lg"
                cursor="pointer"
                onClick={() => navigate(`/projects/${item.projectCode}`)}
                _hover={{ borderColor: "red.300" }}
              >
                <HStack justify="space-between" flexWrap="wrap" gap={2}>
                  <VStack align="flex-start" gap={1} flex={1} minW="200px">
                    <Text fontSize="sm" fontWeight="600" color="gray.900">
                      {item.renewalTitle}
                    </Text>
                    <Text fontSize="xs" color="gray.500" fontFamily="monospace">
                      {item.projectCode} · {item.projectName}
                    </Text>
                  </VStack>
                  <HStack gap={2}>
                    <Badge
                      px={2}
                      py={0.5}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="600"
                      bg="red.100"
                      color="red.700"
                    >
                      {item.daysOverdue} days overdue
                    </Badge>
                    <Badge
                      px={2}
                      py={0.5}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="600"
                      bg="gray.100"
                      color="gray.700"
                    >
                      {item.renewalTypeName}
                    </Badge>
                  </HStack>
                </HStack>
                <Text fontSize="xs" color="gray.600" mt={2}>
                  Due: {new Date(item.dueDate).toLocaleDateString()}
                </Text>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>

      {/* ==================== UPCOMING DEADLINES ==================== */}
      <Stack gap={4}>
        <HStack justify="space-between">
          <HStack gap={2}>
            <CalendarClock size={18} color="#6b7280" />
            <Text fontSize="lg" fontWeight="600" color="gray.900">
              Upcoming Deadlines
            </Text>
          </HStack>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/projects")}
          >
            View All <ArrowRight size={14} />
          </Button>
        </HStack>

        {upcomingItems.length === 0 ? (
          <Box
            p={6}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            textAlign="center"
          >
            <Text fontSize="sm" color="gray.500">
              No upcoming deadlines
            </Text>
          </Box>
        ) : (
          <Stack gap={2}>
            {upcomingItems.slice(0, 10).map((item) => (
              <Box
                key={`${item.projectCode}-${item.renewalTitle}`}
                p={4}
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                cursor="pointer"
                onClick={() => navigate(`/projects/${item.projectCode}`)}
                _hover={{ borderColor: "blue.300" }}
              >
                <HStack justify="space-between" flexWrap="wrap" gap={2}>
                  <VStack align="flex-start" gap={1} flex={1} minW="200px">
                    <Text fontSize="sm" fontWeight="600" color="gray.900">
                      {item.renewalTitle}
                    </Text>
                    <Text fontSize="xs" color="gray.500" fontFamily="monospace">
                      {item.projectCode} · {item.projectName}
                    </Text>
                  </VStack>
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
                      {item.renewalTypeName}
                    </Badge>
                  </HStack>
                </HStack>
                <Text fontSize="xs" color="gray.600" mt={2}>
                  Due: {new Date(item.dueDate).toLocaleDateString()}
                </Text>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default ProjectDashboardPage;
