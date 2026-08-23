import { Stack, Button, HStack, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useAddEditRoleMutation,
  useRoleByIdQuery,
} from "@/api/roleSetup.ts/index.ts";
import { RoleSetupForm } from "../../component/RoleSetupForm";
import { RoleFormValues, RoleSetupPayload } from "../../types";
import { errorNotification } from "@/shared/utils/notification";
import { Save } from "lucide-react";

const defaultValues: RoleFormValues = {
  name: "",
  code: "",
  description: "",
  permissions: {},
};

export const RolePermissionsSection = ({ roleId }: { roleId: string }) => {
  const { data: roleById, isLoading: isLoadingRole } = useRoleByIdQuery(roleId);
  const { mutate, isPending } = useAddEditRoleMutation();

  const { control, handleSubmit, reset } = useForm<RoleFormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (roleById && roleId) {
      const permissions: Record<string, string[]> = {};
      const rolePermissions: any[] = roleById?.permissions ?? [];

      rolePermissions.forEach((perm: any) => {
        const modCode = perm.code?.split(":")[0] || "OTHER";
        if (!permissions[modCode]) permissions[modCode] = [];
        if (perm.id) permissions[modCode].push(perm.id);
      });

      reset({
        name: roleById?.name ?? "",
        code: roleById?.code ?? "",
        description: roleById?.description ?? "",
        permissions,
      });
    }
  }, [roleById, roleId, reset]);

  const onSubmit = (data: RoleFormValues) => {
    const permissionIds = Object.values(data.permissions ?? {})
      .flat()
      .filter(Boolean);

    if (permissionIds.length === 0) {
      errorNotification("Please select at least one permission.");
      return;
    }

    const payload: RoleSetupPayload = {
      id: roleId,
      name: data.name,
      code: data.code,
      description: data.description ?? "",
      permissionIds,
    };

    mutate(payload);
  };

  return (
    <Stack gap={6}>
      <HStack justifyContent="space-between">
        <Text textStyle="subtitle_large">Manage Permissions</Text>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isLoadingRole || isPending}
          loadingText="Saving..."
          colorScheme="blue"
        >
          <Save size={16} />
          Save Permissions
        </Button>
      </HStack>
      <RoleSetupForm isOpen={true} control={control} />
    </Stack>
  );
};
