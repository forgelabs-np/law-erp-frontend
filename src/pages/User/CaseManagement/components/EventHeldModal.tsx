import {
  Box,
  Button,
  Input,
  Textarea,
  Flex,
  Text,
  VStack,
  Alert,
} from "@chakra-ui/react";
import { DatePicker } from "@/shared/components/ui";
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
import { Info } from "lucide-react";

import {
  CourtEvent,
  MarkEventHeldRequest,
  NextEventType,
  OutcomeType,
} from "../types/matter.types";
import { nextEventTypeLabel, outcomeTypeLabel } from "../utils/matterHelpers";
import { eventHeldSchema } from "@/validations";

interface EventHeldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MarkEventHeldRequest) => void;
  isSubmitting?: boolean;
  event: CourtEvent | null;
  onRecordJudgment?: () => void;
}

interface HeldFormValues {
  outcome: string;
  outcomeType: OutcomeType;
  nextEventType: NextEventType;
  nextEventDate: string;
  nextEventTime: string;
  notes: string;
}

const OUTCOME_TYPES: OutcomeType[] = [
  "PART_HEARD",
  "ARGUMENTS_COMPLETE",
  "EVIDENCE_TAKEN",
  "ADJOURNED_NO_PROGRESS",
  "ORDER_PASSED",
  "ORDER_ISSUED",
  "STAY_GRANTED",
  "INTERIM_ORDER",
  "JUDGMENT_DELIVERED",
  "WITHDRAWN",
];

const NEXT_EVENT_TYPES: NextEventType[] = [
  "TARIK",
  "PESHI",
  "JUDGMENT",
  "NONE",
];

export const EventHeldModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  event,
  onRecordJudgment,
}: EventHeldModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<HeldFormValues>({
    defaultValues: {
      outcome: "",
      outcomeType: "ADJOURNED_NO_PROGRESS",
      nextEventType: "PESHI",
      nextEventDate: "",
      nextEventTime: "",
      notes: "",
    },
    resolver: yupResolver(eventHeldSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const nextEventType = watch("nextEventType");
  const outcomeType = watch("outcomeType");

  useEffect(() => {
    if (isOpen) {
      reset({
        outcome: "",
        outcomeType: "ADJOURNED_NO_PROGRESS",
        nextEventType: "PESHI",
        nextEventDate: "",
        nextEventTime: "",
        notes: "",
      });
    }
  }, [isOpen, reset]);

  const onFormSubmit = (values: HeldFormValues) => {
    onSubmit({
      outcome: values.outcome.trim(),
      outcomeType: values.outcomeType,
      nextEventType: values.nextEventType,
      nextEventDate:
        values.nextEventType === "TARIK" || values.nextEventType === "PESHI"
          ? values.nextEventDate
          : undefined,
      nextEventTime:
        values.nextEventType === "TARIK" || values.nextEventType === "PESHI"
          ? values.nextEventTime
            ? `${values.nextEventTime}:00`
            : undefined
          : undefined,
      notes: values.notes.trim() || undefined,
    });
  };

  const needsNextDate = nextEventType === "TARIK" || nextEventType === "PESHI";

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
    >
      <DialogContent maxW="640px" w="90vw">
        <DialogHeader>
          <DialogTitle>Mark Event as Held</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <DialogBody>
            <VStack gap={4} align="stretch">
              {event && (
                <Text fontSize="sm" color="gray.500">
                  {event.eventType} on {event.scheduledDate?.slice(0, 10)}
                  {event.courtRoom ? ` · ${event.courtRoom}` : ""}
                </Text>
              )}

              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  What happened? *
                </Text>
                <Controller
                  name="outcome"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="e.g. Both sides heard; court adjourned to next hearing"
                      rows={3}
                      borderColor={errors.outcome ? "red.500" : undefined}
                    />
                  )}
                />
                {errors.outcome && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {errors.outcome.message}
                  </Text>
                )}
              </Box>

              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Outcome Type *
                </Text>
                <Controller
                  name="outcomeType"
                  control={control}
                  render={({ field }) => (
                    <Box
                      border="1px solid"
                      borderColor={errors.outcomeType ? "red.500" : "gray.200"}
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
                        {OUTCOME_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {outcomeTypeLabel(type)}
                          </option>
                        ))}
                      </select>
                    </Box>
                  )}
                />
                {errors.outcomeType && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {errors.outcomeType.message}
                  </Text>
                )}
              </Box>

              {outcomeType === "JUDGMENT_DELIVERED" && (
                <Alert.Root status="info" size="sm">
                  <Alert.Indicator>
                    <Info size={16} />
                  </Alert.Indicator>
                  <Alert.Content>
                    <Alert.Title fontSize="sm">
                      Judgment delivered — record the judgment after saving.
                    </Alert.Title>
                  </Alert.Content>
                </Alert.Root>
              )}

              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  What did the court give next? *
                </Text>
                <Controller
                  name="nextEventType"
                  control={control}
                  render={({ field }) => (
                    <Box
                      border="1px solid"
                      borderColor={
                        errors.nextEventType ? "red.500" : "gray.200"
                      }
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
                        {NEXT_EVENT_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {nextEventTypeLabel(type)}
                          </option>
                        ))}
                      </select>
                    </Box>
                  )}
                />
                {errors.nextEventType && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {errors.nextEventType.message}
                  </Text>
                )}
              </Box>

              {needsNextDate && (
                <Flex gap={4} flexDirection={{ base: "column", md: "row" }}>
                  <Box flex={1}>
                    <Text mb={1} fontSize="sm" fontWeight="500">
                      Next Date *
                    </Text>
                    <Controller
                      name="nextEventDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select next date"
                        />
                      )}
                    />
                    {errors.nextEventDate && (
                      <Text fontSize="xs" color="red.500" mt={1}>
                        {errors.nextEventDate.message}
                      </Text>
                    )}
                  </Box>
                  <Box flex={1}>
                    <Text mb={1} fontSize="sm" fontWeight="500">
                      Next Time
                    </Text>
                    <Controller
                      name="nextEventTime"
                      control={control}
                      render={({ field }) => <Input type="time" {...field} />}
                    />
                  </Box>
                </Flex>
              )}

              {nextEventType === "JUDGMENT" && (
                <Alert.Root status="warning" size="sm">
                  <Alert.Indicator>
                    <Info size={16} />
                  </Alert.Indicator>
                  <Alert.Content>
                    <Alert.Title fontSize="sm">
                      No further event will be scheduled. Record the judgment on
                      the court case.
                    </Alert.Title>
                    {onRecordJudgment && (
                      <Button
                        size="xs"
                        variant="outline"
                        mt={2}
                        onClick={() => {
                          onClose();
                          onRecordJudgment();
                        }}
                      >
                        Record Judgment now
                      </Button>
                    )}
                  </Alert.Content>
                </Alert.Root>
              )}

              {nextEventType === "NONE" && (
                <Alert.Root status="neutral" size="sm">
                  <Alert.Indicator>
                    <Info size={16} />
                  </Alert.Indicator>
                  <Alert.Content>
                    <Alert.Title fontSize="sm">
                      No next event — the case will be treated as completed by
                      the backend.
                    </Alert.Title>
                  </Alert.Content>
                </Alert.Root>
              )}

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
                      placeholder="Additional notes for this hearing"
                      rows={2}
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
            <Button type="submit" loading={isSubmitting} colorScheme="green">
              Mark as Held
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};
