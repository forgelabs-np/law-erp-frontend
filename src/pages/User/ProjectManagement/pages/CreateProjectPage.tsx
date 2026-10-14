import { Box, Button, Flex, Separator, Stack, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useCreateProjectMutation } from "../api/project.api";
import { useGetEmployeesQuery } from "@/api/employeeManagement";
import { ProjectClientType } from "../types/project.types";
import {
  buildCreateProjectPayload,
  useProjectCreateFlow,
} from "../hooks/useProjectCreateFlow";
import { ClientTypeSelection } from "../components/ClientTypeSelection";
import { ProjectCreateFields } from "../components/ProjectCreateFields";
import { ProjectSchemaType, getProjectSchema } from "@/validations";
import { useGetClientsQuery } from "@/api/clientManagement";

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

  // Client type selection state (shared logic with the Create Project modal).
  const [clientType, setClientType] = useState<ProjectClientType | null>(null);

  const { data: employees } = useGetEmployeesQuery();
  // Existing-client options are only fetched once "Existing Client" is chosen.
  const { data: clients } = useGetClientsQuery({
    enabled: clientType === "existing",
  });
  const employeeList = employees?.content ?? [];
  const clientList = clients?.content ?? [];

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<ProjectSchemaType>({
    defaultValues,
    // Validation follows the selected client type: hidden fields never block
    // submission.
    resolver: yupResolver(getProjectSchema(clientType)),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { step, selectClientType, goToForm, goToSelection } =
    useProjectCreateFlow({
      clientType,
      setClientType,
      setValue,
      clearErrors,
    });

  const onSubmit = (data: ProjectSchemaType) => {
    createMutation.mutate(
      buildCreateProjectPayload(data, clientType, clientList),
      {
        onSuccess: () => {
          navigate("/projects");
        },
      }
    );
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
        {step === "select" ? (
          /* Step 1 — client type selection */
          <Box px={6} py={6}>
            <ClientTypeSelection
              value={clientType}
              onChange={selectClientType}
              onContinue={goToForm}
              disabled={isSubmitting}
            />
          </Box>
        ) : (
          /* Step 2 — project details for the chosen client type */
          <Box px={6} py={6}>
            <ProjectCreateFields
              control={control}
              errors={errors}
              clientType={clientType}
              clients={clientList}
              employees={employeeList}
              onBack={goToSelection}
              disabled={isSubmitting}
            />
          </Box>
        )}

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
          {step === "form" && (
            <Button
              variant="primary"
              size="sm"
              type="submit"
              loading={isSubmitting}
            >
              Create Project
            </Button>
          )}
        </Flex>
      </Box>
    </Stack>
  );
};

export default CreateProjectPage;
