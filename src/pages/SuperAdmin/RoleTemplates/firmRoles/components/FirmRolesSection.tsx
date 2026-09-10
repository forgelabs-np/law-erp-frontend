import { Badge, Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Eye, Shield, Users } from "lucide-react";

import { FirmRoleResponse, useFirmRolesQuery } from "@/api/roleTemplate";
import { Datatable } from "@/shared/components";

import { CreateFirmRoleModal } from "./CreateFirmRoleModal";
import { FirmRolePermissionsDrawer } from "./FirmRolePermissionsDrawer";

/**
 * "Roles & Permissions" section for the Super Admin firm detail screen.
 * Lists the firm's roles (GET /super-admin/firms/{firmId}/roles) and
 * supports creating custom roles (POST /super-admin/firms/{firmId}/roles)
 * with a required base template.
 */
export const FirmRolesSection = ({ firmId }: { firmId: string }) => {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<FirmRoleResponse | null>(
    null
  );
  const [permissionsOpen, setPermissionsOpen] = useState(false);

  const {
    data: roles,
    isLoading,
    isError,
    refetch,
  } = useFirmRolesQuery(firmId);

  const columns: Array<ColumnDef<FirmRoleResponse>> = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Role Name",
        cell: ({ row }) => (
          <Stack gap={1} minW="160px">
            <HStack gap={2}>
              <Shield size={14} color="gray" />
              <Text fontWeight="600" fontSize="sm">
                {row.original.name}
              </Text>
            </HStack>
            <Badge
              bg="gray.100"
              color="gray.600"
              px="2"
              py="0.5"
              borderRadius="md"
              fontSize="xs"
              fontFamily="mono"
              width="fit-content"
            >
              {row.original.code}
            </Badge>
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
            maxW="240px"
            lineClamp={2}
            title={row.original.description || undefined}
          >
            {row.original.description || "—"}
          </Text>
        ),
      },
      {
        accessorKey: "isSystem",
        header: "Type",
        cell: ({ row }) => (
          <Badge
            bg={row.original.isSystem ? "blue.50" : "gray.100"}
            color={row.original.isSystem ? "blue.700" : "gray.600"}
            px="2"
            py="1"
            borderRadius="md"
            fontSize="xs"
            fontWeight="600"
          >
            {row.original.isSystem ? "System" : "Custom"}
          </Badge>
        ),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            bg={row.original.isActive ? "green.100" : "gray.100"}
            color={row.original.isActive ? "green.700" : "gray.700"}
            px="2"
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
          <HStack gap={1.5}>
            <Users size={14} color="gray" />
            <Text fontSize="sm" fontWeight="500">
              {row.original.userCount ?? 0}
            </Text>
          </HStack>
        ),
      },
      {
        id: "permissionCount",
        header: "Permissions",
        cell: ({ row }) => (
          <Text fontSize="sm" fontWeight="500">
            {row.original.permissions?.length ?? 0}
          </Text>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <HStack gap={2}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedRole(row.original);
                setPermissionsOpen(true);
              }}
            >
              <Eye size={14} />
              Permissions
            </Button>
          </HStack>
        ),
      },
    ],
    []
  );

  return (
    <Stack gap={5}>
      <HStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={3}>
        <Stack gap={1}>
          <Text textStyle="subtitle_large">Roles &amp; Permissions</Text>
          <Text fontSize="sm" color="gray.500">
            Roles of this firm. Permission changes happen at role level —
            never per user.
          </Text>
        </Stack>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setCreateOpen(true)}
        >
          Create Role
        </Button>
      </HStack>

      <Box overflowX="auto">
        {isError ? (
          <Box
            textAlign="center"
            py={10}
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
          >
            <Text color="red.500" mb={3}>
              Failed to load firm roles
            </Text>
            <Button size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </Box>
        ) : (
          <Datatable
            isLoading={isLoading}
            columns={columns}
            data={roles ?? []}
          />
        )}
      </Box>

      <CreateFirmRoleModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        firmId={firmId}
      />

      <FirmRolePermissionsDrawer
        open={permissionsOpen}
        onClose={() => {
          setPermissionsOpen(false);
          setSelectedRole(null);
        }}
        role={selectedRole}
      />
    </Stack>
  );
};
