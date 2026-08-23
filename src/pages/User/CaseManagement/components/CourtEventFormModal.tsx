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
import { useEffect } from "react";

import { useGetEmployeesQuery } from "@/api/employeeManagement";

import {
  CourtEvent,
  CourtEventType,
  CreateCourtEventRequest,
} from "../types/matter.types";

interface CourtEventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCourtEventRequest) => void;
  isSubmitting?: boolean;
  initialData?: CourtEvent | null;
  prefilledDate?: string;
}

interface EventFormValues {
  eventType: CourtEventType;
  scheduledDate: string;
  scheduledTime: string;
  endTime: string;
  attendingAdvocateId: string;
  judgeName: string;
  courtRoom: string;
  notes: string;
}

const EVENT_TYPES: CourtEventType[] = ["TARIK", "PESHI"];

export const CourtEventFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  initialData,
  prefilledDate,
}: CourtEventFormModalProps) => {
  const { data: employeesData } = useGetEmployeesQuery();
  const employees = employeesData?.content ?? [];

  const { control, handleSubmit, reset } = useForm<EventFormValues>({
    defaultValues: {
      eventType: "PESHI",
      scheduledDate: prefilledDate ?? "",
      scheduledTime: "",
      endTime: "",
      attendingAdvocateId: "",
      judgeName: "",
      courtRoom: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          eventType: initialData.eventType,
          scheduledDate: initialData.scheduledDate?.slice(0, 10) ?? "",
          scheduledTime: initialData.scheduledTime
            ? initialData.scheduledTime.slice(0, 5)
            : "",
          endTime: initialData.endTime ? initialData.endTime.slice(0, 5) : "",
          attendingAdvocateId: initialData.attendingAdvocateId ?? "",
          judgeName: initialData.judgeName ?? "",
          courtRoom: initialData.courtRoom ?? "",
          notes: initialData.notes ?? "",
        });
      } else {
        reset({
          eventType: "PESHI",
          scheduledDate: prefilledDate ?? "",
          scheduledTime: "",
          endTime: "",
          attendingAdvocateId: "",
          judgeName: "",
          courtRoom: "",
          notes: "",
        });
      }
    }
  }, [isOpen, initialData, prefilledDate, reset]);

  const onFormSubmit = (values: EventFormValues) => {
    if (!values.scheduledDate) return;

    onSubmit({
      eventType: values.eventType,
      scheduledDate: values.scheduledDate,
      scheduledTime: values.scheduledTime
        ? `${values.scheduledTime}:00`
        : undefined,
      endTime: values.endTime ? `${values.endTime}:00` : undefined,
      attendingAdvocateId: values.attendingAdvocateId || undefined,
      judgeName: values.judgeName.trim() || undefined,
      courtRoom: values.courtRoom.trim() || undefined,
      notes: values.notes.trim() || undefined,
    });
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
    >
      <DialogContent maxW="640px" w="90vw">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Court Event" : "Schedule Court Event"}
          </DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <DialogBody>
            <VStack gap={4} align="stretch">
              <Flex gap={4} flexDirection={{ base: "column", md: "row" }}>
                <Box flex={1}>
                  <Text mb={1} fontSize="sm" fontWeight="500">
                    Event Type *
                  </Text>
                  <Controller
                    name="eventType"
                    control={control}
                    rules={{ required: "Event type is required" }}
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
                          {EVENT_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type.charAt(0) + type.slice(1).toLowerCase()}
                            </option>
                          ))}
                        </select>
                      </Box>
                    )}
                  />
                </Box>
                <Box flex={1}>
                  <Text mb={1} fontSize="sm" fontWeight="500">
                    Date *
                  </Text>
                  <Controller
                    name="scheduledDate"
                    control={control}
                    rules={{ required: "Date is required" }}
                    render={({ field }) => <Input type="date" {...field} />}
                  />
                </Box>
              </Flex>

              <Flex gap={4} flexDirection={{ base: "column", md: "row" }}>
                <Box flex={1}>
                  <Text mb={1} fontSize="sm" fontWeight="500">
                    Time
                  </Text>
                  <Controller
                    name="scheduledTime"
                    control={control}
                    render={({ field }) => <Input type="time" {...field} />}
                  />
                </Box>
                <Box flex={1}>
                  <Text mb={1} fontSize="sm" fontWeight="500">
                    End Time
                  </Text>
                  <Controller
                    name="endTime"
                    control={control}
                    render={({ field }) => <Input type="time" {...field} />}
                  />
                </Box>
              </Flex>

              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Attending Advocate
                </Text>
                <Controller
                  name="attendingAdvocateId"
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
                        <option value="">No advocate assigned</option>
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

              <Flex gap={4} flexDirection={{ base: "column", md: "row" }}>
                <Box flex={1}>
                  <Text mb={1} fontSize="sm" fontWeight="500">
                    Judge Name
                  </Text>
                  <Controller
                    name="judgeName"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="e.g. Judge B. Karki" />
                    )}
                  />
                </Box>
                <Box flex={1}>
                  <Text mb={1} fontSize="sm" fontWeight="500">
                    Court Room
                  </Text>
                  <Controller
                    name="courtRoom"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="e.g. Court 3" />
                    )}
                  />
                </Box>
              </Flex>

              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Notes
                </Text>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="e.g. Next date given by the court"
                      rows={3}
                    />
                  )}
                />
              </Box>
            </VStack>
          </DialogBody>

          <DialogFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {initialData ? "Save Changes" : "Schedule Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};
