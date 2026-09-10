import { Badge, HStack, Stack } from "@chakra-ui/react";

import { PermissionAssignment } from "@/components/PermissionAssignment";
import { FirmRoleResponse } from "@/api/roleTemplate";
import CustomDrawer from "@/shared/components/drawer/CustomerDrawer";

/**
 * Read-only view of a firm role's assigned permissions.
 * Permission changes happen at role level via the existing
 * Role Management flow — never per user.
 */
export const FirmRolePermissionsDrawer = ({
  open,
  onClose,
  role,
}: {
  open: boolean;
  onClose: () => void;
  role: FirmRoleResponse | null;
}) => {
  return (
    <CustomDrawer
      key={`firm-role-permissions-${role?.id ?? "none"}`}
      open={open}
      onClose={onClose}
      title={`${role?.name ?? "Role"} — Permissions`}
      subHeading="Assigned permissions for this firm role."
      hasFooter={false}
      size="xl"
      component={
        <Stack gap={4} p={4}>
          <HStack gap={2} flexWrap="wrap">
            <Badge
              bg="gray.100"
              color="gray.600"
              fontFamily="mono"
              px="2"
              py="0.5"
              borderRadius="md"
              fontSize="xs"
            >
              {role?.code ?? "—"}
            </Badge>
            <Badge
              bg={role?.isActive ? "green.100" : "gray.100"}
              color={role?.isActive ? "green.700" : "gray.700"}
              px="2"
              py="0.5"
              borderRadius="md"
              fontSize="xs"
            >
              {role?.isActive ? "Active" : "Inactive"}
            </Badge>
            <Badge
              bg={role?.isSystem ? "blue.50" : "gray.100"}
              color={role?.isSystem ? "blue.700" : "gray.600"}
              px="2"
              py="0.5"
              borderRadius="md"
              fontSize="xs"
            >
              {role?.isSystem ? "System" : "Custom"}
            </Badge>
          </HStack>

          <PermissionAssignment
            heading="Menu & Action Permissions"
            readOnly
            selectedPermissionIds={(role?.permissions ?? []).map(
              (perm) => perm.id
            )}
          />
        </Stack>
      }
    />
  );
};
