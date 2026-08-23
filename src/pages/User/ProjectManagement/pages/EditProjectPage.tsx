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
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useProjectByCodeQuery,
  useUpdateProjectMutation,
} from "../api/project.api";
import { useGetEmployeesQuery } from "@/api/employeeManagement";
import { UpdateProjectRequest } from "../types/project.types";
import { FieldSelect } from "@/pages/User/CaseManagement/components/ui";

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

  const [formData, setFormData] = useState<UpdateProjectRequest>({
    name: "",
    clientName: "",
    clientUserId: "",
    description: "",
    startDate: "",
    targetEndDate: "",
    ownerId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        clientName: project.clientName || "",
        clientUserId: project.clientUserId || "",
        description: project.description || "",
        startDate: project.startDate || "",
        targetEndDate: project.targetEndDate || "",
        ownerId: project.ownerId || "",
      });
    }
  }, [project]);

  const handleChange = (field: keyof UpdateProjectRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectCode) return;

    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync({
        projectCode,
        data: formData,
      });
      navigate(`/projects/${projectCode}`);
    } catch (error) {
      setIsSubmitting(false);
    }
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
        onSubmit={handleSubmit}
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
            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="sm" fontWeight="500" color="gray.700">
                Project Name <Text as="span" color="red.500">*</Text>
              </Text>
              <Input
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter project name"
                required
                maxLength={200}
                size="sm"
              />
            </VStack>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="sm" fontWeight="500" color="gray.700">
                Client Name <Text as="span" color="red.500">*</Text>
              </Text>
              <Input
                value={formData.clientName || ""}
                onChange={(e) => handleChange("clientName", e.target.value)}
                placeholder="Enter client name"
                required
                maxLength={200}
                size="sm"
              />
            </VStack>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="sm" fontWeight="500" color="gray.700">
                Client User
              </Text>
              <FieldSelect
                placeholder="Select client user (optional)"
                value={formData.clientUserId || ""}
                onChange={(value) => handleChange("clientUserId", value)}
                size="sm"
              >
                {employeeList.map((emp: any) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName}
                  </option>
                ))}
              </FieldSelect>
            </VStack>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="sm" fontWeight="500" color="gray.700">
                Project Owner <Text as="span" color="red.500">*</Text>
              </Text>
              <FieldSelect
                placeholder="Select project owner"
                value={formData.ownerId || ""}
                onChange={(value) => handleChange("ownerId", value)}
                size="sm"
              >
                {employeeList.map((emp: any) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName} - {emp.designation}
                  </option>
                ))}
              </FieldSelect>
            </VStack>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="sm" fontWeight="500" color="gray.700">
                Start Date <Text as="span" color="red.500">*</Text>
              </Text>
              <Input
                type="date"
                value={formData.startDate || ""}
                onChange={(e) => handleChange("startDate", e.target.value)}
                size="sm"
              />
            </VStack>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="sm" fontWeight="500" color="gray.700">
                Target End Date
              </Text>
              <Input
                type="date"
                value={formData.targetEndDate || ""}
                onChange={(e) => handleChange("targetEndDate", e.target.value)}
                min={formData.startDate || undefined}
                size="sm"
              />
            </VStack>
          </SimpleGrid>

          {/* Description - full width */}
          <VStack align="flex-start" gap={1.5}>
            <Text fontSize="sm" fontWeight="500" color="gray.700">
              Description
            </Text>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter project description"
              rows={3}
              size="sm"
              maxLength={1000}
              resize="vertical"
            />
          </VStack>
        </Stack>

        {/* Divider + Footer */}
        <Separator borderColor="gray.200" />
        <Flex px={6} py={3} justify="flex-end" gap={3}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/projects/${projectCode}`)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            loading={isSubmitting || updateMutation.isPending}
          >
            Save Changes
          </Button>
        </Flex>
      </Box>
    </Stack>
  );
};

export default EditProjectPage;
