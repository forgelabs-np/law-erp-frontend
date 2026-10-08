import { Button } from "@chakra-ui/react";
import { Ban, Download } from "lucide-react";
import type { AxiosResponse } from "axios";

import { Tooltip } from "@/shared/components/ui";
import { DocumentDownloadUrl, DocumentRecord } from "@/shared/types/documents";
import { ApiResponse } from "@/shared/types/response";
import { isDocumentDownloadable } from "@/shared/utils/documents";
import { useDocumentDownload } from "./useDocumentDownload";

export interface DocumentDownloadButtonProps {
  document: DocumentRecord;
  /**
   * Requests a short-lived signed URL for this document. Supplied by the
   * owning scope so the firm and client endpoints stay separate. Deliberately
   * a plain async call (never a query/mutation) so the signed URL can never
   * land in the React Query cache.
   */
  requestDownloadUrl: (
    documentId: number
  ) => Promise<AxiosResponse<ApiResponse<DocumentDownloadUrl>>>;
  /**
   * Scope-specific availability guard. Defaults to the shared rule
   * (`ARCHIVED` documents are not downloadable). The client portal
   * additionally requires ACTIVE + SHARED.
   */
  canDownload?: (document: DocumentRecord) => boolean;
  unavailableMessage?: string;
  size?: "sm" | "md";
}

/**
 * Per-row download action shared by the firm library, the Matter/Project
 * document tabs and the client portal.
 *
 * Loading state is local to the row, so only the clicked document shows a
 * spinner and every other row stays interactive. The button is disabled
 * while in flight so double clicks cannot fire a second request.
 */
export const DocumentDownloadButton = ({
  document,
  requestDownloadUrl,
  canDownload,
  unavailableMessage = "This document is not available for download",
  size = "sm",
}: DocumentDownloadButtonProps) => {
  const { download, isDownloading } = useDocumentDownload(requestDownloadUrl);

  const isAvailable = canDownload
    ? canDownload(document)
    : isDocumentDownloadable(document);

  if (!isAvailable) {
    return (
      <Tooltip content={unavailableMessage}>
        <Button
          variant="ghost"
          size={size}
          disabled
          aria-label="Download unavailable"
        >
          <Ban size={16} />
        </Button>
      </Tooltip>
    );
  }

  const handleDownload = () => {
    void download(document);
  };

  return (
    <Button
      variant="ghost"
      size={size}
      color="primary.500"
      loading={isDownloading}
      disabled={isDownloading}
      onClick={handleDownload}
      aria-label={`Download ${document.fileName}`}
    >
      <Download size={16} />
    </Button>
  );
};
