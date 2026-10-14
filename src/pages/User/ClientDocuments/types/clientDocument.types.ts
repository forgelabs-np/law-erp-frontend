import {
  DocumentDownloadUrl,
  DocumentRecord,
  DocumentStatus,
  DocumentVisibility,
} from "@/shared/types/documents";
import { PaginatedResponse } from "@/shared/types/response";

// ============================================================
// Client portal documents — only the client-specific request/response
// wrappers live here; the document model itself is shared with the firm
// library (`@/shared/types/documents`).
// ============================================================

export type { DocumentDownloadUrl, DocumentStatus, DocumentVisibility };

/** A document row as returned by `GET client/documents`. */
export type ClientDocument = DocumentRecord;

/**
 * Server-side list filters for the client endpoint. The backend already
 * scopes results to the caller's ACTIVE + SHARED documents, so status and
 * visibility are deliberately NOT part of this contract.
 */
export interface ClientDocumentListParams {
  matterNumber?: string;
  projectCode?: string;
  search?: string;
  page: number;
  size: number;
}

export type ClientDocumentPage = PaginatedResponse<ClientDocument>;

export {
  DEFAULT_DOCUMENT_PAGE,
  DEFAULT_DOCUMENT_PAGE_SIZE,
} from "@/shared/types/documents";
