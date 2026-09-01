import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  IconButton,
  Input,
  Separator,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  EyeOff,
  FileKey,
  Lock,
  MoreVertical,
  PauseCircle,
  Plus,
  RefreshCw,
  Shield,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useProjectByCodeQuery,
  useProjectCredentialsQuery,
  useProjectMembersQuery,
  useProjectRenewalsQuery,
  useRevealCredentialMutation,
  useUpdateProjectMutation,
  useCreateCredentialMutation,
  useUpdateCredentialMutation,
  useDeleteCredentialMutation,
  useChangeProjectStatusMutation,
  useDeleteProjectMutation,
  useAddProjectMemberMutation,
  useRemoveProjectMemberMutation,
  useCreateRenewalMutation,
  useUpdateRenewalMutation,
  useChangeRenewalStatusMutation,
  useUpdateRenewalInstanceMutation,
  useRenewalTypesQuery,
} from "../api/project.api";
import { useGetEmployeesQuery } from "@/api/employeeManagement";
import {
  Project,
  ProjectStatus,
  ProjectCredential,
  ProjectMember,
  Renewal,
  RenewalStatus,
  RenewalInstanceStatus,
  CreateCredentialRequest,
} from "../types/project.types";
import { Tabs } from "@/shared/components/ui/Tabs";
import { Tooltip } from "@/shared/components/ui";
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
} from "@/shared/components/ui";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
} from "@/shared/components/ui";
import { AddCredentialModal } from "../components/AddCredentialModal";
import { useModulePermissions } from "@/shared/hooks/usePermissions";
import NoDataAvailable from "@/shared/components/NoDataAvailable/NoDataAvailable";
import { FieldSelect } from "@/pages/User/CaseManagement/components/ui";
import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";
import { RiLockPasswordLine } from "react-icons/ri";
import { ProjectFormModal } from "../components/ProjectFormModal";

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

const displayValue = (value?: string | null): string => {
  if (!value || value.trim() === "") return "N/A";
  return value;
};

// ============================================================
// Renewal Status Badge
// ============================================================

const RenewalStatusBadge = ({ status }: { status: RenewalStatus }) => {
  const statusConfig: Record<
    RenewalStatus,
    { bg: string; color: string; label: string }
  > = {
    ACTIVE: { bg: "green.50", color: "green.700", label: "Active" },
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
// Overview Tab
// ============================================================

const OverviewTab = ({ project }: { project: Project }) => (
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
        Owner
      </Text>
      <Text fontSize="sm" fontWeight="600" color="gray.900">
        {project.ownerName}
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
// Credentials Tab
// ============================================================

const CredentialRow = ({
  credential,
  projectCode,
  onEdit,
  onDelete,
}: {
  credential: ProjectCredential;
  projectCode: string;
  onEdit: (credential: ProjectCredential) => void;
  onDelete: (id: number) => void;
}) => {
  const { canCredentialReveal } = useModulePermissions("PROJECT_MANAGEMENT");
  const [showPassword, setShowPassword] = useState(false);
  const [revealedPassword, setRevealedPassword] = useState("");
  const revealMutation = useRevealCredentialMutation();

  const handleReveal = () => {
    if (showPassword) {
      setShowPassword(false);
      setRevealedPassword("");
    } else {
      revealMutation.mutate(
        { projectCode, credentialId: credential.id },
        {
          onSuccess: (res) => {
            if (res?.data?.data?.password) {
              setRevealedPassword(res.data.data.password);
              setShowPassword(true);
            }
          },
        }
      );
    }
  };

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      overflow="hidden"
    >
      {/* ---- Card Body ---- */}
      <Stack p={5} gap={4}>
        {/* Header: Icon + Name + Actions */}
        <Flex gap={3} align="center" justify="space-between">
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
              <RiLockPasswordLine size={18} color="black" />
            </Flex>
            <VStack align="flex-start" gap={0} minW="0">
              <Text fontSize="sm" fontWeight="600" color="gray.900">
                {credential.siteName}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {credential.siteType}
              </Text>
            </VStack>
          </HStack>
          <HStack gap={1}>
            <IconButton
              size="xs"
              variant="ghost"
              onClick={() => onEdit(credential)}
              aria-label="Edit credential"
            >
              <Edit size={14} />
            </IconButton>
            <IconButton
              size="xs"
              variant="ghost"
              colorScheme="red"
              onClick={() => onDelete(credential.id)}
              aria-label="Delete credential"
            >
              <Trash2 size={14} />
            </IconButton>
          </HStack>
        </Flex>

        {/* Information Grid */}
        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={{ base: 3, md: 6 }}>
          <VStack align="flex-start" gap={0}>
            <Text fontSize="xs" color="gray.500">
              Username / Email
            </Text>
            <Text fontSize="sm" color="gray.800">
              {displayValue(credential.usernameOrEmail)}
            </Text>
          </VStack>
          <VStack align="flex-start" gap={0}>
            <Text fontSize="xs" color="gray.500">
              Password
            </Text>
            <HStack gap={1} align="center">
              <Text fontSize="sm" fontFamily="monospace" color="gray.800">
                {showPassword && revealedPassword
                  ? revealedPassword
                  : "••••••••••••"}
              </Text>
              <Tooltip
                content={
                  canCredentialReveal
                    ? showPassword
                      ? "Hide password"
                      : "Reveal password"
                    : "You don't have permission to reveal passwords"
                }
              >
                <IconButton
                  size="xs"
                  variant="ghost"
                  onClick={handleReveal}
                  disabled={revealMutation.isPending || !canCredentialReveal}
                  opacity={canCredentialReveal ? 1 : 0.4}
                  cursor={canCredentialReveal ? "pointer" : "not-allowed"}
                  aria-label={
                    showPassword ? "Hide password" : "Reveal password"
                  }
                  aria-disabled={!canCredentialReveal}
                >
                  {revealMutation.isPending ? (
                    <RefreshCw size={12} className="animate-spin" />
                  ) : showPassword ? (
                    <EyeOff size={12} />
                  ) : (
                    <Eye size={12} />
                  )}
                </IconButton>
              </Tooltip>
            </HStack>
          </VStack>
          <VStack align="flex-start" gap={0}>
            <Text fontSize="xs" color="gray.500">
              Contact Person
            </Text>
            <Text fontSize="sm" color="gray.800">
              {displayValue(credential.contactPerson)}
            </Text>
          </VStack>
          <VStack align="flex-start" gap={0}>
            <Text fontSize="xs" color="gray.500">
              Contact Email
            </Text>
            <Text fontSize="sm" color="gray.800">
              {displayValue(credential.contactEmail)}
            </Text>
          </VStack>
          <VStack align="flex-start" gap={0}>
            <Text fontSize="xs" color="gray.500">
              Contact Phone
            </Text>
            <Text fontSize="sm" color="gray.800">
              {displayValue(credential.contactPhone)}
            </Text>
          </VStack>
          <VStack align="flex-start" gap={0}>
            <Text fontSize="xs" color="gray.500">
              Site URL
            </Text>
            {credential.siteUrl ? (
              <a
                href={credential.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "14px",
                  color: "#3182ce",
                  textDecoration: "none",
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                  width: "100%",
                }}
              >
                {credential.siteUrl}
              </a>
            ) : (
              <Text fontSize="sm" color="gray.800">
                N/A
              </Text>
            )}
          </VStack>
        </SimpleGrid>

        {/* Notes */}
        {credential.notes && credential.notes.trim() !== "" && (
          <Box>
            <Text fontSize="xs" color="gray.500" mb={1}>
              Notes
            </Text>
            <Text fontSize="sm" color="gray.600">
              {credential.notes}
            </Text>
          </Box>
        )}
      </Stack>

      {/* ---- Footer ---- */}
      <Separator borderColor="gray.200" />
      <Flex px={5} py={3} justify="flex-end" align="center">
        <Text fontSize="xs" color="gray.500">
          Created {formatDateDisplay(credential.createdAt)}
        </Text>
      </Flex>
    </Box>
  );
};

const CredentialsTab = ({ projectCode }: { projectCode: string }) => {
  const {
    data: credentials,
    isLoading,
    refetch,
  } = useProjectCredentialsQuery(projectCode);
  const createCredentialMutation = useCreateCredentialMutation();
  const updateCredentialMutation = useUpdateCredentialMutation();
  const deleteCredentialMutation = useDeleteCredentialMutation();

  const {
    open: isAddDialogOpen,
    onOpen: onAddDialogOpen,
    onClose: onAddDialogClose,
  } = useDisclosure();
  const [editingCredential, setEditingCredential] =
    useState<ProjectCredential | null>(null);
  const [deleteCredentialId, setDeleteCredentialId] = useState<number | null>(
    null
  );

  const handleAddOrUpdate = (data: CreateCredentialRequest) => {
    const submitData = { ...data };
    if (!submitData.password) {
      delete (submitData as any).password;
    }

    if (editingCredential) {
      updateCredentialMutation.mutate(
        { projectCode, credentialId: editingCredential.id, data: submitData },
        {
          onSuccess: () => {
            onAddDialogClose();
            setEditingCredential(null);
            refetch();
          },
        }
      );
    } else {
      createCredentialMutation.mutate(
        { projectCode, data: submitData },
        {
          onSuccess: () => {
            onAddDialogClose();
            refetch();
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <Stack gap={4}>
        {[1, 2, 3].map((i) => (
          <Box key={i} h="200px" bg="gray.100" borderRadius="lg" />
        ))}
      </Stack>
    );
  }

  return (
    <Stack gap={4}>
      <HStack justify="flex-end">
        <Button variant="primary" size="sm" onClick={onAddDialogOpen}>
          <Plus size={16} color="white" /> Add Credential
        </Button>
      </HStack>

      {!credentials || credentials.length === 0 ? (
        <Box
          p={6}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
        >
          <NoDataAvailable content="No credentials added yet" />
        </Box>
      ) : (
        credentials.map((credential) => (
          <CredentialRow
            key={credential.id}
            credential={credential}
            projectCode={projectCode}
            onEdit={(cred) => {
              setEditingCredential(cred);
              onAddDialogOpen();
            }}
            onDelete={(id) => setDeleteCredentialId(id)}
          />
        ))
      )}

      <AddCredentialModal
        isOpen={isAddDialogOpen}
        onClose={() => {
          onAddDialogClose();
          setEditingCredential(null);
        }}
        onSubmit={handleAddOrUpdate}
        isSubmitting={
          createCredentialMutation.isPending ||
          updateCredentialMutation.isPending
        }
        initialData={editingCredential}
      />

      <ConfirmationDialog
        open={!!deleteCredentialId}
        onClose={() => setDeleteCredentialId(null)}
        title="Delete Credential"
        action="delete this credential"
        handleSubmit={() => {
          if (deleteCredentialId) {
            deleteCredentialMutation.mutate(
              { projectCode, credentialId: deleteCredentialId },
              {
                onSuccess: () => {
                  setDeleteCredentialId(null);
                  refetch();
                },
              }
            );
          }
        }}
        submitActionPending={deleteCredentialMutation.isPending}
      />
    </Stack>
  );
};

// ============================================================
// Renewals Tab
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

const RenewalCard = ({
  renewal,
  projectCode,
}: {
  renewal: Renewal;
  projectCode: string;
}) => {
  const [showInstances, setShowInstances] = useState(false);
  const {
    open: isEditDialogOpen,
    onOpen: onEditDialogOpen,
    onClose: onEditDialogClose,
  } = useDisclosure();
  const updateRenewalMutation = useUpdateRenewalMutation();
  const changeStatusMutation = useChangeRenewalStatusMutation();
  const updateInstanceMutation = useUpdateRenewalInstanceMutation();
  const { data: renewalTypes } = useRenewalTypesQuery();
  const { data: employees } = useGetEmployeesQuery();
  const employeeList = employees?.content ?? [];
  const [statusToChange, setStatusToChange] = useState<RenewalStatus | null>(
    null
  );
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  const availableStatuses: RenewalStatus[] = [
    "ACTIVE",
    "COMPLETED",
    "CANCELLED",
  ].filter((s) => s !== renewal.status) as RenewalStatus[];

  const [formData, setFormData] = useState({
    renewalTypeId: renewal.renewalTypeId,
    title: renewal.title,
    description: renewal.description || "",
    recurrence: renewal.recurrence,
    startDate: renewal.startDate,
    endDate: renewal.endDate || "",
    assignedToId: renewal.assignedToId || "",
  });

  const handleUpdateRenewal = () => {
    updateRenewalMutation.mutate(
      {
        projectCode,
        renewalId: renewal.id,
        data: formData,
      },
      {
        onSuccess: () => {
          onEditDialogClose();
        },
      }
    );
  };

  const handleChangeStatus = (status: RenewalStatus) => {
    setIsStatusMenuOpen(false);
    setStatusToChange(status);
  };

  const handleUpdateInstance = (
    instanceId: number,
    status: "COMPLETED" | "PENDING",
    notes?: string
  ) => {
    updateInstanceMutation.mutate({
      projectCode,
      renewalId: renewal.id,
      instanceId,
      data: { status, notes: notes || "" },
    });
  };

  return (
    <>
      <Box
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        overflow="hidden"
      >
        {/* ---- Card Body ---- */}
        <Stack p={5} gap={4}>
          {/* Header: Icon + Title + Status */}
          <Flex gap={3} align="center" justify="space-between">
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
                <RefreshCw size={18} color="black" />
              </Flex>
              <VStack align="flex-start" gap={0} minW="0">
                <Text fontSize="sm" fontWeight="600" color="gray.900">
                  {renewal.title}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {renewal.renewalTypeName}
                </Text>
              </VStack>
            </HStack>
            <RenewalStatusBadge status={renewal.status} />
          </Flex>

          {/* Description */}
          {renewal.description && renewal.description.trim() !== "" && (
            <Text fontSize="xs" color="gray.600">
              {renewal.description}
            </Text>
          )}

          {/* Information Grid */}
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3 }}
            gap={{ base: 3, md: 6 }}
          >
            <VStack align="flex-start" gap={0}>
              <Text fontSize="xs" color="gray.500">
                Recurrence
              </Text>
              <Text fontSize="sm" color="gray.800">
                {renewal.recurrence}
              </Text>
            </VStack>
            <VStack align="flex-start" gap={0}>
              <Text fontSize="xs" color="gray.500">
                Assigned To
              </Text>
              <Text fontSize="sm" color="gray.800">
                {renewal.assignedToName || "Unassigned"}
              </Text>
            </VStack>
            <VStack align="flex-start" gap={0}>
              <Text fontSize="xs" color="gray.500">
                Start Date
              </Text>
              <Text fontSize="sm" color="gray.800">
                {formatDateDisplay(renewal.startDate)}
              </Text>
            </VStack>
            <VStack align="flex-start" gap={0}>
              <Text fontSize="xs" color="gray.500">
                End Date
              </Text>
              <Text fontSize="sm" color="gray.800">
                {formatDateDisplay(renewal.endDate)}
              </Text>
            </VStack>
            <VStack align="flex-start" gap={0}>
              <Text fontSize="xs" color="gray.500">
                Instances
              </Text>
              <Text fontSize="sm" color="gray.800">
                {renewal.instances.length}
              </Text>
            </VStack>
          </SimpleGrid>
        </Stack>

        {/* ---- Instances (expandable) ---- */}
        {showInstances && (
          <Box px={5} pb={4}>
            <Stack gap={2} pt={4} borderTop="1px solid" borderColor="gray.200">
              <Text fontSize="xs" fontWeight="600" color="gray.700">
                Renewal Instances
              </Text>
              {renewal.instances.length === 0 ? (
                <Text fontSize="xs" color="gray.500">
                  No instances yet
                </Text>
              ) : (
                renewal.instances.map((instance) => (
                  <Box
                    key={instance.id}
                    p={3}
                    bg="gray.50"
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
                          {formatDateDisplay(instance.dueDate)}
                        </Text>
                      </VStack>
                      <HStack gap={2} align="center">
                        <RenewalInstanceStatusBadge status={instance.status} />
                        {instance.status === "PENDING" && (
                          <Button
                            variant="ghost"
                            size="xs"
                            colorScheme="green"
                            onClick={() => {
                              const notes = prompt(
                                "Enter completion notes (optional):"
                              );
                              handleUpdateInstance(
                                instance.id,
                                "COMPLETED",
                                notes ?? undefined
                              );
                            }}
                            loading={updateInstanceMutation.isPending}
                          >
                            <CheckCircle size={12} />
                          </Button>
                        )}
                        {instance.status === "COMPLETED" && (
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => {
                              handleUpdateInstance(instance.id, "PENDING");
                            }}
                            loading={updateInstanceMutation.isPending}
                          >
                            <RefreshCw size={12} />
                          </Button>
                        )}
                      </HStack>
                    </HStack>
                    {instance.completedAt && (
                      <Text fontSize="xs" color="gray.600" mt={2}>
                        Completed: {formatDateDisplay(instance.completedAt)} by{" "}
                        {instance.completedByName}
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
          </Box>
        )}

        {/* ---- Footer ---- */}
        <Separator borderColor="gray.200" />
        <Flex
          px={5}
          py={3}
          justify="space-between"
          align="center"
          flexWrap="wrap"
          gap={2}
        >
          <Text fontSize="xs" color="gray.500">
            Created {formatDateDisplay(renewal.createdAt)}
          </Text>
          <HStack gap={1}>
            <Button variant="ghost" size="sm" onClick={onEditDialogOpen}>
              <Edit size={14} />
            </Button>
            {availableStatuses.length > 0 && (
              <PopoverRoot
                open={isStatusMenuOpen}
                onOpenChange={(details) => setIsStatusMenuOpen(details.open)}
              >
                <PopoverTrigger>
                  <Button variant="ghost" size="sm">
                    Change Status
                  </Button>
                </PopoverTrigger>
                <PopoverContent width="160px">
                  <Stack gap={0} p={1.5}>
                    {availableStatuses.map((status) => (
                      <Button
                        key={status}
                        variant="ghost"
                        size="sm"
                        justifyContent="flex-start"
                        color="gray.700"
                        _hover={{ bg: "gray.100" }}
                        onClick={() => handleChangeStatus(status)}
                      >
                        {status === "ACTIVE" && (
                          <CheckCircle size={14} color="green.500" />
                        )}
                        {status === "COMPLETED" && (
                          <CheckCircle size={14} color="green" />
                        )}
                        {status === "CANCELLED" && (
                          <XCircle size={14} color="red" />
                        )}
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </Button>
                    ))}
                  </Stack>
                </PopoverContent>
              </PopoverRoot>
            )}
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
        </Flex>
      </Box>

      <DialogRoot
        open={isEditDialogOpen}
        onOpenChange={(e) => {
          if (!e.open) onEditDialogClose();
        }}
      >
        <DialogContent maxW="600px" w="90vw">
          <DialogHeader>
            <DialogTitle>Edit Renewal</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <DialogBody maxH="70vh" overflowY="auto">
            <Stack gap={4}>
              <Box>
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  Renewal Type *
                </Text>
                <FieldSelect
                  placeholder="Select renewal type"
                  value={
                    formData.renewalTypeId ? String(formData.renewalTypeId) : ""
                  }
                  onChange={(value) =>
                    setFormData({ ...formData, renewalTypeId: Number(value) })
                  }
                >
                  {renewalTypes?.map((type) => (
                    <option key={type.id} value={String(type.id)}>
                      {type.name}
                    </option>
                  ))}
                </FieldSelect>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  Title *
                </Text>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter renewal title"
                  required
                />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  Description
                </Text>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter description"
                  rows={3}
                />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  Recurrence *
                </Text>
                <FieldSelect
                  placeholder="Select recurrence"
                  value={formData.recurrence}
                  onChange={(value) =>
                    setFormData({ ...formData, recurrence: value as any })
                  }
                >
                  <option value="ONE_TIME">One Time</option>
                  <option value="YEARLY">Yearly</option>
                  <option value="QUARTERLY">Quarterly</option>
                  <option value="MONTHLY">Monthly</option>
                </FieldSelect>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  Start Date *
                </Text>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  End Date
                </Text>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  min={formData.startDate || undefined}
                />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  Assigned To *
                </Text>
                <FieldSelect
                  placeholder="Select assignee"
                  value={formData.assignedToId}
                  onChange={(value) =>
                    setFormData({ ...formData, assignedToId: value })
                  }
                >
                  {employeeList.map((emp: any) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} - {emp.designation}
                    </option>
                  ))}
                </FieldSelect>
              </Box>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={onEditDialogClose}
              disabled={updateRenewalMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateRenewal}
              loading={updateRenewalMutation.isPending}
              disabled={
                !formData.renewalTypeId ||
                !formData.title ||
                !formData.startDate ||
                !formData.assignedToId
              }
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      <ConfirmationDialog
        open={!!statusToChange}
        onClose={() => setStatusToChange(null)}
        title="Change Renewal Status"
        action={`change the renewal status to ${statusToChange?.toLowerCase()}`}
        handleSubmit={() => {
          if (statusToChange) {
            changeStatusMutation.mutate(
              {
                projectCode,
                renewalId: renewal.id,
                status: statusToChange,
              },
              { onSuccess: () => setStatusToChange(null) }
            );
          }
        }}
        submitActionPending={changeStatusMutation.isPending}
      />
    </>
  );
};

const RenewalsTab = ({ projectCode }: { projectCode: string }) => {
  const {
    data: renewals,
    isLoading,
    refetch,
  } = useProjectRenewalsQuery(projectCode);
  const { data: renewalTypes } = useRenewalTypesQuery();
  const { data: employees } = useGetEmployeesQuery();
  const employeeList = employees?.content ?? [];
  const createRenewalMutation = useCreateRenewalMutation();

  const {
    open: isAddDialogOpen,
    onOpen: onAddDialogOpen,
    onClose: onAddDialogClose,
  } = useDisclosure();
  const [formData, setFormData] = useState({
    renewalTypeId: 0,
    title: "",
    description: "",
    recurrence: "ONE_TIME" as const,
    startDate: "",
    endDate: "",
    assignedToId: "",
  });

  const handleAddRenewal = () => {
    if (
      !formData.renewalTypeId ||
      !formData.title ||
      !formData.startDate ||
      !formData.assignedToId
    )
      return;
    createRenewalMutation.mutate(
      {
        projectCode,
        data: formData,
      },
      {
        onSuccess: () => {
          onAddDialogClose();
          setFormData({
            renewalTypeId: 0,
            title: "",
            description: "",
            recurrence: "ONE_TIME",
            startDate: "",
            endDate: "",
            assignedToId: "",
          });
          refetch();
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Stack gap={4}>
        {[1, 2, 3].map((i) => (
          <Box key={i} h="240px" bg="gray.100" borderRadius="lg" />
        ))}
      </Stack>
    );
  }

  return (
    <Stack gap={4}>
      <HStack justify="flex-end">
        <Button variant="primary" size="sm" onClick={onAddDialogOpen}>
          <Plus size={16} color="white" /> Add Renewal
        </Button>
      </HStack>

      {!renewals || renewals.length === 0 ? (
        <Box
          p={6}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
        >
          <NoDataAvailable content="No renewals added yet" />
        </Box>
      ) : (
        renewals.map((renewal) => (
          <RenewalCard
            key={renewal.id}
            renewal={renewal}
            projectCode={projectCode}
          />
        ))
      )}

      <DialogRoot
        open={isAddDialogOpen}
        onOpenChange={(e) => (e.open ? onAddDialogOpen() : onAddDialogClose())}
      >
        <DialogContent maxW="600px" w="90vw">
          <DialogHeader>
            <DialogTitle>Add Renewal</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <DialogBody maxH="70vh" overflowY="auto">
            <Stack gap={4}>
              <Box>
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  Renewal Type *
                </Text>
                <FieldSelect
                  placeholder="Select renewal type"
                  value={
                    formData.renewalTypeId ? String(formData.renewalTypeId) : ""
                  }
                  onChange={(value) =>
                    setFormData({ ...formData, renewalTypeId: Number(value) })
                  }
                >
                  {renewalTypes?.map((type) => (
                    <option key={type.id} value={String(type.id)}>
                      {type.name}
                    </option>
                  ))}
                </FieldSelect>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  Title *
                </Text>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter renewal title"
                  required
                />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  Description
                </Text>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter description"
                  rows={3}
                />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  Recurrence *
                </Text>
                <FieldSelect
                  placeholder="Select recurrence"
                  value={formData.recurrence}
                  onChange={(value) =>
                    setFormData({ ...formData, recurrence: value as any })
                  }
                >
                  <option value="ONE_TIME">One Time</option>
                  <option value="YEARLY">Yearly</option>
                  <option value="QUARTERLY">Quarterly</option>
                  <option value="MONTHLY">Monthly</option>
                </FieldSelect>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  Start Date *
                </Text>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  End Date
                </Text>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  min={formData.startDate || undefined}
                />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  Assigned To *
                </Text>
                <FieldSelect
                  placeholder="Select assignee"
                  value={formData.assignedToId}
                  onChange={(value) =>
                    setFormData({ ...formData, assignedToId: value })
                  }
                >
                  {employeeList.map((emp: any) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} - {emp.designation}
                    </option>
                  ))}
                </FieldSelect>
              </Box>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={onAddDialogClose}
              disabled={createRenewalMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddRenewal}
              loading={createRenewalMutation.isPending}
              disabled={
                !formData.renewalTypeId ||
                !formData.title ||
                !formData.startDate ||
                !formData.assignedToId
              }
            >
              Add Renewal
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </Stack>
  );
};

// ============================================================
// Team Tab
// ============================================================

const MemberRoleBadge = ({ role }: { role: string }) => {
  const roleConfig: Record<
    string,
    { bg: string; color: string; label: string }
  > = {
    OWNER: { bg: "purple.50", color: "purple.700", label: "Owner" },
    MEMBER: { bg: "blue.50", color: "blue.700", label: "Member" },
    VIEWER: { bg: "gray.50", color: "gray.700", label: "Viewer" },
  };

  const config = roleConfig[role] || roleConfig.MEMBER;

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

const TeamTab = ({ projectCode }: { projectCode: string }) => {
  const {
    data: members,
    isLoading,
    refetch,
  } = useProjectMembersQuery(projectCode);
  const { data: employees } = useGetEmployeesQuery();
  const employeeList = employees?.content ?? [];
  const addMemberMutation = useAddProjectMemberMutation();
  const removeMemberMutation = useRemoveProjectMemberMutation();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState<"MEMBER" | "VIEWER">(
    "MEMBER"
  );
  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);

  const handleAddMember = () => {
    if (!selectedUserId) return;
    addMemberMutation.mutate(
      {
        projectCode,
        data: { userId: selectedUserId, role: selectedRole },
      },
      {
        onSuccess: () => {
          setIsAddDialogOpen(false);
          setSelectedUserId("");
          setSelectedRole("MEMBER");
          refetch();
        },
      }
    );
  };

  const handleRemoveMember = (userId: string) => {
    setDeleteMemberId(userId);
  };

  if (isLoading) {
    return (
      <Stack gap={3}>
        {[1, 2, 3].map((i) => (
          <Box key={i} h="80px" bg="gray.100" borderRadius="md" />
        ))}
      </Stack>
    );
  }

  if (!members || members.length === 0) {
    return (
      <Box
        p={6}
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
      >
        <NoDataAvailable content="No team members added yet" />
      </Box>
    );
  }

  return (
    <Stack gap={3}>
      <HStack justify="flex-end">
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus size={16} color="white" /> Add Member
        </Button>
      </HStack>
      {members.map((member) => (
        <Box
          key={member.id}
          p={4}
          bg="gray.50"
          borderRadius="md"
          border="1px solid"
          borderColor="gray.200"
        >
          <HStack
            justify="space-between"
            align="center"
            flexWrap="wrap"
            gap={2}
          >
            <VStack align="flex-start" gap={1}>
              <Text fontSize="sm" fontWeight="600" color="gray.900">
                {member.userName}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {member.userEmail}
              </Text>
              <Text fontSize="xs" color="gray.400">
                Added: {new Date(member.addedAt).toLocaleDateString()}
              </Text>
            </VStack>
            <HStack gap={3} align="center">
              <MemberRoleBadge role={member.roleInProject} />
              {member.roleInProject !== "OWNER" && (
                <Button
                  variant="ghost"
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleRemoveMember(member.userId)}
                  loading={removeMemberMutation.isPending}
                >
                  <Trash2 size={14} />
                </Button>
              )}
            </HStack>
          </HStack>
        </Box>
      ))}

      <DialogRoot
        open={isAddDialogOpen}
        onOpenChange={(e) => setIsAddDialogOpen(e.open)}
      >
        <DialogContent maxW="600px" w="90vw">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <DialogBody maxH="70vh" overflowY="auto">
            <Stack gap={4}>
              <Box>
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  Select Employee *
                </Text>
                <FieldSelect
                  placeholder="Select employee"
                  value={selectedUserId}
                  onChange={setSelectedUserId}
                >
                  {employeeList.map((emp: any) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} - {emp.designation}
                    </option>
                  ))}
                </FieldSelect>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  Role *
                </Text>
                <FieldSelect
                  placeholder="Select role"
                  value={selectedRole}
                  onChange={(value) =>
                    setSelectedRole(value as "MEMBER" | "VIEWER")
                  }
                >
                  <option value="MEMBER">Member</option>
                  <option value="VIEWER">Viewer</option>
                </FieldSelect>
              </Box>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={addMemberMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddMember}
              loading={addMemberMutation.isPending}
              disabled={!selectedUserId}
            >
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </Stack>
  );
};

// ============================================================
// Main Component
// ============================================================

const ProjectDetailPage = () => {
  const navigate = useNavigate();
  const { projectCode } = useParams<{ projectCode: string }>();
  const {
    canCreate,
    canEdit,
    canDelete,
    canCredentialView,
    canCredentialReveal,
  } = useModulePermissions("PROJECT_MANAGEMENT");
  const [activeTab, setActiveTab] = useState("overview");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [statusToChange, setStatusToChange] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    data: project,
    isLoading,
    isError,
    refetch,
  } = useProjectByCodeQuery(projectCode || "");
  const updateProjectMutation = useUpdateProjectMutation();
  const changeStatusMutation = useChangeProjectStatusMutation();
  const deleteProjectMutation = useDeleteProjectMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("edit");
  const [selectedProjectCode, setSelectedProjectCode] = useState<
    string | undefined
  >();

  const handleEditProject = () => {
    setModalMode("edit");
    setSelectedProjectCode(projectCode);
    setModalOpen(true);
  };

  const handleDeleteProject = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProject = () => {
    if (!projectCode) return;
    deleteProjectMutation.mutate(projectCode, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        navigate("/projects");
      },
    });
  };

  const handleChangeStatus = (status: string) => {
    if (!projectCode) return;
    setStatusToChange(status);
  };

  const tabs = [
    { label: "Overview", value: "overview" },
    { label: "Credentials", value: "credentials" },
    { label: "Renewals", value: "renewals" },
    { label: "Team", value: "team" },
  ];

  // Loading state
  if (isLoading) {
    return (
      <Stack gap={6} padding={2}>
        <Button variant="ghost" size="sm" onClick={() => navigate("/projects")}>
          <ArrowLeft size={16} /> Back to Projects
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
        <Button variant="ghost" size="sm" onClick={() => navigate("/projects")}>
          <ArrowLeft size={16} /> Back to Projects
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
        <Button variant="ghost" size="sm" onClick={() => navigate("/projects")}>
          <ArrowLeft size={16} /> Back to Projects
        </Button>
        <HStack gap={2}>
          {/* <Button variant="ghost" size="sm" onClick={() => refetch()}>
            <RefreshCw size={16} />
          </Button> */}
          {canEdit && (
            <Button variant="outline" size="sm" onClick={handleEditProject}>
              <Edit size={16} /> Edit
            </Button>
          )}
          <PopoverRoot
            open={isMenuOpen}
            onOpenChange={(details) => setIsMenuOpen(details.open)}
          >
            <PopoverTrigger>
              <IconButton variant="ghost" size="sm">
                <MoreVertical size={16} />
              </IconButton>
            </PopoverTrigger>
            <PopoverContent width="200px">
              <Stack gap={0} p={1.5}>
                {project.status !== "ACTIVE" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    justifyContent="flex-start"
                    gap={2}
                    color="green.600"
                    _hover={{ bg: "gray.100" }}
                    onClick={() => handleChangeStatus("ACTIVE")}
                  >
                    <CheckCircle size={14} color="green" /> Set Active
                  </Button>
                )}
                {project.status !== "ON_HOLD" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    justifyContent="flex-start"
                    gap={2}
                    color="gray.700"
                    _hover={{ bg: "gray.100" }}
                    onClick={() => handleChangeStatus("ON_HOLD")}
                  >
                    <PauseCircle size={14} /> Put on Hold
                  </Button>
                )}
                <Box
                  borderTop="1px solid"
                  borderColor="gray.200"
                  mx={2}
                  my={1}
                />
                {canDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    justifyContent="flex-start"
                    gap={2}
                    color="red.600"
                    _hover={{ bg: "red.50" }}
                    onClick={handleDeleteProject}
                  >
                    <Trash2 size={14} /> Delete Project
                  </Button>
                )}
              </Stack>
            </PopoverContent>
          </PopoverRoot>
        </HStack>
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
            <HStack gap={2}>
              <Users size={16} color="#6b7280" />
              <Text fontSize="sm" color="gray.600">
                {project.members.length} Members
              </Text>
            </HStack>
          </HStack>
        </HStack>

        <HStack gap={2} flexWrap="wrap">
          <Text fontSize="sm" color="gray.600">
            <strong>Client:</strong> {project.clientName}
          </Text>
          <Text fontSize="sm" color="gray.600">
            <strong>Owner:</strong> {project.ownerName}
          </Text>
        </HStack>
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
              case "credentials":
                return <CredentialsTab projectCode={project.projectCode} />;
              case "renewals":
                return <RenewalsTab projectCode={project.projectCode} />;
              case "team":
                return <TeamTab projectCode={project.projectCode} />;
              default:
                return null;
            }
          }}
        />
      </Box>

      <ConfirmationDialog
        open={!!statusToChange}
        onClose={() => setStatusToChange(null)}
        title="Change Project Status"
        action={`change the project status to ${statusToChange}`}
        handleSubmit={() => {
          if (statusToChange && projectCode) {
            changeStatusMutation.mutate(
              { projectCode, status: statusToChange },
              { onSuccess: () => setStatusToChange(null) }
            );
          }
        }}
        submitActionPending={changeStatusMutation.isPending}
      />

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete Project"
        action="permanently delete this project and all its data"
        handleSubmit={confirmDeleteProject}
        submitActionPending={deleteProjectMutation.isPending}
      />

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

export default ProjectDetailPage;
