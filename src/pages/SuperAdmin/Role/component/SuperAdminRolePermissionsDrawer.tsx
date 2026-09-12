import { Skeleton, Stack, Text } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { FirmRole, useOverrideFirmRolePermissionsMutation } from "@/api/firmRoleSetup";
import { useGetGroupedPermissionsQuery } from "@/api/permissionSetup";
import CustomDrawer from "@/shared/components/drawer/CustomerDrawer";

import { RoleFormValues, flattenPermissionIds } from "../types";
import { PermissionSelectionSection } from "./PermissionSelectionSection";
import {
  RolePermissionLike,
  buildCeilingSelection,
  buildPermissionGroups,
} from "./permissionGroups";

const defaultValues: RoleFormValues = {
  name: "",
  code: "",
  description: "",
  permissions: {},
};

const OverrideNotice = ({ roleName }: { roleName: string }) => (
  <Text fontSize="xs" color="blue.700" lineHeight="tall">
    Super Admin override — permissions can be assigned without the Firm Admin
    ceiling. GLOBAL permissions are never assignable to firm roles. Saving
    replaces the complete permission set for{" "}
    <Text as="span" fontWeight="600">
      {roleName}
    </Text>
    .
  </Text>
);

/**
 * Super Admin permission override for a single firm role. Uses the complete
 * TENANT permission catalogue as the option set (GLOBAL permissions excluded).
 */
export const SuperAdminRolePermissionsDrawer = ({
  open,
  onClose,
  firmId,
  role,
}: {
  open: boolean;
  onClose: () => void;
  firmId: string;
  role: FirmRole | null;
}) => {
  const { data: groupedPermissions, isLoading } = useGetGroupedPermissionsQuery(
    { enabled: open && !!firmId }
  );
  const { mutate, isPending } =
    useOverrideFirmRolePermissionsMutation(firmId);

  const { control, handleSubmit, reset } = useForm<RoleFormValues>({
    defaultValues,
  });

  const availablePermissions = useMemo<RolePermissionLike[]>(
    () =>
      (groupedPermissions?.modules ?? []).flatMap((module) =>
        module.permissions
          .filter((permission) => permission.scope !== "GLOBAL")
          .map((permission) => ({
            id: permission.id,
            action: permission.action,
            moduleCode: module.moduleCode,
            code: permission.code,
            isActive: permission.isActive,
          }))
      ),
    [groupedPermissions]
  );

  const permissionGroups = useMemo(
    () => buildPermissionGroups(availablePermissions),
    [availablePermissions]
  );

  useEffect(() => {
    if (!open) return;
    if (!role) {
      reset(defaultValues);
      return;
    }
    reset({
      name: role.name,
      code: role.code,
      description: role.description ?? "",
      permissions: buildCeilingSelection(
        availablePermissions,
        role.permissions ?? []
      ),
    });
  }, [open, role, availablePermissions, reset]);

  const submitHandler = (values: RoleFormValues) => {
    if (!role) return;
    mutate(
      { roleId: role.id, permissionIds: flattenPermissionIds(values.permissions) },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <CustomDrawer
      open={open}
      onClose={onClose}
      title={`Permissions — ${role?.name ?? ""}`}
      subHeading="Override this firm role's permissions."
      hasFooter
      submitButtonText="Save Permissions"
      exitButtonText="Cancel"
      handleExit={onClose}
      handleSubmit={handleSubmit(submitHandler)}
      isSubmitting={isPending}
      disabled={isLoading || !role}
      noteMessage=""
      size="xl"
      component={
        <Stack gap={4} p={4}>
          {isLoading ? (
            <Stack gap={4}>
              <Skeleton height="120px" borderRadius="lg" />
              <Skeleton height="120px" borderRadius="lg" />
            </Stack>
          ) : (
            <PermissionSelectionSection
              control={control}
              groups={permissionGroups}
              heading="Assignable Permissions"
              description="All tenant permissions except GLOBAL-only actions."
              notice={<OverrideNotice roleName={role?.name ?? ""} />}
            />
          )}
        </Stack>
      }
    />
  );
};
