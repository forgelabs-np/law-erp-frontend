import { DocumentListParams, DocumentRecord } from "@/shared/types/documents";

export type { DocumentListParams, DocumentRecord };

/** A firm document row (same shape as the shared model). */
export type FirmDocument = DocumentRecord;

export interface FirmDocumentPage {
  content: FirmDocument[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ============================================================
// Upload (single multipart POST — see `uploadFirmDocument`)
//
// The client-side input shape lives in `@/shared/types/documents` as
// `UploadDocumentParams`. There is no ticket, no storage POST and no
// confirm step: the response IS a full `FirmDocument` (`ACTIVE` immediately).
// ============================================================

// ============================================================
// Storage usage
// ============================================================

export interface StorageUsage {
  usedBytes: number;
  /** `0` means unlimited — never render it as a full quota. */
  quotaBytes: number;
  /** `0` when the firm has unlimited storage. */
  availableBytes: number;
  usedPercent: number;
  unlimited: boolean;
}

// ============================================================
// Upload flow state (shared by the dialog + orchestration hook)
//
// idle → uploading (progress %) → success | error.
// Once progress hits 100 the bytes are merely SENT — the server is still
// validating/storing, so the UI shows "Finalizing…" until the response
// arrives (the hook keeps stage="uploading" at 100 in that window).
// ============================================================

export type DocumentUploadStage =
  | "idle"
  | "uploading"
  | "success"
  | "error";

export interface DocumentUploadState {
  stage: DocumentUploadStage;
  /** Real upload progress, 0-100. 100 + still uploading = finalizing. */
  progress: number;
  errorMessage?: string;
}

export type { DocumentListParams as FirmDocumentListParams };

/** Human readable progress for the dialog. */
export const uploadStageLabel = (
  state: DocumentUploadState
): string | undefined => {
  switch (state.stage) {
    case "uploading":
      // 100% only means the bytes were sent; the server is still working.
      return state.progress >= 100
        ? "Finalizing upload..."
        : "Uploading document...";
    case "success":
      return "Document uploaded successfully.";
    default:
      return undefined;
  }
};
