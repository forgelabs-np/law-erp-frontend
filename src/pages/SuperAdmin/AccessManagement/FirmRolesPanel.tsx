import {
  Badge,
  Box,
  Button,
  HStack,
  IconButton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { KeyRound, RefreshCw, Shield } from "lucide-react";

import {
  FirmRole,
  FirmRolePayload,
  useCreateSuperAdminFirmRoleMutation,
  useSuperAdminFirmRolesQuery,
} from "@/api/firmRoleSetup";
import { AddIcon } from "@/assets/svgs";
import { Datatable } from "@/shared/components";
import { Tooltip } from "@/shared/components/ui";

import { RoleCreateDrawer } from "../Role/component/RoleCreateDrawer";
import { SuperAdminRolePermissionsDrawer } from "../Role/component/SuperAdminRolePermissionsDrawer";

/**
 * Super Admin view of a single firm's roles (system clones + custom roles) with
 * the ability to override any role's permissions and create roles on-behalf of
 * the firm.
 */
export const FirmRolesPanel = ({ firmId }: { firmId: string }) => {
  const [selectedRole, setSelectedRole] = useState<FirmRole | null>(null);

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
    data: roles = [],
    isLoading,
    isError,
    refetch,
  } = useSuperAdminFirmRolesQuery(firmId, { enabled: !!firmId });
  const { mutate: createRole, isPending: isCreating } =
    useCreateSuperAdminFirmRoleMutation(firmId);

  // Never carry a previously selected role across firms.
  useEffect(() => {
    setSelectedRole(null);
  }, [firmId]);

  const openPermissions = useCallback(
    (role: FirmRole) => {
      setSelectedRole(role);
      onPermissionsOpen();
    },
    [onPermissionsOpen]
  );

  const handleCreate = (payload: FirmRolePayload) => {
    createRole(payload, {
      onSuccess: (response) => {
        onCreateClose();
        const created = response?.data?.data;
        if (created) {
          openPermissions(created);
        }
      },
    });
  };

  const columns: Array<ColumnDef<FirmRole>> = useMemo(
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
        id: "type",
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
        id: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            bg={row.original.isActive ? "green.50" : "red.50"}
            color={row.original.isActive ? "green.700" : "red.700"}
            px="2.5"
            py="1"
            borderRadius="md"
            fontSize="xs"
            fontWeight="600"
          >
            {row.original.isActive ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        id: "userCount",
        header: "Users",
        cell: ({ row }) => (
          <Text fontSize="sm" fontWeight="500">
            {row.original.userCount ?? 0}
          </Text>
        ),
      },
      {
        id: "permissionCount",
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
            {row.original.permissions?.length ?? 0}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Tooltip content="Override permissions">
            <IconButton
              aria-label={`Edit permissions for ${row.original.name}`}
              variant="ghost"
              size="sm"
              onClick={() => openPermissions(row.original)}
            >
              <KeyRound size={16} />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    [openPermissions]
  );

  if (isError) {
    return (
      <Box
        textAlign="center"
        py={12}
        bg="white"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.200"
      >
        <Text fontSize="lg" color="red.500" mb={4}>
          Failed to load firm roles
        </Text>
        <Button onClick={() => refetch()} colorScheme="blue">
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Stack gap={5}>
      <HStack justifyContent="space-between" alignItems="center" gap={2}>
        <Text fontSize="sm" color="gray.500">
          Override permissions for this firm&apos;s roles, or create a custom
          role on the firm&apos;s behalf.
        </Text>
        <HStack gap={2}>
          <IconButton
            aria-label="Refresh firm roles"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
          >
            <RefreshCw size={16} />
          </IconButton>
          <Button variant="primary" onClick={onCreateOpen}>
            <AddIcon color="white" />
            Create Role
          </Button>
        </HStack>
      </HStack>

      {isLoading ? (
        <Datatable isLoading columns={columns} data={[]} />
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
                This firm has no roles yet.
              </Text>
            </Stack>
          </HStack>
        </Box>
      ) : (
        <Datatable isLoading={false} columns={columns} data={roles} />
      )}

      <RoleCreateDrawer
        open={createOpen}
        onClose={onCreateClose}
        isSubmitting={isCreating}
        title="Create Role On Behalf"
        subHeading="Create a custom role inside this firm, then assign its permissions."
        onSubmit={handleCreate}
      />

      <SuperAdminRolePermissionsDrawer
        firmId={firmId}
        role={selectedRole}
        open={permissionsOpen}
        onClose={() => {
          onPermissionsClose();
          setSelectedRole(null);
        }}
      />
    </Stack>
  );
};
