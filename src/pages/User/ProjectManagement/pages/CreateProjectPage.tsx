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
import { DatePicker } from "@/shared/components/ui";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateProjectMutation } from "../api/project.api";
import { useGetEmployeesQuery } from "@/api/employeeManagement";
import { CreateProjectRequest } from "../types/project.types";
import { FieldSelect } from "@/pages/User/CaseManagement/components/ui";

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateProjectMutation();
  const { data: employees } = useGetEmployeesQuery();
  const employeeList = employees?.content ?? [];

  const [formData, setFormData] = useState<CreateProjectRequest>({
    name: "",
    clientName: "",
    clientUserId: "",
    description: "",
    startDate: "",
    targetEndDate: "",
    ownerId: "",
  });

  const handleChange = (field: keyof CreateProjectRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData, {
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
          <Text fontSize="xs" color="gray.500">
            Enter the information needed to create this project.
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
                value={formData.name}
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
                value={formData.clientName}
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
                value={formData.ownerId}
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
              <DatePicker
                value={formData.startDate}
                onChange={(value) => handleChange("startDate", value)}
                placeholder="Select start date"
              />
            </VStack>

            <VStack align="flex-start" gap={1.5}>
              <Text fontSize="sm" fontWeight="500" color="gray.700">
                Target End Date
              </Text>
              <DatePicker
                value={formData.targetEndDate || ""}
                onChange={(value) => handleChange("targetEndDate", value)}
                placeholder="Select target end date"
                minDate={formData.startDate || undefined}
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
            onClick={() => navigate("/projects")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" loading={isSubmitting}>
            Create Project
          </Button>
        </Flex>
      </Box>
    </Stack>
  );
};

export default CreateProjectPage;
