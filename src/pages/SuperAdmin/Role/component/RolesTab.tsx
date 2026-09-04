import {
  Badge,
  Box,
  Button,
  Grid,
  HStack,
  IconButton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { RefreshCw, Shield, Users } from "lucide-react";

import {
  RoleResponseType,
  useDeleteRoleMutation,
  useGetRoleQuery,
  useToggleRoleMutation,
} from "@/api/roleSetup.ts/index.ts";
import { AddIcon } from "@/assets/svgs";
import { Datatable, TableActions } from "@/shared/components";
import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";
import { Switch, Tooltip } from "@/shared/components/ui";

import { AddEditRole } from "../AddEditRole";
import { RoleUsersDrawer } from "./RoleUsersDrawer";

interface RoleToToggle {
  id: string;
  name: string;
  active: boolean;
}

interface RoleToDelete {
  id: string;
  name: string;
}

const SummaryCard = ({
  title,
  value,
  color = "gray.900",
}: {
  title: string;
  value: number;
  color?: string;
}) => (
  <Box p={4} bg="white" borderRadius="lg" borderWidth="1px" boxShadow="sm">
    <Text fontSize="sm" color="gray.500" mb={2}>
      {title}
    </Text>
    <Text fontSize="2xl" fontWeight="700" color={color}>
      {value}
    </Text>
  </Box>
);

// Role-centric view: list, create, edit, activate/deactivate and delete roles.
const RolesTab = () => {
  const [selectedId, setSelectedId] = useState<string>();
  const [roleToToggle, setRoleToToggle] = useState<RoleToToggle | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<RoleToDelete | null>(null);
  const [usersRole, setUsersRole] = useState<{
    roleId: string;
    roleName: string;
  } | null>(null);

  const {
    open: addEditOpen,
    onOpen: onAddEditOpen,
    onClose: onAddEditClose,
  } = useDisclosure();

  const {
    open: toggleConfirmOpen,
    onOpen: onToggleConfirmOpen,
    onClose: onToggleConfirmClose,
  } = useDisclosure();

  const {
    open: deleteConfirmOpen,
    onOpen: onDeleteConfirmOpen,
    onClose: onDeleteConfirmClose,
  } = useDisclosure();

  const {
    open: usersDrawerOpen,
    onOpen: onUsersDrawerOpen,
    onClose: onUsersDrawerClose,
  } = useDisclosure();

  const {
    data: roleResponse,
    isLoading,
    isError,
    refetch,
  } = useGetRoleQuery();
  const { mutate: toggleRole, isPending: isTogglePending } =
    useToggleRoleMutation();
  const { mutate: deleteRole, isPending: isDeletePending } =
    useDeleteRoleMutation();

  const roles: RoleResponseType[] = roleResponse?.data ?? [];
  const totalRoles = roles.length;
  const activeRoles = roles.filter((role) => role.isActive).length;
  const inactiveRoles = totalRoles - activeRoles;
  const systemRoles = roles.filter((role) => role.isSystem).length;

  const columns: Array<ColumnDef<RoleResponseType>> = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Role",
        cell: ({ row }) => (
          <Stack gap={1} minW="160px">
            <Text fontWeight="600" fontSize="sm">
              {row.original.name}
            </Text>
            {row.original.code && (
              <Badge
                bg="gray.100"
                color="gray.600"
                px="2"
                py="0.5"
                borderRadius="md"
                fontSize="xs"
                fontWeight="600"
                fontFamily="mono"
                width="fit-content"
              >
                {row.original.code}
              </Badge>
            )}
          </Stack>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <Text
            fontSize="sm"
            color="gray.600"
            maxW="260px"
            lineClamp={2}
            title={row.original.description || undefined}
          >
            {row.original.description || "—"}
          </Text>
        ),
      },
      {
        id: "users",
        header: "Users",
        cell: ({ row }) => (
          <Tooltip content="View assigned users">
            <Button
              variant="ghost"
              size="sm"
              minW="0"
              px={2}
              aria-label={`View users assigned to ${row.original.name}`}
              onClick={() => {
                setUsersRole({
                  roleId: row.original.id,
                  roleName: row.original.name,
                });
                onUsersDrawerOpen();
              }}
            >
              <HStack gap={1.5}>
                <Users size={14} color="gray" />
                <Text fontSize="sm" fontWeight="500">
                  {row.original.userCount ?? 0}
                </Text>
              </HStack>
            </Button>
          </Tooltip>
        ),
      },
      {
        accessorKey: "isSystem",
        header: "Type",
        cell: ({ row }) =>
          row.original.isSystem ? (
            <Badge
              bg="blue.50"
              color="blue.700"
              px="2.5"
              py="1"
              borderRadius="md"
              fontSize="xs"
              fontWeight="600"
            >
              System
            </Badge>
          ) : (
            <Badge
              bg="gray.100"
              color="gray.600"
              px="2.5"
              py="1"
              borderRadius="md"
              fontSize="xs"
              fontWeight="600"
            >
              Custom
            </Badge>
          ),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <HStack gap={2}>
            <Switch
              checked={row.original.isActive ?? true}
              onCheckedChange={() => {
                setRoleToToggle({
                  id: row.original.id,
                  name: row.original.name,
                  active: row.original.isActive ?? true,
                });
                onToggleConfirmOpen();
              }}
            />
            <Text
              fontSize="sm"
              color={row.original.isActive ? "green.600" : "gray.500"}
            >
              {row.original.isActive ? "Active" : "Inactive"}
            </Text>
          </HStack>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <TableActions
            onEdit={() => {
              setSelectedId(row.original.id);
              onAddEditOpen();
            }}
            onDelete={
              row.original.isSystem
                ? undefined
                : () => {
                    setRoleToDelete({
                      id: row.original.id,
                      name: row.original.name,
                    });
                    onDeleteConfirmOpen();
                  }
            }
          />
        ),
      },
    ],
    [onToggleConfirmOpen, onAddEditOpen, onDeleteConfirmOpen, onUsersDrawerOpen]
  );

  return (
    <Stack gap={6}>
      {/* Toolbar */}
      <HStack justifyContent="flex-end" alignItems="center" gap={2}>
        <IconButton
          aria-label="Refresh roles"
          variant="outline"
          size="sm"
          onClick={() => refetch()}
        >
          <RefreshCw size={16} />
        </IconButton>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedId("");
            onAddEditOpen();
          }}
        >
          <AddIcon color="white" />
          Create Role
        </Button>
      </HStack>

      {/* Summary */}
      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
        gap={4}
      >
        <SummaryCard title="Total Roles" value={totalRoles} />
        <SummaryCard title="Active Roles" value={activeRoles} color="green.500" />
        <SummaryCard
          title="Inactive Roles"
          value={inactiveRoles}
          color="red.500"
        />
        <SummaryCard title="System Roles" value={systemRoles} color="blue.500" />
      </Grid>

      {/* Roles list */}
      <Box overflowX="auto" pb={1}>
        {isLoading ? (
          <Datatable isLoading columns={columns} data={[]} />
        ) : isError ? (
          <Box
            textAlign="center"
            py={12}
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
          >
            <Text fontSize="lg" color="red.500" mb={4}>
              Failed to load roles
            </Text>
            <Button onClick={() => refetch()} colorScheme="blue">
              Retry
            </Button>
          </Box>
        ) : roles.length === 0 ? (
          <Box
            p={12}
            textAlign="center"
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
          >
            <HStack gap={4} justify="center">
              <Box bg="gray.100" borderRadius="full" p={6}>
                <Shield size={40} color="gray" />
              </Box>
              <Stack gap={1} align="flex-start">
                <Text fontSize="xl" fontWeight="600">
                  No roles found
                </Text>
                <Text fontSize="md" color="gray.500">
                  Create a role to get started.
                </Text>
              </Stack>
            </HStack>
          </Box>
        ) : (
          <Datatable isLoading={false} columns={columns} data={roles} />
        )}
      </Box>

      {/* Create / Edit drawer */}
      <AddEditRole
        open={addEditOpen}
        onClose={onAddEditClose}
        id={selectedId}
        setId={setSelectedId}
      />

      {/* Assigned users drawer */}
      <RoleUsersDrawer
        roleId={usersRole?.roleId ?? null}
        roleName={usersRole?.roleName ?? ""}
        isOpen={usersDrawerOpen && !!usersRole}
        onClose={() => {
          onUsersDrawerClose();
          setUsersRole(null);
        }}
      />

      {/* Toggle status confirmation */}
      <ConfirmationDialog
        open={toggleConfirmOpen}
        onClose={() => {
          onToggleConfirmClose();
          setRoleToToggle(null);
        }}
        title={
          roleToToggle?.active
            ? `Deactivate "${roleToToggle?.name ?? ""}" role?`
            : `Activate "${roleToToggle?.name ?? ""}" role?`
        }
        action={
          roleToToggle?.active ? "deactivate this role" : "activate this role"
        }
        handleSubmit={() => {
          if (roleToToggle) {
            toggleRole(roleToToggle.id);
            onToggleConfirmClose();
            setRoleToToggle(null);
          }
        }}
        submitActionPending={isTogglePending}
      />

      {/* Delete confirmation */}
      <ConfirmationDialog
        open={deleteConfirmOpen}
        onClose={() => {
          onDeleteConfirmClose();
          setRoleToDelete(null);
        }}
        title={`Delete "${roleToDelete?.name ?? ""}" role?`}
        action="delete this role"
        handleSubmit={() => {
          if (roleToDelete) {
            deleteRole(roleToDelete.id, {
              onSuccess: () => {
                onDeleteConfirmClose();
                setRoleToDelete(null);
              },
            });
          }
        }}
        submitActionPending={isDeletePending}
      />
    </Stack>
  );
};

export default RolesTab;
