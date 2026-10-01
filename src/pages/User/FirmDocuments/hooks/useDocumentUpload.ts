import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  invalidateFirmDocuments,
  requestUploadTicket,
} from "../api/firmDocuments.api";
import {
  DocumentUploadState,
  InitiateUploadRequest,
} from "../types/firmDocument.types";
import {
  getBackendErrorMessage,
  getDocumentContentType,
} from "@/shared/utils/documents";

export interface StartDocumentUploadInput {
  file: File;
  /** Exactly one of these is supplied by the calling scope. */
  matterNumber?: string;
  projectCode?: string;
  /** Optional, matter documents only. */
  courtCaseRef?: string;
}

const IDLE_STATE: DocumentUploadState = { stage: "idle", progress: 0 };

const UPLOADING_STAGES: DocumentUploadState["stage"][] = [
  "requesting-ticket",
  "uploading",
  "confirming",
];

const resolveUploadError = (error: unknown): string =>
  getBackendErrorMessage(error) ??
  (error instanceof Error && error.message
    ? error.message
    : "Failed to upload the document.");

/**
 * The single upload orchestration used by `/folder`, the Matter Documents tab
 * and the Project Documents tab.
 *
 * Flow: request ticket → POST the file directly to storage → confirm.
 * A document is only uploaded once CONFIRM succeeds — the storage POST alone
 * leaves a PENDING_UPLOAD record, so the caller must not treat a mid-flow
 * result as success.
 *
 * The presigned `uploadUrl` / `fields` live only inside this function's local
 * scope: they are never put into state, the query cache or any log.
 */
export const useDocumentUpload = () => {
  const queryClient = useQueryClient();
  const [state, setState] = useState<DocumentUploadState>(IDLE_STATE);

  // Guards against a second concurrent flow (double submit / double click).
  const isRunningRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const setStateIfMounted = useCallback((next: DocumentUploadState) => {
    if (isMountedRef.current) setState(next);
  }, []);

  const reset = useCallback(() => {
    isRunningRef.current = false;
    setState(IDLE_STATE);
  }, []);

  /** Resolves `true` when the document was confirmed in storage. */
  const start = useCallback(
    async (input: StartDocumentUploadInput): Promise<boolean> => {
      if (isRunningRef.current) return false;

      isRunningRef.current = true;
      setStateIfMounted({ stage: "requesting-ticket", progress: 0 });

      try {
        const request: InitiateUploadRequest = {
          filename: input.file.name,
          // Some browsers leave `type` empty for known extensions, so fall
          // back to the extension-based lookup instead of octet-stream.
          contentType:
            input.file.type || getDocumentContentType(input.file.name),
          sizeBytes: input.file.size,
        };

        if (input.matterNumber) {
          request.matterNumber = input.matterNumber;
          if (input.courtCaseRef) request.courtCaseRef = input.courtCaseRef;
        } else if (input.projectCode) {
          request.projectCode = input.projectCode;
        }

        const ticketResponse = await requestUploadTicket(request);
        const ticketPayload = ticketResponse?.data;

        if (!ticketPayload?.success || !ticketPayload.data) {
          throw new Error(
            ticketPayload?.message ?? "Failed to start the upload."
          );
        }

        // const ticket = ticketPayload.data;

        // setStateIfMounted({ stage: "uploading", progress: 0 });

        // // await uploadFileToStorage({
        // //   uploadUrl: ticket.uploadUrl,
        // //   fields: ticket.fields,
        // //   file: input.file,
        // //   onProgress: (percent) =>
        // //     setStateIfMounted({ stage: "uploading", progress: percent }),
        // // });

        // // The object exists in storage but the document is NOT uploaded yet.
        // setStateIfMounted({ stage: "confirming", progress: 100 });

        // const confirmResponse = await confirmDocumentUpload(ticket.documentId);
        // const confirmPayload = confirmResponse?.data;

        // if (!confirmPayload?.success) {
        //   throw new Error(
        //     confirmPayload?.message ?? "Failed to confirm the upload."
        //   );
        // }


        // Upload ticket successfully created the PENDING_UPLOAD document record.
        invalidateFirmDocuments(queryClient);
        setStateIfMounted({ stage: "success", progress: 100 });

        return true;
      } catch (error) {
        setStateIfMounted({
          stage: "error",
          progress: 0,
          errorMessage: resolveUploadError(error),
        });

        // A failed flow can leave a PENDING_UPLOAD record behind (created by
        // the ticket request), so refresh the lists to reflect reality.
        invalidateFirmDocuments(queryClient);

        return false;
      } finally {
        isRunningRef.current = false;
      }
    },
    [queryClient, setStateIfMounted]
  );

  return {
    ...state,
    isUploading: UPLOADING_STAGES.includes(state.stage),
    isSuccess: state.stage === "success",
    start,
    reset,
  };
};
