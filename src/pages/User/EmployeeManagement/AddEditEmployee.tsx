import { Grid, GridItem, Stack, Text } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  useEmployeeByIdQuery,
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
} from "@/api/employeeManagement";
import { useGetRoleQuery } from "@/api/roleSetup.ts";
import { FormProvider, ReactSelect, TextFieldInput } from "@/shared/components";
import CustomDrawer from "@/shared/components/drawer/CustomerDrawer";

import { EmployeeFormValues } from "./types";

const defaultValues: EmployeeFormValues = {
  username: "",
  email: "",
  mobileNo: "",
  password: "",
  fullName: "",
  roleId: "",
  designation: "",
  departmentId: "",
  barCouncilNo: "",
  specialization: "",
  joiningDate: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  notes: "",
};

export const AddEditEmployee = ({
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
  const { data: employeeById, isLoading: isLoadingEmployee } =
    useEmployeeByIdQuery(id ?? "");

  const { data: rolesData } = useGetRoleQuery();

  const roleOptions =
    rolesData?.data?.map((role) => ({
      label: role.name,
      value: String(role.id),
    })) ?? [];

  const methods = useForm<EmployeeFormValues>({ defaultValues });
  const { handleSubmit, reset } = methods;

  const { mutate: addEmployee, isPending: isAddPending } =
    useAddEmployeeMutation();
  const { mutate: updateEmployee, isPending: isUpdatePending } =
    useUpdateEmployeeMutation();

  const isPending = isAddPending || isUpdatePending;

  useEffect(() => {
    if (open && !id) {
      reset(defaultValues);
      setId("");
    }
  }, [open, id, reset, setId]);

  useEffect(() => {
    if (open && employeeById && id) {
      reset({
        username: employeeById.username ?? "",
        email: employeeById.email ?? "",
        mobileNo: employeeById.mobileNo ?? "",
        password: "",
        fullName: employeeById.fullName ?? "",
        roleId: employeeById.roleId ?? "",
        designation: employeeById.designation ?? "",
        departmentId: employeeById.departmentId ?? "",
        barCouncilNo: employeeById.barCouncilNo ?? "",
        specialization: employeeById.specialization ?? "",
        joiningDate: employeeById.joiningDate ?? "",
        emergencyContactName: employeeById.emergencyContactName ?? "",
        emergencyContactPhone: employeeById.emergencyContactPhone ?? "",
        notes: employeeById.notes ?? "",
      });
    }
  }, [open, employeeById, id, reset]);

  const onSubmit = (data: EmployeeFormValues) => {
    if (id) {
      updateEmployee({ id, data }, { onSuccess: () => closeHandler() });
    } else {
      addEmployee({ ...data }, { onSuccess: () => closeHandler() });
    }
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
        title={id ? "Edit Employee" : "Add Employee"}
        subHeading="Fill in the employee details below"
        hasFooter
        submitButtonText="Submit"
        exitButtonText="Close"
        resetButtonText="Clear"
        handleReset={resetHandler}
        handleExit={closeHandler}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isPending}
        disabled={!!id && isLoadingEmployee}
        component={
          <Stack gap={6} p={4}>
            {/* ── Basic Info ─────────────────────────────────────── */}
            <Stack gap={1}>
              <Text fontWeight="semibold" fontSize="sm" color="gray.600">
                Basic Information
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
                  label="Mobile No."
                  placeholder="98XXXXXXXX"
                  required
                />
              </GridItem>

              {!id && (
                <GridItem>
                  <TextFieldInput
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Set initial password"
                    required
                  />
                </GridItem>
              )}

              <GridItem>
                <ReactSelect
                  name="roleId"
                  label="Role"
                  placeholder="Select Role"
                  options={roleOptions}
                  required
                />
              </GridItem>

              <GridItem>
                <TextFieldInput
                  name="designation"
                  label="Designation"
                  placeholder="e.g. Senior Associate"
                  required
                />
              </GridItem>

              <GridItem>
                <TextFieldInput
                  name="departmentId"
                  label="Department ID"
                  placeholder="Department identifier"
                  required
                />
              </GridItem>

              <GridItem>
                <TextFieldInput
                  name="joiningDate"
                  label="Joining Date"
                  type="date"
                  required
                />
              </GridItem>
            </Grid>

            {/* ── Professional Details ───────────────────────────── */}
            <Stack gap={1} mt={2}>
              <Text fontWeight="semibold" fontSize="sm" color="gray.600">
                Professional Details
              </Text>
            </Stack>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <TextFieldInput
                  name="barCouncilNo"
                  label="Bar Council No."
                  placeholder="Bar council registration number"
                />
              </GridItem>

              <GridItem>
                <TextFieldInput
                  name="specialization"
                  label="Specialization"
                  placeholder="e.g. Civil Law, Criminal Law"
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

            {/* ── Emergency Contact ───────────────────────────────── */}
            <Stack gap={1} mt={2}>
              <Text fontWeight="semibold" fontSize="sm" color="gray.600">
                Emergency Contact
              </Text>
            </Stack>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <TextFieldInput
                  name="emergencyContactName"
                  label="Contact Name"
                  placeholder="Emergency contact person"
                />
              </GridItem>

              <GridItem>
                <TextFieldInput
                  name="emergencyContactPhone"
                  label="Contact Phone"
                  placeholder="98XXXXXXXX"
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
