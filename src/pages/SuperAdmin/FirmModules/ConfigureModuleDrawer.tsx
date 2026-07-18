import { Grid, GridItem, Stack, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { useConfigureFirmModuleMutation } from "@/api/firmModules";
import { FormProvider, TextFieldInput } from "@/shared/components";
import { Switch } from "@/shared/components/ui";
import CustomDrawer from "@/shared/components/drawer/CustomerDrawer";

import { ConfigureModuleFormValues, MergedModule } from "./types";

const defaultValues: ConfigureModuleFormValues = {
  isEnabled: false,
  isTrial: false,
  trialDays: 0,
  maxFileSizeMb: 0,
  allowedExtensions: "",
  notes: "",
};

export const ConfigureModuleDrawer = ({
  open,
  onClose,
  module,
  firmId,
}: {
  open: boolean;
  onClose: () => void;
  module: MergedModule | null;
  firmId: string;
}) => {
  const methods = useForm<ConfigureModuleFormValues>({ defaultValues });
  const { handleSubmit, reset, setValue, control } = methods;

  const { mutate: configureModule, isPending: isConfigurePending } =
    useConfigureFirmModuleMutation(firmId);

  useEffect(() => {
    if (open && module) {
      if (module.isAssigned) {
        // Module is assigned - populate from assigned module data
        setValue("isEnabled", module.isEnabled);
        setValue("isTrial", module.isTrial);
        setValue("trialDays", 0);
        setValue("maxFileSizeMb", module.maxFileSizeMb ?? 0);
        setValue("allowedExtensions", module.allowedExtensions ?? "");
        setValue("notes", module.notes ?? "");
      } else {
        // Module is not assigned - populate default values
        setValue("isEnabled", false);
        setValue("isTrial", false);
        setValue("trialDays", 0);
        setValue("maxFileSizeMb", 0);
        setValue("allowedExtensions", "");
        setValue("notes", "");
      }
    }
  }, [open, module, setValue]);

  const onSubmit = (data: ConfigureModuleFormValues) => {
    if (module) {
      configureModule(
        {
          moduleId: module.moduleId,
          isEnabled: data.isEnabled,
          trialDays: data.isTrial ? data.trialDays : null,
          maxFileSizeMb: data.maxFileSizeMb || null,
          allowedExtensions: data.allowedExtensions || null,
          notes: data.notes || null,
        },
        { onSuccess: () => closeHandler() }
      );
    }
  };

  const closeHandler = () => {
    resetHandler();
    onClose();
  };

  const resetHandler = () => {
    reset(defaultValues);
  };

  return (
    <FormProvider methods={methods}>
      <CustomDrawer
        key="configure-module"
        open={open}
        onClose={closeHandler}
        title="Configure Module"
        subHeading={module?.moduleName}
        hasFooter
        submitButtonText="Save Changes"
        exitButtonText="Cancel"
        resetButtonText="Clear"
        handleReset={resetHandler}
        handleExit={closeHandler}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isConfigurePending}
        component={
          <Stack gap={6} p={4}>
            <Stack gap={1}>
              <Text fontWeight="semibold" fontSize="sm" color="gray.600">
                Module Configuration
              </Text>
            </Stack>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem colSpan={2}>
                <Controller
                  name="isEnabled"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={(details) => field.onChange(details.checked)}
                    >
                      Enable Module
                    </Switch>
                  )}
                />
              </GridItem>

              <GridItem colSpan={2}>
                <Controller
                  name="isTrial"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={(details) => field.onChange(details.checked)}
                    >
                      Trial Mode
                    </Switch>
                  )}
                />
              </GridItem>

              <GridItem>
                <TextFieldInput
                  name="trialDays"
                  label="Trial Days"
                  type="number"
                  placeholder="Enter trial days"
                />
              </GridItem>

              <GridItem>
                <TextFieldInput
                  name="maxFileSizeMb"
                  label="Max File Size (MB)"
                  type="number"
                  placeholder="Enter max file size"
                />
              </GridItem>

              <GridItem colSpan={2}>
                <TextFieldInput
                  name="allowedExtensions"
                  label="Allowed Extensions"
                  placeholder="pdf,docx,xlsx,png"
                />
              </GridItem>

              <GridItem colSpan={2}>
                <TextFieldInput
                  name="notes"
                  label="Notes"
                  placeholder="Any additional notes"
                />
              </GridItem>
            </Grid>
          </Stack>
        }
        size="xl"
      />
    </FormProvider>
  );
};
