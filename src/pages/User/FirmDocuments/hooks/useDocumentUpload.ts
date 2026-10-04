import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  invalidateFirmDocuments,
  uploadFirmDocument,
} from "../api/firmDocuments.api";
import { DocumentUploadState } from "../types/firmDocument.types";
import { getBackendErrorMessage } from "@/shared/utils/documents";

export interface StartDocumentUploadInput {
  file: File;
  /** Exactly one of these is supplied by the calling scope. */
  matterNumber?: string;
  projectCode?: string;
  /** Optional, matter documents only. */
  courtCaseRef?: string;
}

const IDLE_STATE: DocumentUploadState = { stage: "idle", progress: 0 };

const resolveUploadError = (error: unknown): string =>
  getBackendErrorMessage(error) ??
  (error instanceof Error && error.message
    ? error.message
    : "Failed to upload the document.");

/**
 * The single upload orchestration used by `/folder`, the Matter Documents tab
 * and the Project Documents tab.
 *
 * Flow: ONE `multipart/form-data` POST to `POST firm/documents`. The bytes go
 * to the API, which stores them and returns the document `ACTIVE` immediately
 * — there is no ticket, no storage POST and no confirm step, and a failure
 * leaves nothing behind (no cleanup, no pending row). "Retry" is therefore
 * simply calling `start` again with the same file.
 *
 * State machine: idle → uploading (progress 0-100) → success | error.
 * Progress 100 while still uploading means the bytes are sent and the server
 * is still validating/storing — the UI renders that window as "Finalizing…".
 *
 * On failure the file stays wherever the caller staged it (component state),
 * so a retry never requires re-picking the file — important for 502s.
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

  /** Resolves `true` when the document was created (`ACTIVE`). */
  const start = useCallback(
    async (input: StartDocumentUploadInput): Promise<boolean> => {
      if (isRunningRef.current) return false;

      // Client-side pre-checks so a bad request never leaves the browser.
      // (The dialog already validates the file itself; these guard the contract.)
      if (Boolean(input.matterNumber) === Boolean(input.projectCode)) {
        setStateIfMounted({
          stage: "error",
          progress: 0,
          errorMessage:
            "Provide either a case (matterNumber) or a project (projectCode) — exactly one",
        });
        return false;
      }

      isRunningRef.current = true;
      setStateIfMounted({ stage: "uploading", progress: 0 });

      try {
        await uploadFirmDocument({
          file: input.file,
          matterNumber: input.matterNumber,
          projectCode: input.projectCode,
          courtCaseRef: input.courtCaseRef,
          onProgress: (percent) =>
            setStateIfMounted({ stage: "uploading", progress: percent }),
        });

        // The response document could be inserted into the cache directly,
        // but invalidating refreshes every scope (library / matter / project)
        // AND storage usage — the upload consumed quota.
        invalidateFirmDocuments(queryClient);
        setStateIfMounted({ stage: "success", progress: 100 });

        return true;
      } catch (error) {
        // Nothing was stored and no row was created, so there is nothing to
        // reconcile — just surface the server's `message` verbatim and let
        // the user retry with the same file.
        setStateIfMounted({
          stage: "error",
          progress: 0,
          errorMessage: resolveUploadError(error),
        });

        return false;
      } finally {
        isRunningRef.current = false;
      }
    },
    [queryClient, setStateIfMounted]
  );

  return {
    ...state,
    // Progress 100 + still uploading = bytes sent, awaiting the response.
    isFinalizing: state.stage === "uploading" && state.progress >= 100,
    isUploading: state.stage === "uploading",
    isSuccess: state.stage === "success",
    start,
    reset,
  };
};
