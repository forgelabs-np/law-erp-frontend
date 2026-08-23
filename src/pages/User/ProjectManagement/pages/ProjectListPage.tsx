import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Input,
  Separator,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Briefcase, Calendar, ChevronRight, CircleEqual, Plus, Search, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useProjectsQuery } from "../api/project.api";
import { Project, ProjectStatus } from "../types/project.types";
import NoDataAvailable from "@/shared/components/NoDataAvailable/NoDataAvailable";
import { InputGroup } from "@/shared/components/ui";
import { FieldSelect } from "@/pages/User/CaseManagement/components/ui";
import { MdAutorenew, MdPeopleAlt } from "react-icons/md";
import { LuUser } from "react-icons/lu";

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
// Helpers
// ============================================================

const formatDateDisplay = (value?: string | null): string => {
  if (!value) return "—";
  try {
    return format(parseISO(value), "dd MMM yyyy");
  } catch {
    return value;
  }
};

// ============================================================
// Project Card
// ============================================================

const ProjectCard = ({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) => (
  <Box
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="lg"
    overflow="hidden"
    _hover={{ borderColor: "gray.300" }}
    transition="border-color 0.15s ease"
  >
    {/* ---- Card Body ---- */}
    <Stack p={5} gap={4}>
      {/* Row 1: Icon + Name + Status + Metrics */}
      <Flex
        gap={4}
        align={{ base: "flex-start", md: "center" }}
        justify="space-between"
        flexWrap="wrap"
      >
        {/* Left: Icon + Name + Code */}
        <HStack gap={3} flex={1} minW="0">
          <Flex
            w={10}
            h={10}
            bg="primary.50"
            borderRadius="md"
            align="center"
            justify="center"
            flexShrink={0}
          >
            <Briefcase size={18} color="gray" />
          </Flex>
          <VStack align="flex-start" gap={0} minW="0">
            <Text
              fontSize="sm"
              fontWeight="600"
              color="gray.900"
            >
              {project.name}
            </Text>
            <Text
              fontSize="xs"
              color="gray.500"
              fontFamily="monospace"
            >
              {project.projectCode}
            </Text>
          </VStack>
        </HStack>

        {/* Right: Status + Metrics */}
        <HStack gap={3} flexWrap="wrap" align="center">
          <ProjectStatusBadge status={project.status} />
          <HStack gap={3}>
            <Text fontSize="xs" color="gray.500">
              <Briefcase size={11} style={{ display: "inline", marginRight: 4 }} />
              {project.credentialCount} Credentials
            </Text>
            <Text fontSize="xs" color="gray.500">
              <MdAutorenew
                size={11} style={{ display: "inline", marginRight: 4 }} />
              {project.renewalCount} Renewals
            </Text>
            {project.overdueInstances > 0 && (
              <Badge
                px={1.5}
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
      </Flex>

      {/* Row 2: Dates + Owner + Client */}
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 4 }}
        gap={{ base: 3, md: 6 }}
      >
        <VStack align="flex-start" >
          <HStack gap={1}>
            <Calendar size={11} color="gray" />
            <Text fontSize="xs" color="gray.500">
              Start Date
            </Text>
          </HStack>
          <Text fontSize="sm" color="gray.800">
            {formatDateDisplay(project.startDate)}
          </Text>
        </VStack>
        <VStack align="flex-start" >
          <HStack gap={1}>
            <Calendar size={11} color="gray" />
            <Text fontSize="xs" color="gray.500">
              Target End Date
            </Text>
          </HStack>
          <Text fontSize="sm" color="gray.800">
            {formatDateDisplay(project.targetEndDate)}
          </Text>
        </VStack>
        <VStack align="flex-start">
          <HStack>
            <LuUser size={11} color="gray" />


            <Text fontSize="xs" color="gray.500">
              Owner
            </Text>
          </HStack>
          <Text fontSize="sm" color="gray.800" >
            {project.ownerName}
          </Text>
        </VStack>
        <VStack align="flex-start" gap={0}>
          <HStack>
            <MdPeopleAlt size={11} color="gray" />


            <Text fontSize="xs" color="gray.500">
              Client
            </Text>
          </HStack>
          <Text fontSize="sm" color="gray.800" >
            {project.clientName}
          </Text>
        </VStack>
      </SimpleGrid>
    </Stack>

    {/* ---- Footer ---- */}
    <Separator borderColor="gray.200" />
    <Flex
      px={5}
      py={3}
      justify="space-between"
      align="center"
    >
      <Text fontSize="xs" color="gray.500">
        Created {formatDateDisplay(project.createdAt)}
      </Text>
      <Button
        variant="ghost"
        size="sm"
        color="primary.500"
        onClick={onClick}
      // rightIcon={<ChevronRight size={14} />}
      >
        <ChevronRight size={14} />
        View Details
      </Button>
    </Flex>
  </Box >
);

// ============================================================
// Main Component
// ============================================================

const ProjectListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(0);
  const [size] = useState(20);

  const {
    data: projectsData,
    isLoading,
    isError,
    refetch,
  } = useProjectsQuery({
    search: search || undefined,
    status: statusFilter || undefined,
    page,
    size,
  });

  const projects = projectsData?.content ?? [];
  const totalPages = projectsData?.totalPages ?? 0;
  const totalElements = projectsData?.totalElements ?? 0;

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPage(0);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(0);
  };

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
        <HStack gap={4}>
          <Box h="40px" w="300px" bg="gray.100" borderRadius="md" />
          <Box h="40px" w="200px" bg="gray.100" borderRadius="md" />
        </HStack>
        <Stack gap={4}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i} h="160px" bg="gray.100" borderRadius="lg" />
          ))}
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
            <Text textStyle="heading_4">Projects</Text>
            <Text textStyle="paragraph_regular" color="gray.500">
              Manage your firm's projects
            </Text>
          </Stack>
          <Button
            variant="primary"
            onClick={() => navigate("/projects/create")}
          >
            <Plus size={16} color="white" /> New Project
          </Button>
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
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={4}
      >
        <Stack gap={2}>
          <Text textStyle="heading_4">Projects</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            Manage your firm's projects ({totalElements} total)
          </Text>
        </Stack>
        <Button variant="primary" onClick={() => navigate("/projects/create")}>
          <Plus size={16} color="white" /> New Project
        </Button>
      </HStack>

      {/* ==================== FILTERS ==================== */}
      <HStack gap={4} flexWrap="wrap">
        <Box flex={1} minW="250px">
          <InputGroup
            startElement={
              <Grid
                placeItems="center"
                boxSize="10"
                color="system.inputGroup.element"
                css={{
                  "& > svg": {
                    boxSize: "5",
                  },
                }}
              >
                <Search size={16} />
              </Grid>
            }
          >
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleSearch(e.target.value)
              }
              paddingLeft="10 !important"
            />
          </InputGroup>
        </Box>
        <Box minW="180px">
          <FieldSelect
            placeholder="Filter by status"
            value={statusFilter}
            onChange={handleStatusChange}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </FieldSelect>
        </Box>
        {(search || statusFilter) && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X size={16} /> Clear Filters
          </Button>
        )}
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
          <NoDataAvailable
            content={
              search || statusFilter
                ? "No projects match your filters"
                : "No projects found"
            }
          />
        </Box>
      ) : (
        <>
          <Stack gap={4}>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => navigate(`/projects/${project.projectCode}`)}
              />
            ))}
          </Stack>

          {/* ==================== PAGINATION ==================== */}
          {totalPages > 1 && (
            <HStack justify="center" gap={2} mt={4}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <Text fontSize="sm" color="gray.600">
                Page {page + 1} of {totalPages}
              </Text>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
              >
                Next
              </Button>
            </HStack>
          )}
        </>
      )}
    </Stack>
  );
};

export default ProjectListPage;
