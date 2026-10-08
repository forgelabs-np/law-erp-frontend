import { Button, Stack, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";

import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from "@/shared/components/ui/Dialog";

interface CompleteRenewalDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => void;
  isPending: boolean;
}

export const CompleteRenewalDialog = ({
  open,
  onClose,
  onConfirm,
  isPending,
}: CompleteRenewalDialogProps) => {
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    onConfirm(notes.trim() || undefined);
  };

  const handleClose = () => {
    setNotes("");
    onClose();
  };

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => !e.open && handleClose()}
      closeOnInteractOutside={false}
    >
      <DialogBackdrop />
      <DialogContent
        borderRadius="3xl"
        border="4px solid rgba(255, 255, 255, 0.20)"
        boxShadow="0px 0px 48px 0px rgba(0, 0, 0, 0.08)"
        minWidth="500px"
        p={0}
      >
        <DialogCloseTrigger />
        <DialogBody px={8} pt={10} pb={4}>
          <Stack gap={4}>
            <Text
              textStyle="heading_6"
              fontWeight="600"
              color="gray.700"
              textAlign="center"
            >
              Complete Renewal
            </Text>
            <Text
              color="gray.500"
              textStyle="paragraph_large"
              textAlign="center"
            >
              Are you sure you want to mark this renewal instance as completed?
              This action will update the renewal status.
            </Text>
            <Stack gap={2}>
              <Text fontSize="sm" fontWeight="500" color="gray.700">
                Notes (optional)
              </Text>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any completion notes..."
                resize="vertical"
                minHeight="80px"
                maxLength={500}
              />
            </Stack>
          </Stack>
        </DialogBody>
        <DialogFooter
          mt={4}
          px={8}
          pb={8}
          pt={0}
          alignItems="center"
          justifyContent="center"
          gap={4}
        >
          <Button
            onClick={handleConfirm}
            minW="112px"
            textStyle="subtitle_small"
            borderRadius="xl"
            loading={isPending}
            type="button"
            backgroundColor="green.700"
            _hover={{ backgroundColor: "green.800" }}
            disabled={isPending}
          >
            Complete Renewal
          </Button>
          <Button
            variant="surface"
            minW="112px"
            textStyle="subtitle_small"
            h="44px"
            onClick={handleClose}
            borderRadius="xl"
            disabled={isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
