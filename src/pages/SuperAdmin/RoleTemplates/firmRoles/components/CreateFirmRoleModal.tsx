import { Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { CreateFirmRolePayload, useCreateFirmRoleMutation } from "@/api/roleTemplate";
import CustomDrawer from "@/shared/components/drawer/CustomerDrawer";
import { cryptoRandomUUID } from "@/shared/utils/uuid";
import { firmRoleCreateFormSchema } from "@/validations";

import { FirmRoleForm } from "./FirmRoleForm";
import { FirmRoleFormValues } from "../types";

const defaultValues: FirmRoleFormValues = {
  name: "",
  code: "",
  description: "",
  isActive: true,
  parentRoleId: "",
};

/**
 * Drawer for creating a custom role on a specific firm (Super Admin).
 * parentRoleId (active system template, never SUPER_ADMIN) is required by
 * the backend contract and validated client-side.
 */
export const CreateFirmRoleModal = ({
  open,
  onClose,
  firmId,
}: {
  open: boolean;
  onClose: () => void;
  firmId: string;
}) => {
  const methods = useForm<FirmRoleFormValues>({
    defaultValues,
    resolver: yupResolver(firmRoleCreateFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { handleSubmit, reset } = methods;
  const { mutateAsync: createRole, isPending } = useCreateFirmRoleMutation(firmId);

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  const onSubmit = async (values: FirmRoleFormValues) => {
    const payload: CreateFirmRolePayload = {
      id: cryptoRandomUUID(),
      name: values.name,
      code: values.code,
      description: values.description ?? "",
      isActive: values.isActive,
      parentRoleId: values.parentRoleId,
      permissionIds: [],
    };

    try {
      await createRole({ firmId, data: payload });
      closeHandler();
    } catch {
      // Error toast handled by the mutation
    }
  };

  const closeHandler = () => {
    reset(defaultValues);
    onClose();
  };

  const resetHandler = () => {
    reset(defaultValues);
  };

  return (
    <CustomDrawer
      key={`create-firm-role-${firmId}`}
      open={open}
      onClose={closeHandler}
      title="Create Firm Role"
      subHeading="Create a custom role for this firm. Select the base template that will act as its permission ceiling."
      hasFooter
      submitButtonText="Create Role"
      exitButtonText="Cancel"
      resetButtonText="Clear"
      handleReset={resetHandler}
      handleExit={closeHandler}
      handleSubmit={handleSubmit(onSubmit)}
      isSubmitting={isPending}
      size="xl"
      component={
        <Stack gap={6} p={4}>
          <FirmRoleForm methods={methods} />
        </Stack>
      }
    />
  );
};
