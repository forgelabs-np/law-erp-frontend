import { Stack } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { useGetModuleMenusQuery } from "@/api/menuSetup";
import {
  useAddEditPermissionMutation,
  usePermissionByIdQuery,
} from "@/api/permissionSetup";
import { FormProvider, ReactSelect, TextFieldInput } from "@/shared/components";
import CustomDrawer from "@/shared/components/drawer/CustomerDrawer";
import { PermissionFormValues } from "./types";

const defaultValues: PermissionFormValues = {
  permission: {
    moduleId: "",
    action: "",
    code: "",
    description: "",
  },
};

export const AddorEditPermissions = ({
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
  const { data: moduleData } = useGetModuleMenusQuery();
  const { data: permissionById, isLoading: isLoadingPermission } =
    usePermissionByIdQuery(id ?? "");

  //   console.log(moduleData, "data");

  const methods = useForm<PermissionFormValues>({
    defaultValues,
  });
  const { handleSubmit, reset } = methods;

  const { mutate, isPending } = useAddEditPermissionMutation();
  console.log(moduleData, "moduleData");

  const moduleOptions = useMemo(() => {
    return (
      moduleData?.data.map((module) => ({
        label: module.name,
        value: module.code  ,
      })) ?? []
    );
  }, [moduleData]);

  useEffect(() => {
    if (open && !id) {
      reset(defaultValues);
      setId("");
    }
  }, [open, id, reset, setId]);

  useEffect(() => {
    if (permissionById && id) {
      reset({
        permission: {
          moduleId: permissionById.module?.code ?? "",
          action: permissionById.action ?? "",
          code: permissionById.code ?? "",
          description: permissionById.description ?? "",
        },
      });
    }
  }, [permissionById, id, reset]);

  const onSubmit = (data: PermissionFormValues) => {
    const payload = {
      ...(id ? { id } : {}),
      moduleCode: data.permission.moduleId,
      action: data.permission.action.toUpperCase(),
      scope: "GLOBAL",
      code: data.permission.code.toUpperCase(),
      description: data.permission.description,
      isActive: true,
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
    <FormProvider methods={methods}>
      <CustomDrawer
        open={open}
        onClose={closeHandler}
        title={id ? "Edit Permission Setup" : "Add Permission Setup"}
        subHeading="Fill in the information below to continue"
        hasFooter
        submitButtonText="Submit"
        exitButtonText="Close"
        resetButtonText="Clear"
        handleReset={resetHandler}
        handleExit={closeHandler}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isPending}
        disabled={!!id && isLoadingPermission}
        component={
          <Stack gap={6} p={4}>
            <ReactSelect
              name="permission.moduleId"
              label="Module"
              placeholder="Select Module"
              options={moduleOptions}
              required
            />
            <TextFieldInput
              name="permission.action"
              label="Action"
              placeholder="e.g. READ"
              required
            />
            <TextFieldInput
              name="permission.code"
              label="Code"
              placeholder="e.g. USER_READ"
              required
            />
            <TextFieldInput
              name="permission.description"
              label="Description"
              placeholder="Enter Description"
            />
          </Stack>
        }
        size="xl"
      />
    </FormProvider>
  );
};

export default AddorEditPermissions;
