import {
  Button,
  GridItem,
  Input,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import { ArrowLeft } from "lucide-react";

import { DatePicker } from "@/shared/components/ui";
import { FieldSelect } from "@/pages/User/CaseManagement/components/ui";
import type { EmployeeResponseType } from "@/api/employeeManagement";
import type { Client } from "@/pages/User/ClientManagement/types";
import type { ProjectSchemaType } from "@/validations";

import type { ProjectClientType } from "../types/project.types";

interface ProjectCreateFieldsProps {
  control: Control<ProjectSchemaType>;
  errors: FieldErrors<ProjectSchemaType>;
  clientType: ProjectClientType | null;
  /** Existing client options (only fetched in "Existing Client" mode). */
  clients: Client[];
  /** Project owner options. */
  employees: EmployeeResponseType[];
  onBack: () => void;
  disabled?: boolean;
}

/**
 * Step 2 of the create-project flow: the project details form, shared by the
 * Projects page modal and the dedicated Create Project page.
 *
 * - Existing Client → shows the Client User dropdown (required).
 * - New Client → shows the Client Name input (required).
 * The irrelevant client field is never rendered, so it can't be validated or
 * submitted by accident.
 */
export const ProjectCreateFields = ({
  control,
  errors,
  clientType,
  clients,
  employees,
  onBack,
  disabled = false,
}: ProjectCreateFieldsProps) => {
  return (
    <Stack gap={5}>
      {/* Back to client type selection — keeps the form values intact and
          never submits anything. */}
      <Button
        variant="ghost"
        size="sm"
        alignSelf="flex-start"
        onClick={onBack}
        disabled={disabled}
        aria-label="Back to client type selection"
        color="gray.600"
        px={0}
        _hover={{ color: "primary.500" }}
      >
        <ArrowLeft size={16} />
        Back
      </Button>

      <Stack gap={1}>
        <Text fontSize="sm" fontWeight="600" color="gray.800">
          Project Details
        </Text>
        <Text fontSize="xs" color="gray.500">
          Enter the information needed to create this project.
        </Text>
      </Stack>

      {/* Form fields — `align="stretch"` keeps every control at the full width
          of its grid column (native selects shrink-wrap otherwise). */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <VStack align="stretch" gap={1.5}>
              <Text fontSize="sm" fontWeight="500" color="gray.700">
                Project Name{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </Text>
              <Input
                {...field}
                aria-label="Project Name"
                placeholder="Enter project name"
                size="sm"
                disabled={disabled}
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

        {clientType === "existing" ? (
          <Controller
            name="clientUserId"
            control={control}
            render={({ field }) => (
              <VStack align="stretch" gap={1.5}>
                <Text fontSize="sm" fontWeight="500" color="gray.700">
                  Client User{" "}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </Text>
                <FieldSelect
                  placeholder="Select client user"
                  value={field.value || ""}
                  onChange={field.onChange}
                  size="sm"
                  inputHeight="36px"
                  disabled={disabled}
                  ariaLabel="Client User"
                >
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.fullName}
                    </option>
                  ))}
                </FieldSelect>
                {errors.clientUserId && (
                  <Text fontSize="xs" color="red.500">
                    {errors.clientUserId.message}
                  </Text>
                )}
              </VStack>
            )}
          />
        ) : (
          <Controller
            name="clientName"
            control={control}
            render={({ field }) => (
              <VStack align="stretch" gap={1.5}>
                <Text fontSize="sm" fontWeight="500" color="gray.700">
                  Client Name{" "}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </Text>
                <Input
                  {...field}
                  aria-label="Client Name"
                  placeholder="Enter client name"
                  size="sm"
                  disabled={disabled}
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
        )}

        <Controller
          name="ownerId"
          control={control}
          render={({ field }) => (
            <VStack align="stretch" gap={1.5}>
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
                inputHeight="36px"
                disabled={disabled}
                ariaLabel="Project Owner"
              >
                {employees.map((emp) => (
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

        {/* Keeps Project Owner on the right of its row (matching the original
            layout) and Start/Target End Date paired on the last row. Hidden on
            mobile where the grid stacks to a single column. */}
        <GridItem display={{ base: "none", md: "block" }} />

        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <VStack align="stretch" gap={1.5}>
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
            <VStack align="stretch" gap={1.5}>
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
          <VStack align="stretch" gap={1.5}>
            <Text fontSize="sm" fontWeight="500" color="gray.700">
              Description
            </Text>
            <Textarea
              {...field}
              value={field.value ?? ""}
              aria-label="Description"
              placeholder="Enter project description"
              rows={3}
              size="sm"
              resize="vertical"
              disabled={disabled}
            />
          </VStack>
        )}
      />
    </Stack>
  );
};
