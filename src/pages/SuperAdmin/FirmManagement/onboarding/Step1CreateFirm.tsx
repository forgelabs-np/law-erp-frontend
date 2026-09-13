import { Grid, GridItem, HStack, Stack, Text } from "@chakra-ui/react";
import { useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useCreateEditFirmMutation } from "@/api/firmManagement";
import { FormProvider, ReactSelect, TextFieldInput } from "@/shared/components";
import { Switch } from "@/shared/components/ui";
import { firmSchema } from "@/validations";

import { FirmFormValues, FirmPayload } from "../types";

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

interface Step1CreateFirmProps {
  onSuccess: (data: {
    firmId: string;
    adminId?: string;
    adminRoleId?: string;
    adminUsername?: string;
    firmName?: string;
  }) => void;
  initialData?: Record<string, unknown> | null;
  onSubmitRef?: React.MutableRefObject<(() => void) | null>;
  createdFirmId?: string | null;
}

export const Step1CreateFirm = ({
  onSuccess,
  initialData,
  onSubmitRef,
  createdFirmId,
}: Step1CreateFirmProps) => {
  const methods = useForm<FirmFormValues>({
    defaultValues,
    resolver: yupResolver(firmSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { handleSubmit, watch, control, reset } = methods;
  const isTrial = watch("isTrial");

  const { mutate } = useCreateEditFirmMutation();

  const isEditMode = Boolean(createdFirmId);

  const onSubmit = useCallback(
    (data: FirmFormValues) => {
      const payload: FirmPayload = {
        // Include id for UPDATE - the same endpoint handles both create and edit
        ...(createdFirmId ? { id: createdFirmId } : {}),
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
        // Only include password on CREATE (not update) if it's empty
        ...(createdFirmId && !data.adminPassword
          ? {}
          : data.adminPassword
          ? { adminPassword: data.adminPassword }
          : {}),
        isTrial: data.isTrial ?? false,
        ...(data.isTrial && data.trialDays ? { trialDays: data.trialDays } : {}),
      };

      mutate(payload, {
        onSuccess: (response) => {
          if (createdFirmId) {
            // UPDATE mode - just move to next step, keep the same firmId
            onSuccess({
              firmId: createdFirmId,
              adminUsername: data.adminUsername,
              firmName: data.name,
            });
          } else {
            // CREATE mode - extract the new firm ID from response
            const responseData = response?.data?.data;

            let firmId = "";
            let adminId: string | undefined;
            let adminRoleId: string | undefined;
            let firmName = data.name;

            if (responseData) {
              firmId =
                responseData.firmId ||
                responseData.id ||
                responseData.firm?.id ||
                "";
              adminId = responseData.adminId || responseData.admin?.id;
              adminRoleId =
                responseData.adminRoleId || responseData.admin?.roleId;
              firmName = responseData.firmName || responseData.name || data.name;
            }

            if (firmId) {
              onSuccess({
                firmId,
                adminId,
                adminRoleId,
                adminUsername: data.adminUsername,
                firmName,
              });
            }
          }
        },
      });
    },
    [mutate, onSuccess, createdFirmId]
  );

  // Expose submit function to parent
  useEffect(() => {
    if (onSubmitRef) {
      onSubmitRef.current = () => {
        handleSubmit(onSubmit)();
      };
    }
    return () => {
      if (onSubmitRef) {
        onSubmitRef.current = null;
      }
    };
  }, [onSubmitRef, handleSubmit, onSubmit]);

  // Reset form when initialData is provided (navigating back to Step 1)
  useEffect(() => {
    if (initialData) {
      // Map API response to form fields - using the same field mapping as AddEditFirm
      const d = initialData as Record<string, unknown>;
      reset({
        lawFirmCode: (d.firmCode as string) || (d.lawFirmCode as string) || "",
        name: (d.name as string) || (d.firmName as string) || "",
        firmType: (d.firmType as "SOLO" | "FIRM" | "") || "",
        // Firm email/phone/address
        email: (d.firmEmail as string) || (d.email as string) || "",
        phone: (d.firmPhone as string) || (d.phone as string) || "",
        address: (d.firmAddress as string) || (d.address as string) || "",
        jurisdiction: (d.jurisdiction as string) || "",
        // Admin details
        adminUsername: (d.username as string) || (d.adminUsername as string) || "",
        adminEmail: (d.adminEmail as string) || "",
        adminMobileNo: (d.mobileNo as string) || (d.adminMobileNo as string) || "",
        adminPassword: "", // Don't reset password for security
        adminFullName: (d.adminFullName as string) || (d.fullName as string) || "",
        isTrial: (d.isTrial as boolean) ?? false,
        trialDays: (d.trialDays as number) || 30,
      });
    }
  }, [initialData, reset]);

  return (
    <FormProvider methods={methods}>
      <Stack gap={6}>
        <Stack gap={1}>
          <Text fontWeight="semibold" fontSize="sm" color="gray.600">
            {isEditMode
              ? "Update the firm and its administrator account."
              : "Create the firm and its administrator account."}
          </Text>
        </Stack>

        {/* Firm Details */}
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
            <TextFieldInput
              name="jurisdiction"
              label="Jurisdiction"
              placeholder="e.g. Bagmati Province"
              required
            />
          </GridItem>
        </Grid>

        {/* Admin Details */}
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

          <GridItem colSpan={2}>
            <TextFieldInput
              name="adminPassword"
              label={isEditMode ? "Admin Password (leave empty to keep current)" : "Admin Password"}
              placeholder={isEditMode ? "Leave empty to keep current password" : "Set initial password"}
              required={!isEditMode}
            />
          </GridItem>
        </Grid>

        {/* Trial Settings */}
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
    </FormProvider>
  );
};
