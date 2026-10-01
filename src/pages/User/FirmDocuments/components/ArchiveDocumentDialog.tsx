import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import { Archive } from "lucide-react";

import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from "@/shared/components/ui/Dialog";
import { FirmDocument } from "../types/firmDocument.types";

interface ArchiveDocumentDialogProps {
  document: FirmDocument | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

/**
 * Archive confirmation.
 *
 * The backend `DELETE` is a SOFT archive (the stored file is retained for
 * legal retention), so the copy deliberately never says "delete", and there
 * is no restore flow to offer.
 */
export const ArchiveDocumentDialog = ({
  document,
  open,
  onClose,
  onConfirm,
  isPending,
}: ArchiveDocumentDialogProps) => (
  <DialogRoot
    open={open}
    onOpenChange={(event) => {
      // Never close while the archive request is in flight.
      if (!event.open && !isPending) onClose();
    }}
    closeOnInteractOutside={false}
    role="alertdialog"
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
            bg="orange.50"
            display="grid"
            placeItems="center"
          >
            <Archive size={22} color="#c2410c" />
          </Box>
          <Text
            textStyle="heading_6"
            fontWeight="600"
            color="gray.700"
            textAlign="center"
          >
            Archive document?
          </Text>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Are you sure you want to archive
            {document ? ` "${document.fileName}"` : " this document"}?
          </Text>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Archiving removes this document from active document lists and
            client visibility. The stored file is retained for legal retention.
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
            bg="error.700"
            _hover={{ bg: "error.800" }}
            loading={isPending}
            onClick={onConfirm}
          >
            Archive
          </Button>
        </HStack>
      </DialogFooter>
    </DialogContent>
  </DialogRoot>
);
