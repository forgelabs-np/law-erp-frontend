import {
  Box,
  Button,
  Input,
  Textarea,
  Flex,
  Text,
  VStack,
  useBreakpointValue,
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
} from "../types/hearing.types";

interface HearingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateHearingRequest) => void;
  initialData?: Hearing | null;
  caseNumber: string;
}

export const HearingFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  caseNumber,
}: HearingFormModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      caseNumber,
      title: "",
      date: "",
      time: "",
      endTime: "",
      courtRoom: "",
      judgeName: "",
      hearingType: "FIRST_HEARING" as HearingType,
      notes: "",
      attendees: "",
    },
  });

  // Reset form when initialData changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          caseNumber,
          title: initialData.title,
          date: initialData.date,
          time: initialData.time,
          endTime: initialData.endTime,
          courtRoom: initialData.courtRoom,
          judgeName: initialData.judgeName || "",
          hearingType: initialData.hearingType,
          notes: initialData.notes || "",
          attendees: initialData.attendees || "",
        });
      } else {
        reset({
          caseNumber,
          title: "",
          date: "",
          time: "",
          endTime: "",
          courtRoom: "",
          judgeName: "",
          hearingType: "FIRST_HEARING" as HearingType,
          notes: "",
          attendees: "",
        });
      }
    }
  }, [isOpen, initialData, caseNumber, reset]);

  const onFormSubmit = (data: any) => {
    // Validate start time < end time
    // if (data.time >= data.endTime) {
    //   alert("End time must be after start time");
    //   return;
    // }

    const submitData: CreateHearingRequest = {
      caseNumber,
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
    console.log("submitted", data);

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

  const modalHeight = useBreakpointValue({
    base: "100vh",
    md: "90vh",
    lg: "85vh",
  });
  const modalMaxHeight = useBreakpointValue({
    base: "100vh",
    md: "95vh",
    lg: "90vh",
  });

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
    >
       <DialogContent
          maxW="700px"
          w="90vw"
          h={{ base: "100dvh", md: "90vh" }}
          maxH={{ base: "100dvh", md: "90vh" }}
          display="flex"
          flexDirection="column"
          overflow="hidden"
          p={0}
      >
        <DialogHeader
          flexShrink={0}
          px={6}
          py={5}
          borderBottom="1px solid"
          borderColor="gray.200"
          bg="white"
          zIndex={2}
      >
          <DialogTitle>
            {initialData ? "Edit Hearing" : "Schedule Hearing"}
          </DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)}  style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}>
          <DialogBody
              flex="1"
              overflowY="auto"
              overflowX="hidden"
              px={6}
              py={5}
              minH={0}
          >
            <VStack gap={4} align="stretch">
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

          <DialogFooter 
              flexShrink={0}
              px={6}
              py={4}
              bg="white"
              borderTop="1px solid"
              borderColor="gray.200"
              justifyContent="flex-end"
              gap={3}
          >
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
              {initialData ? "Save Changes" : "Schedule Hearing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};
