import { Button, Input, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

import { FirmResponse, useExtendTrialMutation } from "@/api/firmManagement";
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

interface ExtendTrialModalProps {
  open: boolean;
  onClose: () => void;
  firm: FirmResponse | null;
}

export const ExtendTrialModal = ({
  open,
  onClose,
  firm,
}: ExtendTrialModalProps) => {
  const [additionalDays, setAdditionalDays] = useState<number>(15);
  const [error, setError] = useState<string>("");

  const { mutate: extendTrial, isPending } = useExtendTrialMutation();

  const handleSubmit = () => {
    setError("");

    // Validation
    if (!additionalDays || additionalDays <= 0) {
      setError("Please enter a valid number of days (greater than 0)");
      return;
    }

    if (!Number.isInteger(additionalDays)) {
      setError("Please enter a whole number of days");
      return;
    }

    if (!firm) return;

    extendTrial(
      {
        firmId: String(firm.firmId),
        additionalDays,
      },
      {
        onSuccess: () => {
          onClose();
          setAdditionalDays(15);
        },
      }
    );
  };

  const handleClose = () => {
    setAdditionalDays(15);
    setError("");
    onClose();
  };

  return (
    <DialogRoot open={open} onOpenChange={handleClose}>
      <DialogBackdrop />
      <DialogContent borderRadius="2xl" minWidth="450px">
        <DialogCloseTrigger />
        <DialogHeader>
          <DialogTitle>Extend Trial</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Stack gap={4}>
            {firm && (
              <Text fontSize="sm" color="gray.600">
                Firm: <strong>{firm.firmName || firm.name}</strong>
              </Text>
            )}

            <Stack gap={2}>
              <Text fontSize="sm" fontWeight="medium">
                Additional Days
              </Text>
              <Input
                type="number"
                value={additionalDays}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setAdditionalDays(isNaN(val) ? 0 : val);
                  setError("");
                }}
                placeholder="Enter number of days"
                min={1}
                disabled={isPending}
              />
              {error && (
                <Text fontSize="xs" color="red.500">
                  {error}
                </Text>
              )}
            </Stack>

            <Text fontSize="xs" color="gray.500">
              Extend the current trial period by the number of days entered
              above.
            </Text>
          </Stack>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={isPending}>
            Extend Trial
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
