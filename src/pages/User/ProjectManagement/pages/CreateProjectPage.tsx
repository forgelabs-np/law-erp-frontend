import {
  Box,
  Button,
  Flex,
  Input,
  Separator,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker } from "@/shared/components/ui";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useCreateProjectMutation } from "../api/project.api";
import { useGetEmployeesQuery } from "@/api/employeeManagement";
import { CreateProjectRequest } from "../types/project.types";
import { FieldSelect } from "@/pages/User/CaseManagement/components/ui";
import { projectSchema, ProjectSchemaType } from "@/validations";

const defaultValues: ProjectSchemaType = {
  name: "",
  clientName: "",
  clientUserId: "",
  description: "",
  startDate: "",
  targetEndDate: "",
  ownerId: "",
};

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateProjectMutation();
  const { data: employees } = useGetEmployeesQuery();
  const employeeList = employees?.content ?? [];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectSchemaType>({
    defaultValues,
    resolver: yupResolver(projectSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = (data: ProjectSchemaType) => {
    createMutation.mutate(data as CreateProjectRequest, {
      onSuccess: () => {
        navigate("/projects");
      },
    });
  };

  const isSubmitting = createMutation.isPending;

  return (
    <Stack gap={6} maxW="4xl" w="full" mx="auto">
      {/* Back link */}
      <Box>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/projects")}
          color="gray.600"
          _hover={{ color: "primary.500" }}
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Button>
      </Box>

      {/* Page header */}
      <Stack gap={1}>
        <Text textStyle="heading_4">Create New Project</Text>
        <Text fontSize="sm" color="gray.500">
          Create a new project to manage credentials and renewals.
        </Text>
      </Stack>

      {/* Form card */}
      <Box
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        overflow="hidden"
      >
        {/* Section heading */}
        <Stack px={6} pt={6} pb={4}>
          <Text fontSize="sm" fontWeight="600" color="gray.800">
            Project Details
          </Text>
          <Text fontSize="xs" color="gray.500">
            Enter the information needed to create this project.
          </Text>
        </Stack>

        {/* Form fields */}
        <Stack px={6} pb={6} gap={5}>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <VStack align="flex-start" gap={1.5}>
                  <Text fontSize="sm" fontWeight="500" color="gray.700">
                    Project Name{" "}
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  </Text>
                  <Input
                    {...field}
                    placeholder="Enter project name"
                    size="sm"
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
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  </Text>
                  <Input
                    {...field}
                    placeholder="Enter client name"
                    size="sm"
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
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  </Text>
                  <FieldSelect
                    placeholder="Select project owner"
                    value={field.value}
                    onChange={field.onChange}
                    size="sm"
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
                    <Text as="span" color="red.500">
                      *
                    </Text>
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
              render={({ field }) => (
                <VStack align="flex-start" gap={1.5}>
                  <Text fontSize="sm" fontWeight="500" color="gray.700">
                    Target End Date
                  </Text>
                  <DatePicker
                    value={field.value || ""}
                    onChange={field.onChange}
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
                />
              </VStack>
            )}
          />
        </Stack>

        {/* Divider + Footer */}
        <Separator borderColor="gray.200" />
        <Flex px={6} py={3} justify="flex-end" gap={3}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/projects")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            loading={isSubmitting}
          >
            Create Project
          </Button>
        </Flex>
      </Box>
    </Stack>
  );
};

export default CreateProjectPage;
