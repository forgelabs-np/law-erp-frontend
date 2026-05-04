import { Stack } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useAddEditRoleMutation, useRoleByIdQuery } from "@/api/roleSetup.ts";
import CustomDrawer from "@/shared/components/drawer/CustomerDrawer";
import { normalizePrivilege } from "@/shared/utils/privilage";

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
      const rolePermissions = roleById.permissions;

      if (Array.isArray(rolePermissions)) {
        for (const mod of rolePermissions) {
          for (const menu of mod.menus ?? []) {
            const menuKey = menu.id ?? menu.menuCode;
            if (menuKey) {
              permissions[menuKey] = normalizePrivilege(menu.privilege);
            }
            for (const sub of menu.subMenus ?? []) {
              const subKey = sub.id ?? sub.menuCode;
              if (subKey) {
                permissions[subKey] = normalizePrivilege(sub.privilege);
              }
            }
          }
        }
      }

      reset({
        name: roleById?.name ?? "",
        code: roleById?.code ?? "",
        description: roleById?.description ?? "",
        permissions,
      });
    }
  }, [roleById, id, reset]);

  const onSubmit = (data: RoleFormValues) => {
    const permissions = Object.entries(data.permissions ?? {})
      .filter(([, priv]) => priv && priv.length > 0)
      .map(([menuId, priv]) => ({
        menuId,
        privilege: priv,
      }));

    const payload: RoleSetupPayload = {
      ...(id ? { id } : {}),
      name: data.name,
      code: data.code,
      description: data.description ?? "",
      permissions,
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
