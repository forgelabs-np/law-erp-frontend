import {
  Box,
  Button,
  Input,
  Textarea,
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
import { Checkbox } from "@/shared/components/ui";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";

import { MatterParty, RecordJudgmentRequest } from "../types/matter.types";

interface JudgmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RecordJudgmentRequest) => void;
  isSubmitting?: boolean;
  parties: MatterParty[];
}

interface JudgmentFormValues {
  judgmentDate: string;
  judgmentSummary: string;
  decisionInFavorOfPartyId: string;
  partyIsState: boolean;
}

export const JudgmentModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  parties,
}: JudgmentModalProps) => {
  const { control, handleSubmit, reset } = useForm<JudgmentFormValues>({
    defaultValues: {
      judgmentDate: new Date().toISOString().slice(0, 10),
      judgmentSummary: "",
      decisionInFavorOfPartyId: "",
      partyIsState: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        judgmentDate: new Date().toISOString().slice(0, 10),
        judgmentSummary: "",
        decisionInFavorOfPartyId: "",
        partyIsState: false,
      });
    }
  }, [isOpen, reset]);

  const onFormSubmit = (values: JudgmentFormValues) => {
    if (!values.judgmentSummary.trim()) return;
    onSubmit({
      judgmentDate: values.judgmentDate,
      judgmentSummary: values.judgmentSummary.trim(),
      decisionInFavorOfPartyId:
        values.decisionInFavorOfPartyId || undefined,
      partyIsState: values.partyIsState,
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
          <DialogTitle>Record Judgment</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <DialogBody>
            <VStack gap={4} align="stretch">
              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Judgment Date *
                </Text>
                <Controller
                  name="judgmentDate"
                  control={control}
                  rules={{ required: "Judgment date is required" }}
                  render={({ field }) => <Input type="date" {...field} />}
                />
              </Box>

              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Judgment Summary *
                </Text>
                <Controller
                  name="judgmentSummary"
                  control={control}
                  rules={{ required: "Judgment summary is required" }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="e.g. Boundary fixed in favor of the plaintiff"
                      rows={4}
                    />
                  )}
                />
              </Box>

              <Box>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Decision in favor of
                </Text>
                <Controller
                  name="decisionInFavorOfPartyId"
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
                        <option value="">Select a party</option>
                        {parties.map((party) => (
                          <option key={party.id} value={party.id}>
                            {party.fullName}
                          </option>
                        ))}
                      </select>
                    </Box>
                  )}
                />
              </Box>

              <Controller
                name="partyIsState"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(e) => field.onChange(!!e.checked)}
                  >
                    Decision in favor of the State
                  </Checkbox>
                )}
              />
            </VStack>
          </DialogBody>

          <DialogFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Record Judgment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};
