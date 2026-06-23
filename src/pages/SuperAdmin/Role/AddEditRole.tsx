import { Stack } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  useAddEditRoleMutation,
  useRoleByIdQuery,
} from "@/api/roleSetup.ts/index.ts";
import CustomDrawer from "@/shared/components/drawer/CustomerDrawer";
import { errorNotification } from "@/shared/utils/notification";

import { RoleSetupForm } from "./component/RoleSetupForm";
import { RoleFormValues, RoleSetupPayload } from "./types";

const defaultValues: RoleFormValues = {
  name: "",
  code: "",
  description: "",
  permissions: {},
};

export const AddEditRole = ({
  open,
  onClose,
  id,
  setId,
}: {
  open: boolean;
  onClose: () => void;
  id?: string;
  setId: Dispatch<SetStateAction<string | undefined>>;
}) => {
  const { data: roleById, isLoading: isLoadingRole } = useRoleByIdQuery(
    id ?? ""
  );

  const { control, handleSubmit, reset } = useForm<RoleFormValues>({
    defaultValues,
    // resolver: yupResolver(roleSetupSchema),
  });
  const { mutate, isPending } = useAddEditRoleMutation();

  useEffect(() => {
    if (open && !id) {
      reset(defaultValues);
      setId("");
    }
  }, [open, id, reset, setId]);

  useEffect(() => {
    if (roleById && id) {
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
  }, [roleById, id, reset]);

  const onSubmit = (data: RoleFormValues) => {
    // Extract flat array of all selected permission UUIDs
    const permissionIds = Object.values(data.permissions ?? {})
      .flat()
      .filter(Boolean);

    if (permissionIds.length === 0) {
      errorNotification("Please select at least one permission.");
      return;
    }

    const payload: RoleSetupPayload = {
      ...(id ? { id } : {}),
      name: data.name,
      code: data.code,
      description: data.description ?? "",
      permissionIds,
    };

    mutate(payload, {
      onSuccess: () => {
        closeHandler();
      },
    });
  };

  const closeHandler = () => {
    resetHandler();
    onClose();
  };
  const resetHandler = () => {
    reset(defaultValues);
    setId("");
  };

  return (
    <CustomDrawer
      open={open}
      onClose={closeHandler}
      title={id ? "Edit Role" : "Add Role"}
      subHeading="Fill in the information below to continue"
      hasFooter
      submitButtonText="Submit"
      exitButtonText="Close"
      resetButtonText="Clear"
      handleReset={resetHandler}
      handleExit={closeHandler}
      handleSubmit={handleSubmit(onSubmit)}
      isSubmitting={isPending}
      disabled={!!id && isLoadingRole}
      component={
        <Stack gap={6} p={4}>
          <RoleSetupForm isOpen={open} control={control} />
        </Stack>
      }
      size="xl"
    />
  );
};
