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
// Upload
// ============================================================

/**
 * `POST firm/documents/upload-ticket` body.
 * Exactly ONE of `matterNumber` / `projectCode` is required by the backend;
 * `courtCaseRef` is optional and only valid for a matter document.
 */
export interface InitiateUploadRequest {
  matterNumber?: string;
  projectCode?: string;
  courtCaseRef?: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
}

/** Presigned POST policy returned by the upload-ticket endpoint. */
export interface UploadTicket {
  documentId: number;
  fileName: string;
  /** Object-storage URL — POST the file here directly, never via the API. */
  uploadUrl: string;
  /** Every entry must be appended to the FormData exactly as returned. */
  fields: Record<string, string>;
  /** ISO instant; roughly 30 minutes after issue. */
  expiresAt: string;
}

export interface ConfirmUploadRequest {
  etag?: string;
}

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
// ============================================================

export type DocumentUploadStage =
  | "idle"
  | "requesting-ticket"
  | "uploading"
  | "confirming"
  | "success"
  | "error";

export interface DocumentUploadState {
  stage: DocumentUploadStage;
  /** Real browser→storage progress, 0-100. */
  progress: number;
  errorMessage?: string;
}

export type { DocumentListParams as FirmDocumentListParams };

/** Human readable progress for the dialog. */
export const uploadStageLabel = (
  state: DocumentUploadState
): string | undefined => {
  switch (state.stage) {
    case "requesting-ticket":
      return "Preparing upload...";
    case "uploading":
      return "Uploading document...";
    case "confirming":
      return "Finalizing upload...";
    case "success":
      return "Document uploaded successfully.";
    default:
      return undefined;
  }
};
