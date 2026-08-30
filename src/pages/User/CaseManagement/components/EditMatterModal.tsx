import {
  Box,
  Button,
  Input,
  Textarea,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogTitle,
} from "@/shared/components/ui/Dialog";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";

import { useGetEmployeesQuery } from "@/api/employeeManagement";

import {
  MatterResponse,
  MatterStatus,
  UpdateMatterRequest,
} from "../types/matter.types";
import { editMatterSchema } from "@/validations";

interface EditMatterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateMatterRequest) => void;
  isSubmitting?: boolean;
  matter: MatterResponse | null;
}

interface EditMatterFormValues {
  title: string;
  description: string;
  assignedPartnerId: string;
  status: MatterStatus;
}

const STATUSES: MatterStatus[] = ["ACTIVE", "DORMANT", "CLOSED"];

export const EditMatterModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  matter,
}: EditMatterModalProps) => {
  const { data: employeesData } = useGetEmployeesQuery();
  const employees = employeesData?.content ?? [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditMatterFormValues>({
    defaultValues: {
      title: "",
      description: "",
      assignedPartnerId: "",
      status: "ACTIVE",
    },
    resolver: yupResolver(editMatterSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (isOpen && matter) {
      reset({
        title: matter.title,
        description: matter.description ?? "",
        assignedPartnerId: matter.assignedPartnerId ?? "",
        status: matter.status,
      });
    }
  }, [isOpen, matter, reset]);

  const onFormSubmit = (values: EditMatterFormValues) => {
    onSubmit({
      title: values.title.trim(),
      description: values.description.trim() || undefined,
      assignedPartnerId: values.assignedPartnerId || undefined,
      status: values.status,
    });
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
    >
      <DialogContent maxW="600px" w="90vw">
        <DialogHeader>
          <DialogTitle>Edit Matter</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <DialogBody>
            <VStack gap={4} align="stretch">
              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Title *
                </Text>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter matter title"
                      borderColor={errors.title ? "red.500" : undefined}
                    />
                  )}
                />
                {errors.title && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {errors.title.message}
                  </Text>
                )}
              </Box>

              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Description
                </Text>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Matter description"
                    />
                  )}
                />
              </Box>

              <Flex gap={4} flexDirection={{ base: "column", md: "row" }}>
                <Box flex={1}>
                  <Text mb={1} fontSize="sm" fontWeight="500">
                    Assigned Partner
                  </Text>
                  <Controller
                    name="assignedPartnerId"
                    control={control}
                    render={({ field }) => (
                      <Box
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        p={2}
                      >
                        <select
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          style={{
                            width: "100%",
                            background: "transparent",
                            outline: "none",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        >
                          <option value="">No partner assigned</option>
                          {employees.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                              {emp.fullName}
                            </option>
                          ))}
                        </select>
                      </Box>
                    )}
                  />
                </Box>
                <Box flex={1}>
                  <Text mb={1} fontSize="sm" fontWeight="500">
                    Status *
                  </Text>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Box
                        border="1px solid"
                        borderColor={errors.status ? "red.500" : "gray.200"}
                        borderRadius="md"
                        p={2}
                      >
                        <select
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          style={{
                            width: "100%",
                            background: "transparent",
                            outline: "none",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0) + status.slice(1).toLowerCase()}
                            </option>
                          ))}
                        </select>
                      </Box>
                    )}
                  />
                  {errors.status && (
                    <Text fontSize="xs" color="red.500" mt={1}>
                      {errors.status.message}
                    </Text>
                  )}
                </Box>
              </Flex>
            </VStack>
          </DialogBody>

          <DialogFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};
