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
import { DatePicker } from "@/shared/components/ui";
import { useEffect, useState } from "react";

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

interface ProjectFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  projectCode?: string;
}

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

  const [formData, setFormData] = useState<CreateProjectRequest>({
    name: "",
    clientName: "",
    clientUserId: "",
    description: "",
    startDate: "",
    targetEndDate: "",
    ownerId: "",
  });

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (!open) {
      setFormData({
        name: "",
        clientName: "",
        clientUserId: "",
        description: "",
        startDate: "",
        targetEndDate: "",
        ownerId: "",
      });
    }
  }, [open]);

  // Populate form when project data is available (edit mode)
  useEffect(() => {
    if (mode === "edit" && project) {
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
  }, [project, mode]);

  const handleChange = (field: keyof CreateProjectRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "create") {
      createMutation.mutate(formData, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    } else if (mode === "edit" && projectCode) {
      updateMutation.mutate(
        {
          projectCode,
          data: formData as UpdateProjectRequest,
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
        <DialogHeader>
          <Flex justify="space-between" align="center">
            <DialogTitle>{title}</DialogTitle>
            <DialogCloseTrigger />
          </Flex>
        </DialogHeader>

        <DialogBody asChild>
          <Box
            as="form"
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
          >
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
                  <VStack align="flex-start" gap={1.5}>
                    <Text fontSize="sm" fontWeight="500" color="gray.700">
                      Project Name{" "}
                      <Text as="span" color="red.500">
                        *
                      </Text>
                    </Text>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Enter project name"
                      required
                      maxLength={200}
                      size="sm"
                      disabled={isSubmitting}
                    />
                  </VStack>

                  <VStack align="flex-start" gap={1.5}>
                    <Text fontSize="sm" fontWeight="500" color="gray.700">
                      Client Name{" "}
                      <Text as="span" color="red.500">
                        *
                      </Text>
                    </Text>
                    <Input
                      value={formData.clientName}
                      onChange={(e) => handleChange("clientName", e.target.value)}
                      placeholder="Enter client name"
                      required
                      maxLength={200}
                      size="sm"
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                      Project Owner{" "}
                      <Text as="span" color="red.500">
                        *
                      </Text>
                    </Text>
                    <FieldSelect
                      placeholder="Select project owner"
                      value={formData.ownerId}
                      onChange={(value) => handleChange("ownerId", value)}
                      size="sm"
                      disabled={isSubmitting}
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
                      Start Date{" "}
                      <Text as="span" color="red.500">
                        *
                      </Text>
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
                    disabled={isSubmitting}
                  />
                </VStack>
              </Stack>
            )}
          </Box>
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
      </DialogContent>
    </DialogRoot>
  );
};
