import { Button, Input, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useExtendFirmTrialMutation } from "@/api/firmSubscription";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/shared/components/ui";
import { TrialSubscription } from "@/shared/types/plan";

import { formatServerDate } from "./trialUtils";

export const ExtendTrialDialog = ({
  open,
  onClose,
  firmId,
  trial,
}: {
  open: boolean;
  onClose: () => void;
  firmId: string;
  trial: TrialSubscription | null;
}) => {
  const [days, setDays] = useState("15");
  const [error, setError] = useState<string | null>(null);

  const { mutate: extendTrial, isPending } = useExtendFirmTrialMutation();

  useEffect(() => {
    if (open) {
      setDays("15");
      setError(null);
    }
  }, [open]);

  const handleSubmit = () => {
    if (isPending) return;
    setError(null);

    const trimmed = days.trim();
    const parsed = Number(trimmed);
    if (trimmed === "" || Number.isNaN(parsed)) {
      setError("Enter the number of days to add.");
      return;
    }
    if (!Number.isInteger(parsed)) {
      setError("Enter a whole number of days.");
      return;
    }
    if (parsed < 1) {
      setError("Additional days must be at least 1.");
      return;
    }

    extendTrial(
      { firmId, payload: { additionalDays: parsed } },
      { onSuccess: onClose }
    );
  };

  const isExpired = trial?.status === "EXPIRED";

  return (
    <DialogRoot
      open={open}
      onOpenChange={() => {
        if (!isPending) onClose();
      }}
      closeOnInteractOutside={false}
      closeOnEscape={!isPending}
    >
      <DialogBackdrop />
      <DialogContent borderRadius="2xl" maxW="lg">
        <DialogCloseTrigger disabled={isPending} />
        <DialogHeader>
          <DialogTitle fontSize="lg">Extend trial</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <Stack gap={4}>
            <Text fontSize="sm" color="gray.600" lineHeight="1.7">
              {isExpired
                ? "This trial has expired. The new days are added from today."
                : `Days are added to the current trial end date (${formatServerDate(
                    trial?.trialEndsAt
                  )}).`}{" "}
              The total trial length accumulates.
            </Text>

            <Stack gap={1.5}>
              <Text fontSize="sm" fontWeight="500" color="system.field.label">
                Additional days
              </Text>
              <Input
                type="number"
                min={1}
                value={days}
                disabled={isPending}
                onChange={(event) => {
                  setDays(event.target.value);
                  setError(null);
                }}
                placeholder="15"
              />
              <Text fontSize="xs" color="gray.500">
                Minimum 1 day.
              </Text>
            </Stack>

            {error && (
              <Text fontSize="xs" color="red.600" role="alert">
                {error}
              </Text>
            )}

            <Text fontSize="xs" color="gray.500">
              The new trial end and grace dates are provided by the backend after
              the update.
            </Text>
          </Stack>
        </DialogBody>

        <DialogFooter gap={3}>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="primary" loading={isPending} onClick={handleSubmit}>
            Extend trial
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
