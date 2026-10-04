// ============================================================
// Document store — shared backend model (firm + client portal)
//
// The firm (`firm/documents`) and client (`client/documents`) endpoints
// return the same document shape, so the model lives here and each scope
// adds only its own request/response wrappers.
// ============================================================

export type DocumentStatus = "ACTIVE" | "ARCHIVED";

export type DocumentVisibility = "PRIVATE" | "SHARED";

/** One document row. Mirrors the backend `DocumentResponse`. */
export interface DocumentRecord {
  id: number;
  uuid: string;
  fileName: string;
  contentType: string;
  extension: string;
  sizeBytes: number;
  status: DocumentStatus;
  visibility: DocumentVisibility;
  matterNumber: string | null;
  projectCode: string | null;
  courtCaseId: string | null;
  uploadedByUserId: string | null;
  /**
   * Presigned download link, populated ONLY for `ACTIVE` documents
   * (`null` otherwise). A bearer credential that expires with the page
   * (~15 min) — never log or persist it. Opening it does NOT write an audit
   * row; the `download-url` endpoint does (call it at click time).
   */
  documentUrl: string | null;
  /**
   * LocalDateTime WITHOUT a timezone offset (e.g. `2026-09-29T06:28:34.377`).
   * Always format as local wall-clock time — never append `Z`.
   */
  createdAt: string;
  archivedAt: string | null;
}

/**
 * Input to the single-call upload function. This is a CLIENT-SIDE shape:
 * the fields travel as `multipart/form-data` parts (not JSON, not enveloped).
 * Exactly one of `matterNumber` / `projectCode` must be supplied.
 */
export interface UploadDocumentParams {
  file: File;
  matterNumber?: string;
  projectCode?: string;
  /** Only valid together with `matterNumber`. */
  courtCaseRef?: string;
  /** Real upload progress 0-100 driven by the HTTP client's upload event. */
  onProgress?: (percent: number) => void;
}

/** Server-side document list filters shared by every firm-side scope. */
export interface DocumentListParams {
  status?: DocumentStatus;
  visibility?: DocumentVisibility;
  search?: string;
  /** 0-based. */
  page: number;
  /** Defaults to 20. */
  size: number;
}

/** `data` payload of every `.../download-url` endpoint. */
export interface DocumentDownloadUrl {
  documentUuid: string;
  /** Short-lived signed URL — a bearer credential. Never log or persist it. */
  downloadUrl: string;
  fileName: string;
  /** Instant (timezone-aware). Used immediately, never displayed. */
  expiresAt: string;
}

export const DEFAULT_DOCUMENT_PAGE = 0;
export const DEFAULT_DOCUMENT_PAGE_SIZE = 20;
/**
 * Every list query sends this unless the user explicitly changes the status
 * filter — an unfiltered list would also return `ARCHIVED` rows.
 */
export const DEFAULT_DOCUMENT_STATUS = "ACTIVE" as const;

/** Request body wrapper used by every write endpoint in this API. */
export interface ApiRequestEnvelope<T> {
  data: T;
}
