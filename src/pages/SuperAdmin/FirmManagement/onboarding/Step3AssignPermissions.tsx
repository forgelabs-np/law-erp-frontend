import {
  Badge,
  Box,
  HStack,
  IconButton,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { KeyRound, RefreshCw, Shield } from "lucide-react";

import {
  FirmRole,
  useSuperAdminFirmRolesQuery,
} from "@/api/firmRoleSetup";
import { Datatable } from "@/shared/components";
import { Tooltip } from "@/shared/components/ui";

import { SuperAdminRolePermissionsDrawer } from "../../Role/component/SuperAdminRolePermissionsDrawer";

interface Step3AssignPermissionsProps {
  firmId: string;
  onComplete: () => void;
  onBack: () => void;
}

export const Step3AssignPermissions = ({
  firmId,
  onComplete: _onComplete,
  onBack: _onBack,
}: Step3AssignPermissionsProps) => {
  const [selectedRole, setSelectedRole] = useState<FirmRole | null>(null);

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

  const handlePermissionsClose = () => {
    onPermissionsClose();
    setSelectedRole(null);
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
          <Tooltip content="Assign permissions">
            <IconButton
              aria-label={`Assign permissions for ${row.original.name}`}
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

  if (isLoading) {
    return (
      <Stack gap={4} py={8} alignItems="center">
        <Spinner size="lg" color="primary.500" />
        <Text color="gray.500">Loading firm roles...</Text>
      </Stack>
    );
  }

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
        <HStack justifyContent="center">
          <IconButton
            aria-label="Retry"
            onClick={() => refetch()}
          >
            <RefreshCw size={16} />
          </IconButton>
        </HStack>
      </Box>
    );
  }

  return (
    <Stack gap={5}>
      <Stack gap={1}>
        <Text fontWeight="semibold" fontSize="sm" color="gray.600">
          Assign permissions for this firm&apos;s roles. You can override permissions
          for each role individually.
        </Text>
      </Stack>

      <HStack justifyContent="flex-end">
        <IconButton
          aria-label="Refresh firm roles"
          variant="outline"
          size="sm"
          onClick={() => refetch()}
        >
          <RefreshCw size={16} />
        </IconButton>
      </HStack>

      {roles.length === 0 ? (
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

      {/* Permissions Drawer */}
      <SuperAdminRolePermissionsDrawer
        firmId={firmId}
        role={selectedRole}
        open={permissionsOpen}
        onClose={handlePermissionsClose}
      />
    </Stack>
  );
};
