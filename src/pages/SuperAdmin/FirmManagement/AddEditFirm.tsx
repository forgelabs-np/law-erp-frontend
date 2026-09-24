import { Grid, GridItem, HStack, Stack, Text } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  useFirmByIdQuery,
  useCreateEditFirmMutation,
} from "@/api/firmManagement";
import { FormProvider, ReactSelect, TextFieldInput } from "@/shared/components";
import { useProvincesQuery } from "@/shared/hooks/useMasterData";
import { Switch } from "@/shared/components/ui";
import { firmSchema } from "@/validations";
import CustomDrawer from "@/shared/components/drawer/CustomerDrawer";

import { FirmFormValues, FirmPayload } from "./types";

const FIRM_TYPE_OPTIONS = [
  { label: "Firm", value: "FIRM" },
  { label: "Solo", value: "SOLO" },
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
  isTrial: false,
  trialDays: 30,
};

const mapFirmToFormValues = (firm?: any): FirmFormValues => {
  if (!firm) return defaultValues;
  const isTrial = firm.isTrial ?? firm.is_trial ?? firm.firmStatus === "TRIAL";
  return {
    lawFirmCode: firm.firmCode ?? firm.lawFirmCode ?? "",
    name: firm.name ?? firm.firmName ?? "",
    firmType: firm.firmType ?? "",
    email: firm.firmEmail ?? firm.email ?? "",
    phone: firm.firmPhone ?? firm.phone ?? "",
    address: firm.firmAddress ?? firm.address ?? "",
    jurisdiction: firm.jurisdiction ?? "",
    adminUsername: firm.username ?? firm.adminUsername ?? "",
    adminEmail: firm.adminEmail ?? firm.email ?? "",
    adminMobileNo: firm.mobileNo ?? firm.adminMobileNo ?? "",
    adminPassword: "",
    adminFullName: firm.adminFullName ?? firm.fullName ?? "",
    isTrial: Boolean(isTrial),
    trialDays: firm.trialDays ?? firm.trial_days ?? 30,
  };
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
  const { data: firmById, isLoading: isLoadingFirm } = useFirmByIdQuery(
    id ?? ""
  );

  const methods = useForm<FirmFormValues>({
    defaultValues,
    resolver: yupResolver(firmSchema) as any,
    mode: "onSubmit",
    reValidateMode: "onChange",
    context: { isEdit: !!id },
  });
  const { handleSubmit, reset, watch, control } = methods;
  const isTrial = watch("isTrial");

  const { mutate, isPending } = useCreateEditFirmMutation();
  const { data: provinces = [], isLoading: provincesLoading } =
    useProvincesQuery();

  const provinceOptions = provinces.map((p) => ({
    label: `${p.nameEn} - ${p.nameNp}`,
    value: p.nameEn,
  }));

  // Reset form when drawer opens or id changes
  useEffect(() => {
    if (open) {
      if (!id) {
        reset(defaultValues);
        setId("");
      } else if (firmById) {
        reset(mapFirmToFormValues(firmById));
      }
    }
  }, [open, id, firmById, reset, setId]);

  // Pre-fill form in edit mode when firm data is loaded
  useEffect(() => {
    if (open && firmById && id) {
      reset(mapFirmToFormValues(firmById));
    }
  }, [open, firmById, id, reset]);

  const onSubmit = (data: FirmFormValues) => {
    const payload: FirmPayload = {
      ...(id ? { id } : {}),
      ...(data.lawFirmCode?.toUpperCase()
        ? { lawFirmCode: data.lawFirmCode?.toUpperCase() }
        : {}),
      name: data.name,
      firmType: data.firmType as "SOLO" | "FIRM",
      email: data.email,
      phone: data.phone,
      address: data.address,
      jurisdiction: data.jurisdiction,
      adminUsername: data.adminUsername,
      adminEmail: data.adminEmail,
      adminMobileNo: data.adminMobileNo,
      adminFullName: data.adminFullName,
      ...(data.adminPassword ? { adminPassword: data.adminPassword } : {}),
      isTrial: data.isTrial ?? false,
      ...(data.isTrial && data.trialDays
        ? { trialDays: Number(data.trialDays) }
        : {}),
    };

    mutate(payload, {
      onSuccess: () => closeHandler(),
    });
  };

  const closeHandler = () => {
    reset(defaultValues);
    setId("");
    onClose();
  };

  const resetHandler = () => {
    if (id && firmById) {
      reset(mapFirmToFormValues(firmById));
    } else {
      reset(defaultValues);
      setId("");
    }
  };

  return (
    <FormProvider methods={methods}>
      <CustomDrawer
        key={`firm-drawer-${id || "new"}-${open ? "open" : "closed"}`}
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
                  placeholder="98XXXXXXXX"
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
                <ReactSelect
                  name="jurisdiction"
                  label="Jurisdiction"
                  placeholder={
                    provincesLoading
                      ? "Loading provinces..."
                      : "Select a province"
                  }
                  options={provinceOptions}
                  disabled={provincesLoading}
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

            {/* ── Trial Settings ─────────────────────────────────────── */}
            <Stack gap={1} mt={2}>
              <Text fontWeight="semibold" fontSize="sm" color="gray.600">
                Trial Settings
              </Text>
            </Stack>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem colSpan={2}>
                <Controller
                  name="isTrial"
                  control={control}
                  render={({ field }) => (
                    <HStack justify="space-between">
                      <Stack gap={0}>
                        <Text fontSize="sm" fontWeight="medium">
                          Trial Account
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Create this firm as a trial account
                        </Text>
                      </Stack>
                      <Switch
                        checked={field.value ?? false}
                        onCheckedChange={(e) => field.onChange(e.checked)}
                      />
                    </HStack>
                  )}
                />
              </GridItem>

              {isTrial && (
                <GridItem colSpan={2}>
                  <TextFieldInput
                    name="trialDays"
                    label="Trial Duration (days)"
                    placeholder="30"
                    type="number"
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
