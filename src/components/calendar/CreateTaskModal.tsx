import {
  Box,
  Button,
  Input,
  Textarea,
  Select,
  Flex,
  Text,
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
import { useForm, Controller } from "react-hook-form";
import { Task } from "../../types/Task";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Task, "id">) => void;
  initialData?: Task | null;
}

export const CreateTaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: CreateTaskModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      title: "",
      description: "",
      taskType: "Client Meeting",
      priority: "Medium",
      status: "Pending",
      assignedLawyer: "",
      client: "",
      startDate: new Date().toISOString(),
      endDate: new Date(new Date().getTime() + 3600000).toISOString(), // +1 hour
    },
  });

  const onFormSubmit = (data: any) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
    >
      <DialogContent maxWidth="600px">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <DialogBody>
            <Flex direction="column" gap={4}>
              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Task Title *
                </Text>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter task title" />
                  )}
                />
              </Box>

              <Flex gap={4}>
                <Box flex={1}>
                  <Text mb={1} fontSize="sm" fontWeight="500">
                    Type
                  </Text>
                  <Controller
                    name="taskType"
                    control={control}
                    render={({ field }) => (
                      <Box
                        border="1px solid"
                        borderColor="gray.200"
                        _dark={{ borderColor: "gray.600", bg: "gray.700" }}
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
                          }}
                        >
                          <option value="" disabled>
                            Select type
                          </option>
                          {[
                            "Court Hearing",
                            "Client Meeting",
                            "Legal Research",
                            "Filing",
                            "Review",
                            "Internal Task",
                          ].map((t) => (
                            <option value={t} key={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </Box>
                    )}
                  />
                </Box>
                <Box flex={1}>
                  <Text mb={1} fontSize="sm" fontWeight="500">
                    Priority
                  </Text>
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <Box
                        border="1px solid"
                        borderColor="gray.200"
                        _dark={{ borderColor: "gray.600", bg: "gray.700" }}
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
                          }}
                        >
                          <option value="" disabled>
                            Select priority
                          </option>
                          {["Low", "Medium", "High", "Critical"].map((p) => (
                            <option value={p} key={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </Box>
                    )}
                  />
                </Box>
              </Flex>

              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Assigned Lawyer
                </Text>
                <Controller
                  name="assignedLawyer"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="e.g., Harvey Specter" />
                  )}
                />
              </Box>

              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Client
                </Text>
                <Controller
                  name="client"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="e.g., Wayne Enterprises" />
                  )}
                />
              </Box>

              <Flex gap={4}>
                <Box flex={1}>
                  <Text mb={1} fontSize="sm" fontWeight="500">
                    Start Date & Time
                  </Text>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="datetime-local"
                        {...field}
                        value={field.value ? field.value.slice(0, 16) : ""}
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value).toISOString())
                        }
                      />
                    )}
                  />
                </Box>
                <Box flex={1}>
                  <Text mb={1} fontSize="sm" fontWeight="500">
                    End Date & Time
                  </Text>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="datetime-local"
                        {...field}
                        value={field.value ? field.value.slice(0, 16) : ""}
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value).toISOString())
                        }
                      />
                    )}
                  />
                </Box>
              </Flex>

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
                      placeholder="Additional details..."
                      rows={3}
                    />
                  )}
                />
              </Box>
            </Flex>
          </DialogBody>

          <DialogFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              bg="black"
              color="white"
              _hover={{ bg: "gray.800" }}
            >
              {initialData ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};
