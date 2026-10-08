import { Box, Button, IconButton, Stack } from "@chakra-ui/react";
import { Archive, Download, Eye, EyeOff, MoreVertical } from "lucide-react";
import { useState } from "react";

import { useDocumentDownload } from "@/shared/components/documents";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/shared/components/ui";
import { DocumentRecord } from "@/shared/types/documents";

import { requestFirmDocumentDownloadUrl } from "../api/firmDocuments.api";

interface DocumentCardMenuProps {
  document: DocumentRecord;
  /** DOCUMENT_MANAGEMENT:SHARE */
  canShare: boolean;
  /** DOCUMENT_MANAGEMENT:EDIT */
  canEdit: boolean;
  onRequestView: (document: DocumentRecord) => void;
  onRequestVisibilityChange: (document: DocumentRecord) => void;
  onRequestArchive: (document: DocumentRecord) => void;
}

/**
 * Overflow menu (`⋮`) for a document card, using the popover menu pattern
 * already used across the application.
 *
 * Only the actions the caller is permitted to perform are rendered — the
 * permission decision stays with the shared module resolver, never a role
 * name. Archived documents keep view/download only, because archiving is a
 * soft delete with no restore endpoint to offer.
 */
export const DocumentCardMenu = ({
  document,
  canShare,
  canEdit,
  onRequestView,
  onRequestVisibilityChange,
  onRequestArchive,
}: DocumentCardMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { download, isDownloading } = useDocumentDownload(
    requestFirmDocumentDownloadUrl
  );

  const isArchived = document.status === "ARCHIVED";
  const isShared = document.visibility === "SHARED";
  const canManageVisibility = canShare && !isArchived;
  const canArchive = canEdit && !isArchived;

  /** Close first so the dialog never opens underneath the popover. */
  const run = (action: () => void) => {
    setIsOpen(false);
    action();
  };

  return (
    <PopoverRoot
      open={isOpen}
      onOpenChange={(details) => setIsOpen(details.open)}
      positioning={{ placement: "bottom-end" }}
      /* A grid can hold dozens of cards — only the open menu should exist in
         the DOM rather than one hidden dialog per card. */
      lazyMount
      unmountOnExit
    >
      <PopoverTrigger>
        <IconButton
          variant="ghost"
          size="sm"
          color="gray.500"
          aria-label={`More actions for ${document.fileName}`}
        >
          <MoreVertical size={16} />
        </IconButton>
      </PopoverTrigger>

      <PopoverContent width="220px">
        <Stack gap={0} p={1.5}>
          <Button
            variant="ghost"
            size="sm"
            justifyContent="flex-start"
            gap={2}
            color="gray.700"
            _hover={{ bg: "gray.100" }}
            onClick={() => run(() => onRequestView(document))}
          >
            <Eye size={14} /> View document
          </Button>

          <Button
            variant="ghost"
            size="sm"
            justifyContent="flex-start"
            gap={2}
            color="gray.700"
            _hover={{ bg: "gray.100" }}
            loading={isDownloading}
            disabled={isDownloading}
            onClick={() => run(() => void download(document))}
          >
            <Download size={14} /> Download
          </Button>

          {canManageVisibility && (
            <>
              <Box borderTop="1px solid" borderColor="gray.200" mx={2} my={1} />
              <Button
                variant="ghost"
                size="sm"
                justifyContent="flex-start"
                gap={2}
                color="gray.700"
                _hover={{ bg: "gray.100" }}
                onClick={() => run(() => onRequestVisibilityChange(document))}
              >
                {isShared ? <EyeOff size={14} /> : <Eye size={14} />}
                {isShared ? "Stop sharing" : "Change visibility"}
              </Button>
            </>
          )}

          {canArchive && (
            <>
              <Box borderTop="1px solid" borderColor="gray.200" mx={2} my={1} />
              <Button
                variant="ghost"
                size="sm"
                justifyContent="flex-start"
                gap={2}
                color="error.700"
                _hover={{ bg: "gray.100" }}
                onClick={() => run(() => onRequestArchive(document))}
              >
                <Archive size={14} /> Archive
              </Button>
            </>
          )}
        </Stack>
      </PopoverContent>
    </PopoverRoot>
  );
};
