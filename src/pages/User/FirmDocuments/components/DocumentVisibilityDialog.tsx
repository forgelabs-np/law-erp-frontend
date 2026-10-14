import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import { Eye, EyeOff } from "lucide-react";

import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from "@/shared/components/ui/Dialog";
import { DocumentVisibility } from "@/shared/types/documents";

interface DocumentVisibilityDialogProps {
  fileName?: string;
  /** The visibility the document will be switched TO. */
  nextVisibility: DocumentVisibility | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

/**
 * Confirmation for PRIVATE ↔ SHARED.
 *
 * Sharing is the step that makes a document eligible for the client portal,
 * so the effect is always spelled out before it is applied.
 */
export const DocumentVisibilityDialog = ({
  fileName,
  nextVisibility,
  open,
  onClose,
  onConfirm,
  isPending,
}: DocumentVisibilityDialogProps) => {
  const isSharing = nextVisibility === "SHARED";

  return (
    <DialogRoot
      open={open}
      onOpenChange={(event) => {
        if (!event.open && !isPending) onClose();
      }}
      closeOnInteractOutside={false}
    >
      <DialogBackdrop />
      <DialogContent borderRadius="3xl" maxW="520px">
        <DialogCloseTrigger />
        <DialogBody px={8} pt={10} pb={4}>
          <Stack gap={4} align="center">
            <Box
              w="12"
              h="12"
              borderRadius="full"
              bg={isSharing ? "blue.50" : "gray.100"}
              display="grid"
              placeItems="center"
            >
              {isSharing ? (
                <Eye size={22} color="#1d4ed8" />
              ) : (
                <EyeOff size={22} color="#4b5563" />
              )}
            </Box>
            <Text
              textStyle="heading_6"
              fontWeight="600"
              color="gray.700"
              textAlign="center"
            >
              {isSharing
                ? "Share this document with the client?"
                : "Stop sharing this document?"}
            </Text>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              {fileName ? `"${fileName}" ` : "This document "}
              {isSharing
                ? "will become visible in the client portal for users who have access to this matter or project."
                : "will become internal only and will no longer appear in the client portal."}
            </Text>
          </Stack>
        </DialogBody>
        <DialogFooter px={8} pb={8} pt={2}>
          <HStack gap={4} justify="center" w="100%">
            <Button
              variant="surface"
              minW="112px"
              borderRadius="xl"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              minW="112px"
              borderRadius="xl"
              loading={isPending}
              onClick={onConfirm}
            >
              {isSharing ? "Share" : "Stop sharing"}
            </Button>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
