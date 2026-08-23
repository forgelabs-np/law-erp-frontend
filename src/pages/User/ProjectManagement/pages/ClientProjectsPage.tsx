import {
  Badge,
  Box,
  Button,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  Briefcase,
  Calendar,
  FileKey,
  RefreshCw,
  XOctagon,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useClientProjectsQuery } from "../api/project.api";
import { ClientProject, ProjectStatus } from "../types/project.types";
import NoDataAvailable from "@/shared/components/NoDataAvailable/NoDataAvailable";

// ============================================================
// Status Badge
// ============================================================

const ProjectStatusBadge = ({ status }: { status: ProjectStatus }) => {
  const statusConfig: Record<
    ProjectStatus,
    { bg: string; color: string; label: string }
  > = {
    ACTIVE: { bg: "green.50", color: "green.700", label: "Active" },
    ON_HOLD: { bg: "yellow.50", color: "yellow.700", label: "On Hold" },
    COMPLETED: { bg: "blue.50", color: "blue.700", label: "Completed" },
    CANCELLED: { bg: "gray.50", color: "gray.700", label: "Cancelled" },
  };

  const config = statusConfig[status] || statusConfig.ACTIVE;

  return (
    <Badge
      px={2}
      py={0.5}
      borderRadius="full"
      fontSize="xs"
      fontWeight="600"
      bg={config.bg}
      color={config.color}
    >
      {config.label}
    </Badge>
  );
};

// ============================================================
// Project Row
// ============================================================

const ClientProjectRow = ({
  project,
  onClick,
}: {
  project: ClientProject;
  onClick: () => void;
}) => (
  <Box
    p={4}
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="lg"
    cursor="pointer"
    onClick={onClick}
    _hover={{ borderColor: "blue.300", boxShadow: "sm" }}
    transition="all 0.15s ease"
  >
    <HStack justify="space-between" flexWrap="wrap" gap={2}>
      <VStack align="flex-start" gap={1} flex={1} minW="200px">
        <Text fontSize="sm" fontWeight="600" color="gray.900">
          {project.name}
        </Text>
        <Text fontSize="xs" color="gray.500" fontFamily="monospace">
          {project.projectCode}
        </Text>
      </VStack>
      <HStack gap={4} flexWrap="wrap">
        <Text fontSize="sm" color="gray.600">
          {project.clientName}
        </Text>
        <ProjectStatusBadge status={project.status} />
        <HStack gap={3}>
          <Text fontSize="xs" color="gray.500">
            <FileKey size={12} className="inline mr-1" />
            {project.credentialCount}
          </Text>
          <Text fontSize="xs" color="gray.500">
            <Calendar size={12} className="inline mr-1" />
            {project.renewalCount}
          </Text>
        </HStack>
        {project.overdueInstances > 0 && (
          <Badge
            px={2}
            py={0.5}
            borderRadius="full"
            fontSize="xs"
            fontWeight="600"
            bg="red.100"
            color="red.700"
          >
            {project.overdueInstances} overdue
          </Badge>
        )}
      </HStack>
    </HStack>
  </Box>
);

// ============================================================
// Main Component
// ============================================================

const ClientProjectsPage = () => {
  const navigate = useNavigate();

  const {
    data: projectsData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useClientProjectsQuery();

  const projects = projectsData?.content ?? [];

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const isForbidden = useMemo(() => {
    if (!isError || !error) return false;
    const axiosError = error as any;
    return axiosError?.response?.status === 403;
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
        <Stack gap={3}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i} h="80px" bg="gray.100" borderRadius="lg" />
          ))}
        </Stack>
      </Stack>
    );
  }

  // Forbidden state
  if (isForbidden) {
    return (
      <Stack gap={6} padding={2}>
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
              This portal is for clients only.
            </Text>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  // Error state
  if (isError) {
    return (
      <Stack gap={6} padding={2}>
        <HStack justify="space-between" flexWrap="wrap" gap={4}>
          <Stack gap={2}>
            <Text textStyle="heading_4">My Projects</Text>
            <Text textStyle="paragraph_regular" color="gray.500">
              View your assigned projects
            </Text>
          </Stack>
        </HStack>
        <Box
          p={6}
          bg="red.50"
          border="1px solid"
          borderColor="red.200"
          borderRadius="lg"
          textAlign="center"
        >
          <Text fontSize="sm" color="red.700">
            Failed to load projects. Please try again.
          </Text>
          <Button variant="outline" size="sm" mt={4} onClick={handleRefresh}>
            Retry
          </Button>
        </Box>
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
          <Text textStyle="heading_4">My Projects</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            View your assigned projects ({projects.length} total)
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

      {/* ==================== PROJECT LIST ==================== */}
      {projects.length === 0 ? (
        <Box
          p={6}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          textAlign="center"
        >
          <NoDataAvailable content="No projects assigned to you" />
        </Box>
      ) : (
        <Stack gap={3}>
          {projects.map((project) => (
            <ClientProjectRow
              key={project.id}
              project={project}
              onClick={() =>
                navigate(`/client-projects/${project.projectCode}`)
              }
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default ClientProjectsPage;
