import { useState } from "react";
import type { AxiosResponse } from "axios";

import { toastFail } from "@/shared/toast";
import { DocumentDownloadUrl, DocumentRecord } from "@/shared/types/documents";
import { ApiResponse } from "@/shared/types/response";
import { getBackendErrorMessage } from "@/shared/utils/documents";

type RequestDownloadUrl = (
  documentId: number
) => Promise<AxiosResponse<ApiResponse<DocumentDownloadUrl>>>;

/**
 * The one download implementation shared by the row button and the document
 * viewer.
 *
 * The signed URL lives in a local variable for the duration of the handler
 * only — it is never logged, cached (React Query or otherwise), persisted or
 * put through state, and concurrent calls are blocked so double clicks cannot
 * fire a second request (each one is audited server-side).
 *
 * The endpoint function is supplied by the owning scope so the firm and
 * client download URLs stay separate.
 */
export const useDocumentDownload = (requestDownloadUrl: RequestDownloadUrl) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const download = async (document: DocumentRecord) => {
    if (isDownloading) return;

    setIsDownloading(true);

    try {
      const response = await requestDownloadUrl(document.id);
      const payload = response?.data;

      if (!payload?.success || !payload.data?.downloadUrl) {
        toastFail(payload?.message ?? "Failed to generate the download link.");
        return;
      }

      // Local variable only: never assigned to state, the query cache,
      // storage, analytics or logs.
      const downloadUrl = payload.data.downloadUrl;

      window.open(downloadUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      toastFail(
        getBackendErrorMessage(error) ?? "Failed to download the document."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return { download, isDownloading };
};
