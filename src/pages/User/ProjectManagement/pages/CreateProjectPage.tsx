import {
  Box,
  Button,
  Grid,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
  Textarea,
} from "@chakra-ui/react";
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
    <Stack gap={6} padding={2}>
      <Button variant="ghost" size="sm" onClick={() => navigate("/projects")}>
        <ArrowLeft size={16} /> Back to Projects
      </Button>
      <Stack gap={2}>
        <Text textStyle="heading_4">Create New Project</Text>
        <Text textStyle="paragraph_regular" color="gray.500">
          Create a new project to manage credentials and renewals
        </Text>
      </Stack>

      <Box
        as="form"
        onSubmit={handleSubmit}
        p={6}
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
      >
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          <VStack align="flex-start" gap={4}>
            <Box w="full">
              <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                Project Name *
              </Text>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter project name"
                required
                maxLength={200}
              />
            </Box>

            <Box w="full">
              <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                Client Name *
              </Text>
              <Input
                value={formData.clientName}
                onChange={(e) => handleChange("clientName", e.target.value)}
                placeholder="Enter client name"
                required
                maxLength={200}
              />
            </Box>

            <Box w="full">
              <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                Client User
              </Text>
              <FieldSelect
                placeholder="Select client user (optional)"
                value={formData.clientUserId || ""}
                onChange={(value) => handleChange("clientUserId", value)}
              >
                {employeeList.map((emp: any) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName}
                  </option>
                ))}
              </FieldSelect>
            </Box>

            <Box w="full">
              <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                Description
              </Text>
              <Textarea
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter project description"
                rows={3}
              />
            </Box>
          </VStack>

          <VStack align="flex-start" gap={4}>
            <Box w="full">
              <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                Start Date
              </Text>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
            </Box>

            <Box w="full">
              <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                Target End Date
              </Text>
              <Input
                type="date"
                value={formData.targetEndDate || ""}
                onChange={(e) => handleChange("targetEndDate", e.target.value)}
                min={formData.startDate || undefined}
              />
            </Box>

            <Box w="full">
              <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                Project Owner *
              </Text>
              <FieldSelect
                placeholder="Select project owner"
                value={formData.ownerId}
                onChange={(value) => handleChange("ownerId", value)}
              >
                {employeeList.map((emp: any) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName} - {emp.designation}
                  </option>
                ))}
              </FieldSelect>
            </Box>
          </VStack>
        </Grid>

        <HStack justify="flex-end" gap={3} mt={6}>
          <Button
            variant="outline"
            onClick={() => navigate("/projects")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={isSubmitting}>
            Create Project
          </Button>
        </HStack>
      </Box>
    </Stack>
  );
};

export default CreateProjectPage;
