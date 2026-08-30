import {
  Box,
  Button,
  Flex,
  Input,
  Separator,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useProjectByCodeQuery,
  useUpdateProjectMutation,
} from "../api/project.api";
import { useGetEmployeesQuery } from "@/api/employeeManagement";
import { UpdateProjectRequest } from "../types/project.types";
import { FieldSelect } from "@/pages/User/CaseManagement/components/ui";
import { projectSchema, ProjectSchemaType } from "@/validations";
import { DatePicker } from "@/shared/components/ui";

const defaultValues: ProjectSchemaType = {
  name: "",
  clientName: "",
  clientUserId: "",
  description: "",
  startDate: "",
  targetEndDate: "",
  ownerId: "",
};

const EditProjectPage = () => {
  const navigate = useNavigate();
  const { projectCode } = useParams<{ projectCode: string }>();
  const updateMutation = useUpdateProjectMutation();
  const { data: employees } = useGetEmployeesQuery();
  const employeeList = employees?.content ?? [];

  const {
    data: project,
    isLoading,
    isError,
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

  useEffect(() => {
    if (project) {
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
  }, [project, reset]);

  const onSubmit = async (data: ProjectSchemaType) => {
    if (!projectCode) return;

    await updateMutation.mutateAsync({
      projectCode,
      data: data as UpdateProjectRequest,
    });
    navigate(`/projects/${projectCode}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <Stack gap={6} maxW="4xl" w="full" mx="auto">
        <Box>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/projects")}
            color="gray.600"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Button>
        </Box>

        <Stack gap={1}>
          <Skeleton h="28px" w="180px" borderRadius="md" />
          <Skeleton h="16px" w="260px" borderRadius="md" />
        </Stack>

        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          overflow="hidden"
        >
          <Stack px={6} pt={6} pb={4}>
            <Skeleton h="16px" w="120px" borderRadius="md" />
            <Skeleton h="12px" w="220px" borderRadius="md" />
          </Stack>
          <Stack px={6} pb={6} gap={5}>
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
        </Box>
      </Stack>
    );
  }

  // Error state
  if (isError || !project) {
    return (
      <Stack gap={6} maxW="4xl" w="full" mx="auto">
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
      </Stack>
    );
  }

  return (
    <Stack gap={6} maxW="4xl" w="full" mx="auto">
      {/* Back link */}
      <Box>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/projects/${projectCode}`)}
          color="gray.600"
          _hover={{ color: "primary.500" }}
        >
          <ArrowLeft size={16} />
          Back to Project
        </Button>
      </Box>

      {/* Page header */}
      <Stack gap={1}>
        <Text textStyle="heading_4">Edit Project</Text>
        <Text fontSize="sm" color="gray.500">
          Update the project details below.
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
                    value={field.value || ""}
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
                  maxLength={1000}
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
            onClick={() => navigate(`/projects/${projectCode}`)}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            loading={updateMutation.isPending}
          >
            Save Changes
          </Button>
        </Flex>
      </Box>
    </Stack>
  );
};

export default EditProjectPage;
