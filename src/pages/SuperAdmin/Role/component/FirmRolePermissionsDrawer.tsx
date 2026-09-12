import { Skeleton, Stack, Text } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import {
  useFirmRolePermissionsQuery,
  useUpdateFirmRolePermissionsMutation,
} from "@/api/firmRoleSetup";
import CustomDrawer from "@/shared/components/drawer/CustomerDrawer";

import { RoleFormValues, flattenPermissionIds } from "../types";
import { PermissionSelectionSection } from "./PermissionSelectionSection";
import {
  buildCeilingSelection,
  buildPermissionGroups,
} from "./permissionGroups";

const defaultValues: RoleFormValues = {
  name: "",
  code: "",
  description: "",
  permissions: {},
};

const CeilingNotice = ({ roleName }: { roleName: string }) => (
  <Text fontSize="xs" color="blue.700" lineHeight="tall">
    Available permissions are limited to the permissions assigned to your Firm
    Admin role in this firm. Saving replaces the complete permission set for{" "}
    <Text as="span" fontWeight="600">
      {roleName}
    </Text>
    . Affected users may be asked to sign in again.
  </Text>
);

/**
 * Firm Admin permission editor. The options come from the backend ceiling
 * (`availablePermissions`) so permissions outside the Firm Admin's own set are
 * never rendered as selectable.
 */
export const FirmRolePermissionsDrawer = ({
  open,
  onClose,
  roleId,
  roleName,
}: {
  open: boolean;
  onClose: () => void;
  roleId: string;
  roleName: string;
}) => {
  const { data, isLoading } = useFirmRolePermissionsQuery(roleId, {
    enabled: open && !!roleId,
  });
  const { mutate, isPending } = useUpdateFirmRolePermissionsMutation();

  const { control, handleSubmit, reset } = useForm<RoleFormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [open, reset]);

  useEffect(() => {
    if (!open || !data) return;
    reset({
      name: data.roleName ?? roleName,
      code: data.roleCode ?? "",
      description: "",
      permissions: buildCeilingSelection(
        data.availablePermissions ?? [],
        data.currentPermissions ?? []
      ),
    });
  }, [data, open, roleName, reset]);

  const permissionGroups = useMemo(
    () => buildPermissionGroups(data?.availablePermissions ?? []),
    [data]
  );

  const submitHandler = (values: RoleFormValues) => {
    mutate(
      { roleId, permissionIds: flattenPermissionIds(values.permissions) },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <CustomDrawer
      open={open}
      onClose={onClose}
      title={`Permissions — ${data?.roleName ?? roleName}`}
      subHeading="Select the actions this role should be allowed to perform."
      hasFooter
      submitButtonText="Save Permissions"
      exitButtonText="Cancel"
      handleExit={onClose}
      handleSubmit={handleSubmit(submitHandler)}
      isSubmitting={isPending}
      disabled={isLoading || !data}
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
              heading="Available Permissions"
              description="Permissions you are allowed to grant."
              notice={<CeilingNotice roleName={data?.roleName ?? roleName} />}
            />
          )}
        </Stack>
      }
    />
  );
};
