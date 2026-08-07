import {
  Box,
  Button,
  Input,
  Textarea,
  Flex,
  Text,
  VStack,
  Spinner,
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
import { useEffect } from "react";
import {
  Hearing,
  CreateHearingRequest,
  HearingType,
  HearingStatus,
} from "@/pages/User/CaseManagement/types/hearing.types";
import { useGetCasesQuery } from "@/pages/User/CaseManagement/api/case.api";
import { format } from "date-fns";

interface CalendarHearingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateHearingRequest) => void;
  initialData?: Hearing | null;
  prefilledDate?: string; // Optional - for calendar date click
  onDelete?: (hearingId: string) => void; // Optional - for delete action
}

export const CalendarHearingFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  prefilledDate,
  onDelete,
}: CalendarHearingFormModalProps) => {
  // Fetch cases for dropdown
  const { data: casesData, isLoading: casesLoading } = useGetCasesQuery({
    page: 0,
    size: 100,
  });
  const cases = casesData?.content || [];

  // Format cases for dropdown
  const caseOptions: { value: string; label: string }[] = cases.map((c: any) => ({
    value: c.caseNumber,
    label: `${c.caseNumber} — ${c.title}`,
  }));
  console.log(initialData,"intialData")

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      caseNumber: "",
      title: "",
      date: prefilledDate || format(new Date(), "yyyy-MM-dd"),
      time: "",
      endTime: "",
      courtRoom: "",
      judgeName: "",
      hearingType: "FIRST_HEARING" as HearingType,
      status: "SCHEDULED" as HearingStatus,
      notes: "",
      attendees: "",
    },
  });

  // Reset form when initialData changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          caseNumber: initialData.caseNumber,
          title: initialData.title,
          date: initialData.date,
          time: initialData.time,
          endTime: initialData.endTime,
          courtRoom: initialData.courtRoom,
          judgeName: initialData.judgeName || "",
          hearingType: initialData.hearingType,
          status: initialData.status,
          notes: initialData.notes || "",
          attendees: initialData.attendees || "",
        });
      } else {
        reset({
          caseNumber: "",
          title: "",
          date: prefilledDate || format(new Date(), "yyyy-MM-dd"),
          time: "",
          endTime: "",
          courtRoom: "",
          judgeName: "",
          hearingType: "FIRST_HEARING" as HearingType,
          status: "SCHEDULED" as HearingStatus,
          notes: "",
          attendees: "",
        });
      }
    }
  }, [isOpen, initialData, prefilledDate, reset]);

  const onFormSubmit = (data: any) => {
    // Validate start time < end time
    if (data.time >= data.endTime) {
      alert("End time must be after start time");
      return;
    }

    if (!data.caseNumber) {
      alert("Please select a case");
      return;
    }

    const submitData: CreateHearingRequest = {
      caseNumber: data.caseNumber,
      title: data.title,
      date: data.date,
      time: data.time,
      endTime: data.endTime,
      courtRoom: data.courtRoom,
      judgeName: data.judgeName,
      hearingType: data.hearingType,
      notes: data.notes,
      attendees: data.attendees || "",
    };

    onSubmit(submitData);
    reset();
    onClose();
  };

  const hearingTypes: HearingType[] = [
    "OTHER",
    "STATUS_CONF",
    "FIRST_HEARING",
    "EVIDENCE",
    "PLEA",
    "JUDGMENT",
    "ARGUMENT",
  ];

  const hearingStatuses: HearingStatus[] = [
    "SCHEDULED",
    "COMPLETED",
    "CANCELLED",
    "ADJOURNED",
  ];

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
    >
      <DialogContent maxWidth="600px">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Hearing" : "Schedule Hearing"}
          </DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <DialogBody>
            <VStack gap={4} align="stretch">
              {/* Case Dropdown */}
              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Case *
                </Text>
                {casesLoading ? (
                  <Spinner size="sm" color="blue.500" />
                ) : (
                  <Controller
                    name="caseNumber"
                    control={control}
                    rules={{ required: "Case is required" }}
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
                          }}
                        >
                          <option value="">Select a case</option>
                          {caseOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </Box>
                    )}
                  />
                )}
                {errors.caseNumber && (
                  <Text color="red.500" fontSize="xs" mt={1}>
                    {errors.caseNumber.message as string}
                  </Text>
                )}
              </Box>

              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Hearing Title *
                </Text>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter hearing title" />
                  )}
                />
                {errors.title && (
                  <Text color="red.500" fontSize="xs" mt={1}>
                    {errors.title.message as string}
                  </Text>
                )}
              </Box>

              <Flex gap={4}>
                <Box flex={1}>
                  <Text mb={1} fontSize="sm" fontWeight="500">
                    Date *
                  </Text>
                  <Controller
                    name="date"
                    control={control}
                    rules={{ required: "Date is required" }}
                    render={({ field }) => <Input type="date" {...field} />}
                  />
                  {errors.date && (
                    <Text color="red.500" fontSize="xs" mt={1}>
                      {errors.date.message as string}
                    </Text>
                  )}
                </Box>
                <Box flex={1}>
                  <Text mb={1} fontSize="sm" fontWeight="500">
                    Hearing Type *
                  </Text>
                  <Controller
                    name="hearingType"
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
                          }}
                        >
                          {hearingTypes.map((type) => (
                            <option value={type} key={type}>
                              {type.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                      </Box>
                    )}
                  />
                </Box>
                {/* Status - only show in edit mode */}
                {initialData && (
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
                            }}
                          >
                            {hearingStatuses.map((status) => (
                              <option value={status} key={status}>
                                {status.replace("_", " ")}
                              </option>
                            ))}
                          </select>
                        </Box>
                      )}
                    />
                  </Box>
                )}
              </Flex>

              <Flex gap={4}>
                <Box flex={1}>
                  <Text mb={1} fontSize="sm" fontWeight="500">
                    Start Time *
                  </Text>
                  <Controller
                    name="time"
                    control={control}
                    rules={{ required: "Start time is required" }}
                    render={({ field }) => <Input type="time" {...field} />}
                  />
                  {errors.time && (
                    <Text color="red.500" fontSize="xs" mt={1}>
                      {errors.time.message as string}
                    </Text>
                  )}
                </Box>
                <Box flex={1}>
                  <Text mb={1} fontSize="sm" fontWeight="500">
                    End Time *
                  </Text>
                  <Controller
                    name="endTime"
                    control={control}
                    rules={{ required: "End time is required" }}
                    render={({ field }) => <Input type="time" {...field} />}
                  />
                  {errors.endTime && (
                    <Text color="red.500" fontSize="xs" mt={1}>
                      {errors.endTime.message as string}
                    </Text>
                  )}
                </Box>
              </Flex>

              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Court Room *
                </Text>
                <Controller
                  name="courtRoom"
                  control={control}
                  rules={{ required: "Court room is required" }}
                  render={({ field }) => (
                    <Input {...field} placeholder="e.g., Room 101" />
                  )}
                />
                {errors.courtRoom && (
                  <Text color="red.500" fontSize="xs" mt={1}>
                    {errors.courtRoom.message as string}
                  </Text>
                )}
              </Box>

              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Judge Name
                </Text>
                <Controller
                  name="judgeName"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="e.g., Hon. John Doe" />
                  )}
                />
              </Box>

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
                      placeholder="Additional notes..."
                      rows={3}
                    />
                  )}
                />
              </Box>

              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Attendees
                </Text>
                <Controller
                  name="attendees"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Comma-separated names" />
                  )}
                />
              </Box>
            </VStack>
          </DialogBody>

          <DialogFooter>
            {initialData && onDelete && (
              <Button
                variant="outline"
                colorScheme="red"
                mr="auto"
                onClick={() => onDelete(initialData.id)}
              >
                Cancel Hearing
              </Button>
            )}
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              bg="black"
              color="white"
              _hover={{ bg: "gray.800" }}
              loading={isSubmitting}
            >
              {initialData ? "Save Changes" : "Schedule Hearing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};
