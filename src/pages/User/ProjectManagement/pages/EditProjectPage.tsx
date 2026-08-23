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

  if (isLoading) {
    return (
      <Stack gap={6} padding={2}>
        <Button variant="ghost" size="sm" onClick={() => navigate("/projects")}>
          <ArrowLeft size={16} /> Back to Projects
        </Button>
        <Stack gap={4}>
          <Box h="40px" bg="gray.100" borderRadius="md" />
          <Box
            p={6}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
          >
            <Stack gap={4}>
              <Box h="40px" bg="gray.100" borderRadius="md" />
              <Box h="40px" bg="gray.100" borderRadius="md" />
              <Box h="80px" bg="gray.100" borderRadius="md" />
            </Stack>
          </Box>
        </Stack>
      </Stack>
    );
  }

  if (isError || !project) {
    return (
      <Stack gap={6} padding={2}>
        <Button variant="ghost" size="sm" onClick={() => navigate("/projects")}>
          <ArrowLeft size={16} /> Back to Projects
        </Button>
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
    <Stack gap={6} padding={2}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/projects/${projectCode}`)}
      >
        <ArrowLeft size={16} /> Back to Project
      </Button>

      <Box
        p={6}
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
      >
        <Text textStyle="heading_4" mb={6}>
          Edit Project
        </Text>

        <form onSubmit={handleSubmit}>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <VStack align="flex-start" gap={4}>
              <Box w="full">
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  Project Name *
                </Text>
                <Input
                  value={formData.name || ""}
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
                  value={formData.clientName || ""}
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
                  Start Date *
                </Text>
                <Input
                  type="date"
                  value={formData.startDate || ""}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  required
                />
              </Box>

              <Box w="full">
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  Target End Date
                </Text>
                <Input
                  type="date"
                  value={formData.targetEndDate || ""}
                  onChange={(e) =>
                    handleChange("targetEndDate", e.target.value)
                  }
                  min={formData.startDate || undefined}
                />
              </Box>
            </VStack>

            <VStack align="flex-start" gap={4}>
              <Box w="full">
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  Description
                </Text>
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter project description"
                  rows={8}
                  maxLength={1000}
                />
              </Box>

              <Box w="full">
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  Project Owner *
                </Text>
                <FieldSelect
                  placeholder="Select project owner"
                  value={formData.ownerId || ""}
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
              onClick={() => navigate(`/projects/${projectCode}`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting || updateMutation.isPending}
            >
              Save Changes
            </Button>
          </HStack>
        </form>
      </Box>
    </Stack>
  );
};

export default EditProjectPage;
