import {
  Badge,
  Box,
  Button,
  HStack,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Plus, Trash2, User, Users, X } from "lucide-react";
import { useState } from "react";

import {
  useCreateMatterAssignmentMutation,
  useMatterAssignmentsQuery,
  useRemoveMatterAssignmentMutation,
} from "../api/dashboard.api";
import { MatterAssignment } from "../types/dashboard.types";
import { useGetEmployeesQuery } from "@/api/employeeManagement";

// ============================================================
// Assignment Role Badge
// ============================================================

const AssignmentRoleBadge = ({ role }: { role: string }) => {
  const roleColors: Record<string, { bg: string; color: string }> = {
    PRIMARY_ADVOCATE: { bg: "blue.50", color: "blue.700" },
    CO_ADVOCATE: { bg: "cyan.50", color: "cyan.700" },
    PARALEGAL: { bg: "teal.50", color: "teal.700" },
    JUNIOR: { bg: "purple.50", color: "purple.700" },
    SUPERVISOR: { bg: "amber.50", color: "amber.700" },
  };

  const colors = roleColors[role] || { bg: "gray.50", color: "gray.700" };
  const label = role.replace(/_/g, " ");

  return (
    <Badge
      px={2}
      py={0.5}
      borderRadius="full"
      fontSize="xs"
      fontWeight="600"
      bg={colors.bg}
      color={colors.color}
    >
      {label}
    </Badge>
  );
};

// ============================================================
// Add Team Member Modal
// ============================================================

const AddTeamMemberModal = ({
  isOpen,
  onClose,
  matterNumber,
  onCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  matterNumber: string;
  onCreate: (data: {
    userId: string;
    assignmentRole:
      | "PRIMARY_ADVOCATE"
      | "CO_ADVOCATE"
      | "PARALEGAL"
      | "JUNIOR"
      | "SUPERVISOR";
  }) => void;
}) => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState<
    "PRIMARY_ADVOCATE" | "CO_ADVOCATE" | "PARALEGAL" | "JUNIOR" | "SUPERVISOR"
  >("PARALEGAL");

  const { data: employees } = useGetEmployeesQuery();
  const employeeList = employees?.content ?? [];

  const handleSubmit = () => {
    if (selectedUserId && selectedRole) {
      onCreate({ userId: selectedUserId, assignmentRole: selectedRole });
      setSelectedUserId("");
      setSelectedRole("PARALEGAL");
      onClose();
    }
  };

  const roles = [
    { value: "PRIMARY_ADVOCATE", label: "Primary Advocate" },
    { value: "CO_ADVOCATE", label: "Co-Advocate" },
    { value: "PARALEGAL", label: "Paralegal" },
    { value: "JUNIOR", label: "Junior" },
    { value: "SUPERVISOR", label: "Supervisor" },
  ];

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      inset={0}
      bg="rgba(0, 0, 0, 0.5)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1000}
      onClick={onClose}
    >
      <Box
        bg="white"
        borderRadius="xl"
        p={6}
        w="full"
        maxW="md"
        onClick={(e) => e.stopPropagation()}
      >
        <HStack justify="space-between" mb={4}>
          <Text fontSize="lg" fontWeight="600" color="gray.900">
            Add Team Member
          </Text>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </HStack>

        <Stack gap={4}>
          <Box>
            <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
              Select Employee
            </Text>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              <option value="">Select an employee...</option>
              {employeeList.map((emp: any) => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName} - {emp.designation}
                </option>
              ))}
            </select>
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
              Assignment Role
            </Text>
            <select
              value={selectedRole}
              onChange={(e) =>
                setSelectedRole(
                  e.target.value as
                    | "PRIMARY_ADVOCATE"
                    | "CO_ADVOCATE"
                    | "PARALEGAL"
                    | "JUNIOR"
                    | "SUPERVISOR"
                )
              }
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </Box>

          <HStack gap={2} justify="flex-end" mt={2}>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!selectedUserId}
            >
              Add Member
            </Button>
          </HStack>
        </Stack>
      </Box>
    </Box>
  );
};

// ============================================================
// Matter Team Component
// ============================================================

interface MatterTeamProps {
  matterNumber: string;
  matterTitle?: string;
}

export const MatterTeam = ({ matterNumber, matterTitle }: MatterTeamProps) => {
  const { data: assignments = [], isLoading } =
    useMatterAssignmentsQuery(matterNumber);
  const createMutation = useCreateMatterAssignmentMutation();
  const removeMutation = useRemoveMatterAssignmentMutation();

  const { open, onOpen, onClose } = useDisclosure();

  const handleAddMember = (data: {
    userId: string;
    assignmentRole:
      | "PRIMARY_ADVOCATE"
      | "CO_ADVOCATE"
      | "PARALEGAL"
      | "JUNIOR"
      | "SUPERVISOR";
  }) => {
    createMutation.mutate({
      matterNumber,
      data: { data },
    });
  };

  const handleRemoveMember = (userId: string) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      removeMutation.mutate({ matterNumber, userId });
    }
  };

  // Group assignments by role
  const groupedAssignments = assignments.reduce(
    (acc: Record<string, MatterAssignment[]>, assignment: MatterAssignment) => {
      if (!acc[assignment.assignmentRole]) {
        acc[assignment.assignmentRole] = [];
      }
      acc[assignment.assignmentRole].push(assignment);
      return acc;
    },
    {} as Record<string, MatterAssignment[]>
  );

  const roleOrder = [
    "PRIMARY_ADVOCATE",
    "CO_ADVOCATE",
    "PARALEGAL",
    "JUNIOR",
    "SUPERVISOR",
  ];

  if (isLoading) {
    return (
      <Box
        p={6}
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
      >
        <Stack gap={3}>
          <Box h="20px" w="150px" bg="gray.100" borderRadius="md" />
          <Box h="40px" w="100%" bg="gray.100" borderRadius="md" />
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      p={6}
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
    >
      <HStack justify="space-between" align="flex-start" mb={4}>
        <HStack gap={2}>
          <Users size={18} color="#6b7280" />
          <Text fontSize="lg" fontWeight="600" color="gray.900">
            Matter Team
          </Text>
        </HStack>
        <Button variant="ghost" size="sm" onClick={onOpen}>
          <Plus size={16} />
          Add Member
        </Button>
      </HStack>

      {assignments.length === 0 ? (
        <Box py={8} textAlign="center">
          <User size={32} color="#d1d5db" />
          <Text fontSize="sm" color="gray.500" mt={2}>
            No team members assigned
          </Text>
        </Box>
      ) : (
        <Stack gap={4}>
          {roleOrder
            .filter((role) => groupedAssignments[role]?.length > 0)
            .map((role) => (
              <Box key={role}>
                <Text fontSize="xs" fontWeight="600" color="gray.500" mb={2}>
                  <AssignmentRoleBadge role={role} />
                </Text>
                <VStack align="flex-start" gap={2} pl={2}>
                  {groupedAssignments[role].map((assignment) => (
                    <HStack
                      key={assignment.id}
                      justify="space-between"
                      w="full"
                      p={2}
                      bg="gray.50"
                      borderRadius="md"
                    >
                      <HStack gap={2}>
                        <User size={16} color="#6b7280" />
                        <Text fontSize="sm" fontWeight="500" color="gray.900">
                          {assignment.userName}
                        </Text>
                      </HStack>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleRemoveMember(assignment.userId)}
                      >
                        <Trash2 size={14} color="#ef4444" />
                      </Button>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            ))}
        </Stack>
      )}

      <AddTeamMemberModal
        isOpen={open}
        onClose={onClose}
        matterNumber={matterNumber}
        onCreate={handleAddMember}
      />
    </Box>
  );
};
