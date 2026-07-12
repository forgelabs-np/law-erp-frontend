import { Grid, GridItem, Stack, Text } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  useFirmByIdQuery,
  useCreateEditFirmMutation,
} from "@/api/firmManagement";
import { FormProvider, ReactSelect, TextFieldInput } from "@/shared/components";
import CustomDrawer from "@/shared/components/drawer/CustomerDrawer";

import { FirmFormValues, FirmPayload } from "./types";

const FIRM_TYPE_OPTIONS = [
  { label: "Solo", value: "SOLO" },
  { label: "Client", value: "CLIENT" },
];

const defaultValues: FirmFormValues = {
  lawFirmCode: "",
  name: "",
  firmType: "",
  email: "",
  phone: "",
  address: "",
  jurisdiction: "",
  adminUsername: "",
  adminEmail: "",
  adminMobileNo: "",
  adminPassword: "",
  adminFullName: "",
};

export const AddEditFirm = ({
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
  const { data: firmByIdResponse, isLoading: isLoadingFirm } = useFirmByIdQuery(
    id ?? ""
  );

  const firmById = firmByIdResponse?.[0];

  console.log(firmById, "firmIddddddd");

  const methods = useForm<FirmFormValues>({ defaultValues });
  const { handleSubmit, reset } = methods;

  const { mutate, isPending } = useCreateEditFirmMutation();

  useEffect(() => {
    if (open && !id) {
      reset(defaultValues);
      setId("");
    }
  }, [open, id, reset, setId]);

  // Pre-fill form in edit mode
  useEffect(() => {
    if (open && firmById && id) {
      reset({
        lawFirmCode: firmById.firmCode ?? firmById.lawFirmCode ?? "",
        name: firmById.name ?? firmById.firmName ?? "",
        firmType: firmById.firmType ?? "",
        email: firmById.email ?? "",
        phone: firmById.phone ?? "",
        address: firmById.address ?? "",
        jurisdiction: firmById.jurisdiction ?? "",
        adminUsername: firmById.username ?? "",
        adminEmail: firmById.adminEmail ?? "",
        adminMobileNo: firmById.adminMobileNo ?? firmById.mobileNo ?? "",
        adminPassword: "",
        adminFullName: firmById.adminFullName ?? firmById.fullName ?? "",
      });
    }
  }, [open, firmById, id, reset]);

  const onSubmit = (data: FirmFormValues) => {
    const payload: FirmPayload = {
      ...(id ? { id } : {}),
      ...(data.lawFirmCode ? { lawFirmCode: data.lawFirmCode } : {}),
      name: data.name,
      firmType: data.firmType as "SOLO" | "CLIENT",
      email: data.email,
      phone: data.phone,
      address: data.address,
      jurisdiction: data.jurisdiction,
      adminUsername: data.adminUsername,
      adminEmail: data.adminEmail,
      adminMobileNo: data.adminMobileNo,
      adminFullName: data.adminFullName,
      ...(data.adminPassword ? { adminPassword: data.adminPassword } : {}),
    };

    mutate(payload, {
      onSuccess: () => closeHandler(),
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
        key={id || "add"}
        open={open}
        onClose={closeHandler}
        title={id ? "Edit Firm" : "Add Firm"}
        subHeading="Fill in the firm and admin details below"
        hasFooter
        submitButtonText="Submit"
        exitButtonText="Close"
        resetButtonText="Clear"
        handleReset={resetHandler}
        handleExit={closeHandler}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isPending}
        disabled={!!id && isLoadingFirm}
        component={
          <Stack gap={6} p={4}>
            {/* ── Firm Details ─────────────────────────────────────── */}
            <Stack gap={1}>
              <Text fontWeight="semibold" fontSize="sm" color="gray.600">
                Firm Details
              </Text>
            </Stack>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem colSpan={2}>
                <TextFieldInput
                  name="name"
                  label="Firm Name"
                  placeholder="e.g. Sharma & Associates"
                  required
                />
              </GridItem>

              <GridItem>
                <ReactSelect
                  name="firmType"
                  label="Firm Type"
                  placeholder="Select Firm Type"
                  options={FIRM_TYPE_OPTIONS}
                  required
                />
              </GridItem>

              <GridItem>
                <TextFieldInput
                  name="lawFirmCode"
                  label="Law Firm Code"
                  placeholder="Auto-generated if empty"
                />
              </GridItem>

              <GridItem>
                <TextFieldInput
                  name="email"
                  label="Firm Email"
                  placeholder="firm@example.com"
                  required
                />
              </GridItem>

              <GridItem>
                <TextFieldInput
                  name="phone"
                  label="Phone"
                  placeholder="+977 98XXXXXXXX"
                  required
                />
              </GridItem>

              <GridItem colSpan={2}>
                <TextFieldInput
                  name="address"
                  label="Address"
                  placeholder="Firm address"
                  required
                />
              </GridItem>

              <GridItem colSpan={2}>
                <TextFieldInput
                  name="jurisdiction"
                  label="Jurisdiction"
                  placeholder="e.g. Bagmati Province"
                  required
                />
              </GridItem>
            </Grid>

            {/* ── Admin Details ─────────────────────────────────────── */}
            <Stack gap={1} mt={2}>
              <Text fontWeight="semibold" fontSize="sm" color="gray.600">
                Firm Admin Details
              </Text>
            </Stack>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem colSpan={2}>
                <TextFieldInput
                  name="adminFullName"
                  label="Admin Full Name"
                  placeholder="Full name of the admin"
                  required
                />
              </GridItem>

              <GridItem>
                <TextFieldInput
                  name="adminUsername"
                  label="Admin Username"
                  placeholder="username"
                  required
                />
              </GridItem>

              <GridItem>
                <TextFieldInput
                  name="adminMobileNo"
                  label="Admin Mobile No."
                  placeholder="98XXXXXXXX"
                  required
                />
              </GridItem>

              <GridItem colSpan={2}>
                <TextFieldInput
                  name="adminEmail"
                  label="Admin Email"
                  placeholder="admin@example.com"
                  required
                />
              </GridItem>

              {!id && (
                <GridItem colSpan={2}>
                  <TextFieldInput
                    name="adminPassword"
                    label="Admin Password"
                    placeholder="Set initial password"
                    required
                  />
                </GridItem>
              )}
            </Grid>
          </Stack>
        }
        size="xl"
      />
    </FormProvider>
  );
};
