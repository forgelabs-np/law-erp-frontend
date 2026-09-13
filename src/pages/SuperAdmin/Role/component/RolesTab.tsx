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
import { useCallback, useMemo, useState } from "react";
import { KeyRound, RefreshCw, Shield, Users } from "lucide-react";

import {
  FirmRole,
  useCreateFirmRoleMutation,
  useDeleteFirmRoleMutation,
  useFirmRolesQuery,
  useToggleFirmRoleMutation,
} from "@/api/firmRoleSetup";
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
import { useRole } from "@/shared/hooks/useAuth";
import { useModulePermissions } from "@/shared/hooks/usePermissions";
import { isSuperAdminRole } from "@/shared/utils/role";

import { AddEditRole } from "../AddEditRole";
import { FirmRolePermissionsDrawer } from "./FirmRolePermissionsDrawer";
import { RoleCreateDrawer } from "./RoleCreateDrawer";
import { RoleUsersDrawer } from "./RoleUsersDrawer";

/** Firm Admin's own role can never be deleted or toggled by the firm. */
const FIRM_ADMIN_ROLE_CODE = "FIRM_ADMIN";

interface RoleToToggle {
  id: string;
  name: string;
  active: boolean;
}

interface RoleToDelete {
  id: string;
  name: string;
}

/** Normalised row shape shared by Super Admin and firm role payloads. */
interface RoleTableRow {
  id: string;
  name: string;
  code: string;
  description?: string;
  isSystem: boolean;
  isActive: boolean;
  userCount?: number;
  permissionCount: number;
}

const toTableRow = (role: RoleResponseType | FirmRole): RoleTableRow => ({
  id: role.id,
  name: role.name,
  code: role.code,
  description: role.description,
  isSystem: role.isSystem,
  isActive: role.isActive,
  userCount: role.userCount,
  permissionCount: role.permissions?.length ?? 0,
});

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

/**
 * Role-centric view: list, create, edit, activate/deactivate and delete roles.
 *
 * Super Admin manages platform system roles through `/admin/roles`.
 * Firm users manage their own firm's roles through `/firm/roles`, where the
 * assignable permissions are limited to the Firm Admin ceiling.
 */
const RolesTab = () => {
  const role = useRole();
  const isSuperAdmin = isSuperAdminRole(role);
  const modulePermissions = useModulePermissions("ROLE_MANAGEMENT");

  // Super Admin has a hardcoded backend bypass, so it is never gated by the
  // (possibly empty) permission rows returned for the platform account.
  const canCreate = isSuperAdmin || modulePermissions.canCreate;
  const canEdit = isSuperAdmin || modulePermissions.canEdit;
  const canDelete = isSuperAdmin || modulePermissions.canDelete;

  const [selectedId, setSelectedId] = useState<string>();
  const [roleToToggle, setRoleToToggle] = useState<RoleToToggle | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<RoleToDelete | null>(null);
  const [usersRole, setUsersRole] = useState<{
    roleId: string;
    roleName: string;
  } | null>(null);
  const [permissionsRole, setPermissionsRole] = useState<{
    roleId: string;
    roleName: string;
  } | null>(null);

  const {
    open: addEditOpen,
    onOpen: onAddEditOpen,
    onClose: onAddEditClose,
  } = useDisclosure();

  const {
    open: createOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const {
    open: permissionsOpen,
    onOpen: onPermissionsOpen,
    onClose: onPermissionsClose,
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

  // Only the endpoint that matches the current user's scope is queried.
  const systemRolesQuery = useGetRoleQuery({ enabled: isSuperAdmin });
  const firmRolesQuery = useFirmRolesQuery({ enabled: !isSuperAdmin });

  const { mutate: toggleSystemRole, isPending: isToggleSystemPending } =
    useToggleRoleMutation();
  const { mutate: toggleFirmRole, isPending: isToggleFirmPending } =
    useToggleFirmRoleMutation();
  const { mutate: deleteSystemRole, isPending: isDeleteSystemPending } =
    useDeleteRoleMutation();
  const { mutate: deleteFirmRole, isPending: isDeleteFirmPending } =
    useDeleteFirmRoleMutation();
  const { mutate: createFirmRole, isPending: isCreateFirmPending } =
    useCreateFirmRoleMutation();

  const isPendingToggle = isSuperAdmin
    ? isToggleSystemPending
    : isToggleFirmPending;
  const isPendingDelete = isSuperAdmin
    ? isDeleteSystemPending
    : isDeleteFirmPending;

  const isLoading = isSuperAdmin
    ? systemRolesQuery.isLoading
    : firmRolesQuery.isLoading;
  const isError = isSuperAdmin
    ? systemRolesQuery.isError
    : firmRolesQuery.isError;
  const refetch = isSuperAdmin
    ? systemRolesQuery.refetch
    : firmRolesQuery.refetch;

  const roles: RoleTableRow[] = useMemo(() => {
    if (isSuperAdmin) {
      const data = systemRolesQuery.data?.data ?? [];
      return data.map(toTableRow);
    }
    return (firmRolesQuery.data ?? []).map(toTableRow);
  }, [isSuperAdmin, systemRolesQuery.data, firmRolesQuery.data]);

  const totalRoles = roles.length;
  const activeRoles = roles.filter((item) => item.isActive).length;
  const inactiveRoles = totalRoles - activeRoles;
  const flaggedRoles = roles.filter((item) =>
    isSuperAdmin ? item.isSystem : !item.isSystem
  ).length;

  const openUsersDrawer = useCallback(
    (row: RoleTableRow) => {
      setUsersRole({ roleId: row.id, roleName: row.name });
      onUsersDrawerOpen();
    },
    [onUsersDrawerOpen]
  );

  const openPermissionsDrawer = useCallback(
    (row: RoleTableRow) => {
      setPermissionsRole({ roleId: row.id, roleName: row.name });
      onPermissionsOpen();
    },
    [onPermissionsOpen]
  );

  const columns: Array<ColumnDef<RoleTableRow>> = useMemo(
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
              onClick={() => openUsersDrawer(row.original)}
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
        id: "permissions",
        header: "Permissions",
        cell: ({ row }) => (
          <Badge
            bg="primary.50"
            color="primary.700"
            px="2.5"
            py="1"
            borderRadius="md"
            fontSize="xs"
            fontWeight="600"
          >
            {row.original.permissionCount}
          </Badge>
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
        cell: ({ row }) => {
          // The backend forbids a firm from toggling its own FIRM_ADMIN role.
          const isProtectedFirmAdmin =
            !isSuperAdmin &&
            row.original.code?.toUpperCase() === FIRM_ADMIN_ROLE_CODE;

          return (
            <HStack gap={2}>
              <Switch
                checked={row.original.isActive ?? true}
                disabled={isProtectedFirmAdmin}
                title={
                  isProtectedFirmAdmin
                    ? "The Firm Admin role cannot be deactivated."
                    : undefined
                }
                aria-label={`Toggle ${row.original.name} status`}
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
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const isProtectedFirmAdmin =
            !isSuperAdmin &&
            row.original.code?.toUpperCase() === FIRM_ADMIN_ROLE_CODE;

          if (isSuperAdmin) {
            return (
              <TableActions
                onEdit={
                  canEdit
                    ? () => {
                        setSelectedId(row.original.id);
                        onAddEditOpen();
                      }
                    : undefined
                }
                onDelete={
                  canDelete && !row.original.isSystem
                    ? () => {
                        setRoleToDelete({
                          id: row.original.id,
                          name: row.original.name,
                        });
                        onDeleteConfirmOpen();
                      }
                    : undefined
                }
              />
            );
          }

          return (
            <HStack gap={1}>
              <Tooltip content="Edit permissions">
                <IconButton
                  aria-label={`Edit permissions for ${row.original.name}`}
                  variant="ghost"
                  size="sm"
                  disabled={!canEdit}
                  onClick={() => openPermissionsDrawer(row.original)}
                >
                  <KeyRound size={16} />
                </IconButton>
              </Tooltip>
              <Tooltip content="View assigned users">
                <IconButton
                  aria-label={`View users assigned to ${row.original.name}`}
                  variant="ghost"
                  size="sm"
                  onClick={() => openUsersDrawer(row.original)}
                >
                  <Users size={16} />
                </IconButton>
              </Tooltip>
              {canDelete && !isProtectedFirmAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  colorPalette="red"
                  onClick={() => {
                    setRoleToDelete({
                      id: row.original.id,
                      name: row.original.name,
                    });
                    onDeleteConfirmOpen();
                  }}
                >
                  Delete
                </Button>
              )}
            </HStack>
          );
        },
      },
    ],
    [
      canDelete,
      canEdit,
      isSuperAdmin,
      onAddEditOpen,
      onDeleteConfirmOpen,
      onToggleConfirmOpen,
      openPermissionsDrawer,
      openUsersDrawer,
    ]
  );

  const handleToggleConfirm = () => {
    if (!roleToToggle) return;
    if (isSuperAdmin) {
      toggleSystemRole(roleToToggle.id);
    } else {
      toggleFirmRole(roleToToggle.id);
    }
    onToggleConfirmClose();
    setRoleToToggle(null);
  };

  const handleDeleteConfirm = () => {
    if (!roleToDelete) return;
    const onSuccess = () => {
      onDeleteConfirmClose();
      setRoleToDelete(null);
    };
    if (isSuperAdmin) {
      deleteSystemRole(roleToDelete.id, { onSuccess });
    } else {
      deleteFirmRole(roleToDelete.id, { onSuccess });
    }
  };

  const handleCreateFirmRole = (payload: {
    name: string;
    code: string;
    description?: string;
  }) => {
    createFirmRole(payload, {
      onSuccess: (response) => {
        onCreateClose();
        const created = response?.data?.data;
        if (created?.id) {
          setPermissionsRole({ roleId: created.id, roleName: created.name });
          onPermissionsOpen();
        }
      },
    });
  };

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
        {canCreate &&
          (isSuperAdmin ? (
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
          ) : (
            <Button variant="primary" onClick={onCreateOpen}>
              <AddIcon color="white" />
              Create Role
            </Button>
          ))}
      </HStack>

      {/* Summary */}
      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
        gap={4}
      >
        <SummaryCard title="Total Roles" value={totalRoles} />
        <SummaryCard
          title="Active Roles"
          value={activeRoles}
          color="green.500"
        />
        <SummaryCard
          title="Inactive Roles"
          value={inactiveRoles}
          color="red.500"
        />
        <SummaryCard
          title={isSuperAdmin ? "System Roles" : "Custom Roles"}
          value={flaggedRoles}
          color="blue.500"
        />
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

      {/* Super Admin create / edit drawer */}
      {isSuperAdmin && (
        <AddEditRole
          open={addEditOpen}
          onClose={onAddEditClose}
          id={selectedId}
          setId={setSelectedId}
        />
      )}

      {/* Firm role create drawer */}
      {!isSuperAdmin && (
        <RoleCreateDrawer
          open={createOpen}
          onClose={onCreateClose}
          isSubmitting={isCreateFirmPending}
          onSubmit={handleCreateFirmRole}
        />
      )}

      {/* Firm role permission editor (ceiling enforced by the backend) */}
      {!isSuperAdmin && permissionsRole && (
        <FirmRolePermissionsDrawer
          roleId={permissionsRole.roleId}
          roleName={permissionsRole.roleName}
          open={permissionsOpen}
          onClose={() => {
            onPermissionsClose();
            setPermissionsRole(null);
          }}
        />
      )}

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
        handleSubmit={handleToggleConfirm}
        submitActionPending={isPendingToggle}
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
        handleSubmit={handleDeleteConfirm}
        submitActionPending={isPendingDelete}
      />
    </Stack>
  );
};

export default RolesTab;
