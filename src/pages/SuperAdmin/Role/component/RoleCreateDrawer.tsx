import { Stack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { FirmRolePayload } from "@/api/firmRoleSetup";
import CustomDrawer from "@/shared/components/drawer/CustomerDrawer";
import InputField from "@/shared/components/inputField";
import { RoleDetailsSchemaType, roleDetailsSchema } from "@/validations";

const defaultValues: RoleDetailsSchemaType = {
  name: "",
  code: "",
  description: "",
};

/**
 * Creates a role's metadata only. Permission assignment is a separate call
 * (`PUT .../roles/{roleId}/permissions`) in the current RBAC contract, so the
 * caller is expected to open the permission editor after creation.
 */
export const RoleCreateDrawer = ({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
  title = "Create Role",
  subHeading = "Create the role first, then assign its permissions.",
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: FirmRolePayload) => void;
  isSubmitting?: boolean;
  title?: string;
  subHeading?: string;
}) => {
  const { control, handleSubmit, reset } = useForm<RoleDetailsSchemaType>({
    defaultValues,
    resolver: yupResolver(roleDetailsSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [open, reset]);

  const submitHandler = (values: RoleDetailsSchemaType) => {
    onSubmit({
      name: values.name.trim(),
      code: values.code.trim(),
      description: values.description?.trim() || undefined,
    });
  };

  return (
    <CustomDrawer
      open={open}
      onClose={onClose}
      title={title}
      subHeading={subHeading}
      hasFooter
      submitButtonText="Create Role"
      exitButtonText="Cancel"
      handleExit={onClose}
      handleSubmit={handleSubmit(submitHandler)}
      isSubmitting={isSubmitting}
      noteMessage=""
      size="md"
      component={
        <Stack gap={5} p={4}>
          <InputField
            control={control}
            name="name"
            label="Role Name"
            placeholder="e.g. Junior Advocate"
            required
          />
          <InputField
            control={control}
            name="code"
            label="Role Code"
            placeholder="e.g. JUNIOR_ADVOCATE"
            required
          />
          <InputField
            control={control}
            name="description"
            label="Description"
            placeholder="Enter Description"
          />
        </Stack>
      }
    />
  );
};
