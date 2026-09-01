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
import {
  Briefcase,
  Calendar,
  ChevronRight,
  CircleEqual,
  Edit,
  Plus,
  Search,
  X,
} from "lucide-react";
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
import { ProjectFormModal } from "../components/ProjectFormModal";
import { useModulePermissions } from "@/shared/hooks/usePermissions";

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
  onEdit,
}: {
  project: Project;
  onClick: () => void;
  onEdit: (projectCode: string) => void;
}) => (
  <Box
    bg="linear-gradient(180deg, rgba(236, 253, 245, 0.5) 0%, rgba(255, 255, 255, 0.95) 100%)"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="16px"
    overflow="hidden"
    boxShadow="0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)"
    _hover={{
      borderColor: "gray.300",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)",
    }}
    transition="all 0.2s ease"
  >
    {/* ---- Card Body ---- */}
    <VStack p={5} gap={4} align="stretch">
      {/* Top Section: Icon + Name + ID + Status */}
      <VStack gap={3} align="stretch">
        <Flex gap={3} align="center">
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
          <VStack align="flex-start" gap={0} flex={1}>
            <Text fontSize="sm" fontWeight="600" color="gray.900">
              {project.name}
            </Text>
            <Text fontSize="xs" color="gray.500" fontFamily="monospace">
              {project.projectCode}
            </Text>
          </VStack>
          <ProjectStatusBadge status={project.status} />
        </Flex>
      </VStack>

      {/* Middle Section: 2-column layout for dates, owner, client */}
      <SimpleGrid columns={2} gap={3}>
        <VStack align="flex-start" gap={1}>
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
        <VStack align="flex-start" gap={1}>
          <HStack gap={1}>
            <Calendar size={11} color="gray" />
            <Text fontSize="xs" color="gray.500">
              Target End
            </Text>
          </HStack>
          <Text fontSize="sm" color="gray.800">
            {formatDateDisplay(project.targetEndDate)}
          </Text>
        </VStack>
        <VStack align="flex-start" gap={1}>
          <HStack gap={1}>
            <LuUser size={11} color="gray" />
            <Text fontSize="xs" color="gray.500">
              Owner
            </Text>
          </HStack>
          <Text fontSize="sm" color="gray.800">
            {project.ownerName}
          </Text>
        </VStack>
        <VStack align="flex-start" gap={1}>
          <HStack gap={1}>
            <MdPeopleAlt size={11} color="gray" />
            <Text fontSize="xs" color="gray.500">
              Client
            </Text>
          </HStack>
          <Text fontSize="sm" color="gray.800">
            {project.clientName}
          </Text>
        </VStack>
      </SimpleGrid>

      {/* Bottom Section: Metrics + Created + View Details */}
      <VStack gap={3} align="stretch">
        <Flex gap={4} align="center" flexWrap="wrap">
          <Text fontSize="xs" color="gray.500">
            <Briefcase
              size={11}
              style={{ display: "inline", marginRight: 4 }}
            />
            {project.credentialCount} Credentials
          </Text>
          <Text fontSize="xs" color="gray.500">
            <MdAutorenew
              size={11}
              style={{ display: "inline", marginRight: 4 }}
            />
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
        </Flex>
        <Separator borderColor="gray.200" />
        <Flex justify="space-between" align="center">
          <Text fontSize="xs" color="gray.500">
            Created {formatDateDisplay(project.createdAt)}
          </Text>
          <HStack gap={2}>
            <Button
              variant="ghost"
              size="sm"
              color="primary.500"
              onClick={() => onEdit(project.projectCode)}
              fontWeight="500"
            >
              <Edit size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              color="primary.500"
              onClick={onClick}
              fontWeight="500"
            >
              View Details <ChevronRight size={14} style={{ marginLeft: 4 }} />
            </Button>
          </HStack>
        </Flex>
      </VStack>
    </VStack>
  </Box>
);

// ============================================================
// Main Component
// ============================================================

const ProjectListPage = () => {
  const navigate = useNavigate();
  const { canCreate, canEdit } = useModulePermissions("PROJECT_MANAGEMENT");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedProjectCode, setSelectedProjectCode] = useState<
    string | undefined
  >();

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

  const handleCreateProject = () => {
    setModalMode("create");
    setSelectedProjectCode(undefined);
    setModalOpen(true);
  };

  const handleEditProject = (projectCode: string) => {
    setModalMode("edit");
    setSelectedProjectCode(projectCode);
    setModalOpen(true);
  };

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
        {canCreate && (
          <Button variant="primary" onClick={handleCreateProject}>
            <Plus size={16} color="white" /> New Project
          </Button>
        )}
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
          <SimpleGrid columns={{ base: 1, lg: 3, md: 2 }} gap={6}>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => navigate(`/projects/${project.projectCode}`)}
                onEdit={handleEditProject}
              />
            ))}
          </SimpleGrid>

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

      {/* Project Form Modal */}
      <ProjectFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        projectCode={selectedProjectCode}
      />
    </Stack>
  );
};

export default ProjectListPage;
