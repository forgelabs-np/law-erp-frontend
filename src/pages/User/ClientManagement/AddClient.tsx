import { Grid, GridItem, Stack, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useCreateClientMutation } from "@/api/clientManagement";
import { FormProvider, TextFieldInput } from "@/shared/components";
import { Switch } from "@/shared/components/ui";
import CustomDrawer from "@/shared/components/drawer/CustomerDrawer";

import { ClientFormValues } from "./types";

const defaultValues: ClientFormValues = {
  username: "",
  email: "",
  mobileNo: "",
  password: "",
  fullName: "",
  portalAccessEnabled: true,
};

export const AddClient = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const methods = useForm<ClientFormValues>({ defaultValues });
  const { handleSubmit, reset } = methods;

  const { mutate: createClient, isPending: isCreatePending } =
    useCreateClientMutation();

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  const onSubmit = (data: ClientFormValues) => {
    createClient(data, { onSuccess: () => closeHandler() });
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
        key="add-client"
        open={open}
        onClose={closeHandler}
        title="Add Client"
        subHeading="Fill in the client details below"
        hasFooter
        submitButtonText="Submit"
        exitButtonText="Close"
        resetButtonText="Clear"
        handleReset={resetHandler}
        handleExit={closeHandler}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isCreatePending}
        component={
          <Stack gap={6} p={4}>
            <Stack gap={1}>
              <Text fontWeight="semibold" fontSize="sm" color="gray.600">
                Client Information
              </Text>
            </Stack>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem colSpan={2}>
                <TextFieldInput
                  name="fullName"
                  label="Full Name"
                  placeholder="e.g. John Doe"
                  required
                />
              </GridItem>

              <GridItem>
                <TextFieldInput
                  name="username"
                  label="Username"
                  placeholder="e.g. john_doe"
                  required
                />
              </GridItem>

              <GridItem>
                <TextFieldInput
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="john@example.com"
                  required
                />
              </GridItem>

              <GridItem>
                <TextFieldInput
                  name="mobileNo"
                  label="Mobile Number"
                  placeholder="98XXXXXXXX"
                  required
                />
              </GridItem>

              <GridItem>
                <TextFieldInput
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Set initial password"
                  required
                />
              </GridItem>

              <GridItem colSpan={2}>
                <Switch
                  name="portalAccessEnabled"
                  label="Enable Portal Access"
                  checked={defaultValues.portalAccessEnabled}
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
