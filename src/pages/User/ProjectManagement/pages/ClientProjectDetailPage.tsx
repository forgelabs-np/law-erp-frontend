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
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useClientProjectByCodeQuery,
  useClientProjectRenewalsQuery,
} from "../api/project.api";
import {
  ClientProject,
  ProjectStatus,
  RenewalInstanceStatus,
} from "../types/project.types";
import { Tabs } from "@/shared/components/ui/Tabs";
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
// Renewal Instance Status Badge
// ============================================================

const RenewalInstanceStatusBadge = ({
  status,
}: {
  status: RenewalInstanceStatus;
}) => {
  const statusConfig: Record<
    RenewalInstanceStatus,
    { bg: string; color: string; label: string; icon: React.ReactNode }
  > = {
    PENDING: {
      bg: "yellow.50",
      color: "yellow.700",
      label: "Pending",
      icon: <Clock size={12} />,
    },
    IN_PROGRESS: {
      bg: "blue.50",
      color: "blue.700",
      label: "In Progress",
      icon: <RefreshCw size={12} />,
    },
    COMPLETED: {
      bg: "green.50",
      color: "green.700",
      label: "Completed",
      icon: <CheckCircle size={12} />,
    },
    OVERDUE: {
      bg: "red.50",
      color: "red.700",
      label: "Overdue",
      icon: <XCircle size={12} />,
    },
    SKIPPED: {
      bg: "gray.50",
      color: "gray.700",
      label: "Skipped",
      icon: <XCircle size={12} />,
    },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <Badge
      px={2}
      py={0.5}
      borderRadius="full"
      fontSize="xs"
      fontWeight="600"
      bg={config.bg}
      color={config.color}
      display="flex"
      alignItems="center"
      gap={1}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
};

// ============================================================
// Overview Tab
// ============================================================

const OverviewTab = ({ project }: { project: ClientProject }) => (
  <Grid
    templateColumns={{
      base: "1fr",
      md: "repeat(2, 1fr)",
      lg: "repeat(3, 1fr)",
    }}
    gap={4}
  >
    <Box p={4} bg="gray.50" borderRadius="md">
      <Text fontSize="xs" color="gray.500" mb={1}>
        Project Name
      </Text>
      <Text fontSize="sm" fontWeight="600" color="gray.900">
        {project.name}
      </Text>
    </Box>
    <Box p={4} bg="gray.50" borderRadius="md">
      <Text fontSize="xs" color="gray.500" mb={1}>
        Project Code
      </Text>
      <Text
        fontSize="sm"
        fontWeight="600"
        color="gray.900"
        fontFamily="monospace"
      >
        {project.projectCode}
      </Text>
    </Box>
    <Box p={4} bg="gray.50" borderRadius="md">
      <Text fontSize="xs" color="gray.500" mb={1}>
        Client
      </Text>
      <Text fontSize="sm" fontWeight="600" color="gray.900">
        {project.clientName}
      </Text>
    </Box>
    <Box p={4} bg="gray.50" borderRadius="md">
      <Text fontSize="xs" color="gray.500" mb={1}>
        Status
      </Text>
      <ProjectStatusBadge status={project.status} />
    </Box>
    <Box p={4} bg="gray.50" borderRadius="md">
      <Text fontSize="xs" color="gray.500" mb={1}>
        Start Date
      </Text>
      <Text fontSize="sm" fontWeight="600" color="gray.900">
        {new Date(project.startDate).toLocaleDateString()}
      </Text>
    </Box>
    <Box p={4} bg="gray.50" borderRadius="md">
      <Text fontSize="xs" color="gray.500" mb={1}>
        Target End Date
      </Text>
      <Text fontSize="sm" fontWeight="600" color="gray.900">
        {project.targetEndDate
          ? new Date(project.targetEndDate).toLocaleDateString()
          : "Ongoing"}
      </Text>
    </Box>
    <Box p={4} bg="gray.50" borderRadius="md">
      <Text fontSize="xs" color="gray.500" mb={1}>
        Credentials
      </Text>
      <Text fontSize="sm" fontWeight="600" color="gray.900">
        {project.credentialCount}
      </Text>
    </Box>
    <Box p={4} bg="gray.50" borderRadius="md">
      <Text fontSize="xs" color="gray.500" mb={1}>
        Renewals
      </Text>
      <Text fontSize="sm" fontWeight="600" color="gray.900">
        {project.renewalCount}
      </Text>
    </Box>
    {project.description && (
      <Box
        p={4}
        bg="gray.50"
        borderRadius="md"
        gridColumn={{ md: "span 2", lg: "span 3" }}
      >
        <Text fontSize="xs" color="gray.500" mb={1}>
          Description
        </Text>
        <Text fontSize="sm" color="gray.900">
          {project.description}
        </Text>
      </Box>
    )}
  </Grid>
);

// ============================================================
// Renewals Tab
// ============================================================

const RenewalCard = ({ renewal }: { renewal: any }) => {
  const [showInstances, setShowInstances] = useState(false);

  return (
    <Box p={4} bg="gray.50" borderRadius="md">
      <HStack
        justify="space-between"
        align="flex-start"
        flexWrap="wrap"
        gap={2}
      >
        <VStack align="flex-start" gap={1} flex={1} minW="200px">
          <Text fontSize="sm" fontWeight="600" color="gray.900">
            {renewal.renewalTitle}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {renewal.renewalTypeName}
          </Text>
        </VStack>
        <HStack gap={3} flexWrap="wrap">
          <VStack align="flex-start" gap={1}>
            <Text fontSize="xs" color="gray.500">
              Recurrence
            </Text>
            <Text fontSize="sm" fontWeight="500" color="gray.900">
              {renewal.recurrence}
            </Text>
          </VStack>
          <VStack align="flex-start" gap={1}>
            <Text fontSize="xs" color="gray.500">
              Status
            </Text>
            <Badge
              px={2}
              py={0.5}
              borderRadius="full"
              fontSize="xs"
              fontWeight="600"
              bg={renewal.status === "ACTIVE" ? "green.50" : "gray.50"}
              color={renewal.status === "ACTIVE" ? "green.700" : "gray.700"}
            >
              {renewal.status}
            </Badge>
          </VStack>
        </HStack>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowInstances(!showInstances)}
        >
          {showInstances
            ? "Hide Instances"
            : `Show Instances (${renewal.instances.length})`}
        </Button>
      </HStack>

      {showInstances && (
        <Stack
          gap={2}
          mt={4}
          pt={4}
          borderTop="1px solid"
          borderColor="gray.200"
        >
          <Text fontSize="xs" fontWeight="600" color="gray.700">
            Renewal Instances
          </Text>
          {renewal.instances.length === 0 ? (
            <Text fontSize="xs" color="gray.500">
              No instances yet
            </Text>
          ) : (
            renewal.instances.map((instance: any) => (
              <Box
                key={instance.id}
                p={3}
                bg="white"
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
              >
                <HStack
                  justify="space-between"
                  align="flex-start"
                  flexWrap="wrap"
                  gap={2}
                >
                  <VStack align="flex-start" gap={1}>
                    <Text fontSize="xs" color="gray.500">
                      Due Date
                    </Text>
                    <Text fontSize="sm" fontWeight="500" color="gray.900">
                      {new Date(instance.dueDate).toLocaleDateString()}
                    </Text>
                  </VStack>
                  <RenewalInstanceStatusBadge status={instance.status} />
                </HStack>
                {instance.completedAt && (
                  <Text fontSize="xs" color="gray.600" mt={2}>
                    Completed:{" "}
                    {new Date(instance.completedAt).toLocaleDateString()}
                  </Text>
                )}
                {instance.notes && (
                  <Text fontSize="xs" color="gray.600" mt={1}>
                    Notes: {instance.notes}
                  </Text>
                )}
              </Box>
            ))
          )}
        </Stack>
      )}
    </Box>
  );
};

const RenewalsTab = ({ projectCode }: { projectCode: string }) => {
  const { data: renewals, isLoading } =
    useClientProjectRenewalsQuery(projectCode);

  if (isLoading) {
    return (
      <Stack gap={3}>
        {[1, 2, 3].map((i) => (
          <Box key={i} h="120px" bg="gray.100" borderRadius="md" />
        ))}
      </Stack>
    );
  }

  if (!renewals || renewals.length === 0) {
    return (
      <Box
        p={6}
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
      >
        <NoDataAvailable content="No renewals for this project" />
      </Box>
    );
  }

  return (
    <Stack gap={3}>
      {renewals.map((renewal) => (
        <RenewalCard key={renewal.id} renewal={renewal} />
      ))}
    </Stack>
  );
};

// ============================================================
// Main Component
// ============================================================

const ClientProjectDetailPage = () => {
  const navigate = useNavigate();
  const { projectCode } = useParams<{ projectCode: string }>();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    data: project,
    isLoading,
    isError,
    refetch,
  } = useClientProjectByCodeQuery(projectCode || "");

  const tabs = [
    { label: "Overview", value: "overview" },
    { label: "Renewals", value: "renewals" },
  ];

  // Loading state
  if (isLoading) {
    return (
      <Stack gap={6} padding={2}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/client-projects")}
        >
          <ArrowLeft size={16} /> Back to My Projects
        </Button>
        <Stack gap={2}>
          <Box h="28px" w="220px" bg="gray.100" borderRadius="md" />
          <Box h="16px" w="360px" bg="gray.100" borderRadius="md" />
        </Stack>
        <Box
          p={6}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
        >
          <Stack gap={4}>
            <Box h="200px" bg="gray.100" borderRadius="md" />
          </Stack>
        </Box>
      </Stack>
    );
  }

  // Error state
  if (isError || !project) {
    return (
      <Stack gap={6} padding={2}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/client-projects")}
        >
          <ArrowLeft size={16} /> Back to My Projects
        </Button>
        <Box
          p={6}
          bg="red.50"
          border="1px solid"
          borderColor="red.200"
          borderRadius="lg"
          textAlign="center"
        >
          <Text fontSize="sm" color="red.700">
            Failed to load project. Please try again.
          </Text>
          <Button variant="outline" size="sm" mt={4} onClick={() => refetch()}>
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
        justify="space-between"
        align="flex-start"
        flexWrap="wrap"
        gap={4}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/client-projects")}
        >
          <ArrowLeft size={16} /> Back to My Projects
        </Button>
        <Button variant="ghost" size="sm" onClick={() => refetch()}>
          <RefreshCw size={16} />
        </Button>
      </HStack>

      {/* ==================== PROJECT INFO ==================== */}
      <Stack gap={4}>
        <HStack
          justify="space-between"
          align="flex-start"
          flexWrap="wrap"
          gap={2}
        >
          <VStack align="flex-start" gap={1} flex={1}>
            <HStack gap={3} align="center" flexWrap="wrap">
              <Text textStyle="heading_4">{project.name}</Text>
              <ProjectStatusBadge status={project.status} />
            </HStack>
            <Text fontSize="sm" color="gray.500" fontFamily="monospace">
              {project.projectCode}
            </Text>
          </VStack>
          <HStack gap={4} flexWrap="wrap">
            <HStack gap={2}>
              <Briefcase size={16} color="#6b7280" />
              <Text fontSize="sm" color="gray.600">
                {project.credentialCount} Credentials
              </Text>
            </HStack>
            <HStack gap={2}>
              <Calendar size={16} color="#6b7280" />
              <Text fontSize="sm" color="gray.600">
                {project.renewalCount} Renewals
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

        <Text fontSize="sm" color="gray.600">
          <strong>Client:</strong> {project.clientName}
        </Text>
      </Stack>

      {/* ==================== TABS ==================== */}
      <Box
        p={6}
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
      >
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          options={tabs}
          renderContent={(tabValue: string) => {
            switch (tabValue) {
              case "overview":
                return <OverviewTab project={project} />;
              case "renewals":
                return <RenewalsTab projectCode={project.projectCode} />;
              default:
                return null;
            }
          }}
        />
      </Box>
    </Stack>
  );
};

export default ClientProjectDetailPage;
