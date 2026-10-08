import { HStack, IconButton } from "@chakra-ui/react";
import { Archive, Eye, EyeOff, FileSearch } from "lucide-react";

import { DocumentDownloadButton } from "@/shared/components/documents";
import { Tooltip } from "@/shared/components/ui";
import { FirmDocument } from "../types/firmDocument.types";
import { requestFirmDocumentDownloadUrl } from "../api/firmDocuments.api";

interface DocumentRowActionsProps {
  document: FirmDocument;
  /** DOCUMENT_MANAGEMENT:SHARE */
  canShare: boolean;
  /** DOCUMENT_MANAGEMENT:EDIT */
  canEdit: boolean;
  /** Opens the shared DocumentViewer for this row. */
  onRequestView: (document: FirmDocument) => void;
  onRequestVisibilityChange: (document: FirmDocument) => void;
  onRequestArchive: (document: FirmDocument) => void;
}

const actionButtonProps = {
  background: "transparent",
  _focus: { backgroundColor: "transparent" },
  height: "6",
  minWidth: "6",
} as const;

/**
 * Row actions, each gated by the module action it needs:
 * VIEW → View + Download, SHARE → visibility, EDIT → Archive.
 * (The table only renders for users with VIEW, so no extra gate is needed
 * here.)
 *
 * View is deliberately never hidden or disabled: the upload status is a
 * backend lifecycle detail, so the viewer is always reachable and a document
 * that cannot be served reports that itself. Archived documents keep only the
 * download action (the file is retained for legal retention) — there is no
 * restore endpoint to expose.
 */
export const DocumentRowActions = ({
  document,
  canShare,
  canEdit,
  onRequestView,
  onRequestVisibilityChange,
  onRequestArchive,
}: DocumentRowActionsProps) => {
  const isArchived = document.status === "ARCHIVED";
  const isShared = document.visibility === "SHARED";

  return (
    <HStack gap={1} justify="flex-end">
      <Tooltip content="View document">
        <IconButton
          {...actionButtonProps}
          aria-label={`View ${document.fileName}`}
          color="gray.600"
          onClick={() => onRequestView(document)}
        >
          <FileSearch size={16} />
        </IconButton>
      </Tooltip>

      <DocumentDownloadButton
        document={document}
        requestDownloadUrl={requestFirmDocumentDownloadUrl}
        unavailableMessage="This document is still uploading and cannot be downloaded yet"
      />

      {canShare && !isArchived && (
        <Tooltip
          content={isShared ? "Stop sharing with client" : "Share with client"}
        >
          <IconButton
            {...actionButtonProps}
            aria-label={
              isShared
                ? `Stop sharing ${document.fileName} with the client`
                : `Share ${document.fileName} with the client`
            }
            color={isShared ? "blue.500" : "gray.600"}
            onClick={() => onRequestVisibilityChange(document)}
            border={"none!important"}
          >
            {isShared ? <EyeOff size={16} /> : <Eye size={16} />}
          </IconButton>
        </Tooltip>
      )}

      {canEdit && !isArchived && (
        <Tooltip content="Archive document">
          <IconButton
            {...actionButtonProps}
            aria-label={`Archive ${document.fileName}`}
            color="gray.600"
            onClick={() => onRequestArchive(document)}
            border={"none!important"}
          >
            <Archive size={16} />
          </IconButton>
        </Tooltip>
      )}
    </HStack>
  );
};
