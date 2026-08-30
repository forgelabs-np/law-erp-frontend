import {
  Box,
  Button,
  Flex,
  Input,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker } from "@/shared/components/ui";
import { useEffect } from "react";

import {
  useProjectByCodeQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "../api/project.api";
import { useGetEmployeesQuery } from "@/api/employeeManagement";
import { CreateProjectRequest, UpdateProjectRequest } from "../types/project.types";
import { FieldSelect } from "@/pages/User/CaseManagement/components/ui";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
} from "@/shared/components/ui/Dialog";
import { projectSchema, ProjectSchemaType } from "@/validations";

interface ProjectFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  projectCode?: string;
}

const defaultValues: ProjectSchemaType = {
  name: "",
  clientName: "",
  clientUserId: "",
  description: "",
  startDate: "",
  targetEndDate: "",
  ownerId: "",
};

export const ProjectFormModal = ({
  open,
  onOpenChange,
  mode,
  projectCode,
}: ProjectFormModalProps) => {
  const createMutation = useCreateProjectMutation();
  const updateMutation = useUpdateProjectMutation();
  const { data: employees } = useGetEmployeesQuery();
  const employeeList = employees?.content ?? [];

  const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
    refetch,
  } = useProjectByCodeQuery(projectCode || "");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectSchemaType>({
    defaultValues,
    resolver: yupResolver(projectSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (!open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  // Populate form when modal opens with project data (edit mode)
  useEffect(() => {
    if (open && mode === "edit" && project) {
      reset({
        name: project.name || "",
        clientName: project.clientName || "",
        clientUserId: project.clientUserId || "",
        description: project.description || "",
        startDate: project.startDate || "",
        targetEndDate: project.targetEndDate || "",
        ownerId: project.ownerId || "",
      });
    }
  }, [open, project, mode, reset]);

  const onSubmit = (data: ProjectSchemaType) => {
    if (mode === "create") {
      createMutation.mutate(data as CreateProjectRequest, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    } else if (mode === "edit" && projectCode) {
      updateMutation.mutate(
        {
          projectCode,
          data: data as UpdateProjectRequest,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const canSubmit = !isSubmitting && !isProjectLoading;

  const title = mode === "create" ? "Create Project" : "Edit Project";
  const submitButtonText = mode === "create" ? "Create Project" : "Save Changes";

  return (
    <DialogRoot open={open} onOpenChange={(details) => onOpenChange(details.open)}>
      <DialogContent maxW="4xl" maxH="90vh">
        {/* Form wraps both body and footer so the submit button is inside the form */}
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          display="flex"
          flexDirection="column"
        >
          <DialogHeader>
            <Flex justify="space-between" align="center">
              <DialogTitle>{title}</DialogTitle>
              <DialogCloseTrigger />
            </Flex>
          </DialogHeader>

          <DialogBody>
            {mode === "edit" && isProjectLoading ? (
              <Stack gap={5}>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <VStack key={i} align="flex-start" gap={1.5}>
                      <Skeleton h="14px" w="80px" borderRadius="md" />
                      <Skeleton h="32px" w="full" borderRadius="md" />
                    </VStack>
                  ))}
                </SimpleGrid>
                <VStack align="flex-start" gap={1.5}>
                  <Skeleton h="14px" w="80px" borderRadius="md" />
                  <Skeleton h="64px" w="full" borderRadius="md" />
                </VStack>
              </Stack>
            ) : mode === "edit" && isProjectError ? (
              <Box
                p={6}
                bg="red.50"
                border="1px solid"
                borderColor="red.200"
                borderRadius="lg"
                textAlign="center"
              >
                <Text fontSize="sm" color="red.700">
                  Failed to load project. Please try again.
                </Text>
                <Button variant="outline" size="sm" mt={4} onClick={() => refetch()}>
                  Retry
                </Button>
              </Box>
            ) : (
              <Stack gap={5}>
                {/* Section heading */}
                <Stack gap={1}>
                  <Text fontSize="sm" fontWeight="600" color="gray.800">
                    Project Details
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {mode === "create"
                      ? "Enter the information needed to create this project."
                      : "Update the project details below."}
                  </Text>
                </Stack>

                {/* Form fields */}
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <VStack align="flex-start" gap={1.5}>
                        <Text fontSize="sm" fontWeight="500" color="gray.700">
                          Project Name{" "}
                          <Text as="span" color="red.500">*</Text>
                        </Text>
                        <Input
                          {...field}
                          placeholder="Enter project name"
                          size="sm"
                          disabled={isSubmitting}
                          borderColor={errors.name ? "red.500" : undefined}
                        />
                        {errors.name && (
                          <Text fontSize="xs" color="red.500">
                            {errors.name.message}
                          </Text>
                        )}
                      </VStack>
                    )}
                  />

                  <Controller
                    name="clientName"
                    control={control}
                    render={({ field }) => (
                      <VStack align="flex-start" gap={1.5}>
                        <Text fontSize="sm" fontWeight="500" color="gray.700">
                          Client Name{" "}
                          <Text as="span" color="red.500">*</Text>
                        </Text>
                        <Input
                          {...field}
                          placeholder="Enter client name"
                          size="sm"
                          disabled={isSubmitting}
                          borderColor={errors.clientName ? "red.500" : undefined}
                        />
                        {errors.clientName && (
                          <Text fontSize="xs" color="red.500">
                            {errors.clientName.message}
                          </Text>
                        )}
                      </VStack>
                    )}
                  />

                  <Controller
                    name="clientUserId"
                    control={control}
                    render={({ field }) => (
                      <VStack align="flex-start" gap={1.5}>
                        <Text fontSize="sm" fontWeight="500" color="gray.700">
                          Client User
                        </Text>
                        <FieldSelect
                          placeholder="Select client user (optional)"
                          value={field.value || ""}
                          onChange={field.onChange}
                          size="sm"
                          disabled={isSubmitting}
                        >
                          {employeeList.map((emp: any) => (
                            <option key={emp.id} value={emp.id}>
                              {emp.fullName}
                            </option>
                          ))}
                        </FieldSelect>
                      </VStack>
                    )}
                  />

                  <Controller
                    name="ownerId"
                    control={control}
                    render={({ field }) => (
                      <VStack align="flex-start" gap={1.5}>
                        <Text fontSize="sm" fontWeight="500" color="gray.700">
                          Project Owner{" "}
                          <Text as="span" color="red.500">*</Text>
                        </Text>
                        <FieldSelect
                          placeholder="Select project owner"
                          value={field.value}
                          onChange={field.onChange}
                          size="sm"
                          disabled={isSubmitting}
                        >
                          {employeeList.map((emp: any) => (
                            <option key={emp.id} value={emp.id}>
                              {emp.fullName} - {emp.designation}
                            </option>
                          ))}
                        </FieldSelect>
                        {errors.ownerId && (
                          <Text fontSize="xs" color="red.500">
                            {errors.ownerId.message}
                          </Text>
                        )}
                      </VStack>
                    )}
                  />

                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <VStack align="flex-start" gap={1.5}>
                        <Text fontSize="sm" fontWeight="500" color="gray.700">
                          Start Date{" "}
                          <Text as="span" color="red.500">*</Text>
                        </Text>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select start date"
                        />
                        {errors.startDate && (
                          <Text fontSize="xs" color="red.500">
                            {errors.startDate.message}
                          </Text>
                        )}
                      </VStack>
                    )}
                  />

                  <Controller
                    name="targetEndDate"
                    control={control}
                    render={({ field: endDateField }) => (
                      <VStack align="flex-start" gap={1.5}>
                        <Text fontSize="sm" fontWeight="500" color="gray.700">
                          Target End Date
                        </Text>
                        <DatePicker
                          value={endDateField.value || ""}
                          onChange={endDateField.onChange}
                          placeholder="Select target end date"
                        />
                        {errors.targetEndDate && (
                          <Text fontSize="xs" color="red.500">
                            {errors.targetEndDate.message}
                          </Text>
                        )}
                      </VStack>
                    )}
                  />
                </SimpleGrid>

                {/* Description - full width */}
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <VStack align="flex-start" gap={1.5}>
                      <Text fontSize="sm" fontWeight="500" color="gray.700">
                        Description
                      </Text>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter project description"
                        rows={3}
                        size="sm"
                        resize="vertical"
                        disabled={isSubmitting}
                      />
                    </VStack>
                  )}
                />
              </Stack>
            )}
          </DialogBody>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              loading={isSubmitting}
              disabled={!canSubmit}
            >
              {submitButtonText}
            </Button>
          </DialogFooter>
        </Box>
      </DialogContent>
    </DialogRoot>
  );
};
