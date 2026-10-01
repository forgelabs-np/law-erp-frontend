import { useQuery } from "@tanstack/react-query";

import { useModulePermissions } from "@/shared/hooks/usePermissions";
import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiResponse } from "@/shared/types/response";

import {
  ClientDocument,
  ClientDocumentListParams,
  ClientDocumentPage,
  DEFAULT_DOCUMENT_PAGE,
  DEFAULT_DOCUMENT_PAGE_SIZE,
  DocumentDownloadUrl,
} from "../types/clientDocument.types";

// ============================================================
// Query keys — every server-side filter is part of the key, so a changing
// search/matter/project/page naturally triggers the matching request.
// ============================================================

export const clientDocumentKeys = {
  all: ["client-documents"] as const,
  list: (params: ClientDocumentListParams) =>
    ["client-documents", params] as const,
};

/** Returned when the response carries no usable page (defensive). */
const EMPTY_PAGE: ClientDocumentPage = {
  content: [],
  page: DEFAULT_DOCUMENT_PAGE,
  size: DEFAULT_DOCUMENT_PAGE_SIZE,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
  empty: true,
};

// ============================================================
// List — GET client/documents (SHARED + ACTIVE, server-paginated)
//
// `status` / `visibility` are intentionally NOT sent: the client endpoint
// is scoped by the backend and ignores them.
// ============================================================

const getClientDocuments = (params: ClientDocumentListParams) => {
  return LawFirmCRMClient.get<ApiResponse<ClientDocumentPage>>(
    api.CLIENT_DOCUMENTS.LIST,
    { params }
  );
};

export const useClientDocumentsQuery = (params: ClientDocumentListParams) => {
  const { canView } = useModulePermissions("DOCUMENT_MANAGEMENT");

  return useQuery({
    queryKey: clientDocumentKeys.list(params),
    queryFn: () => getClientDocuments(params),
    enabled: canView,
    select: (response) => {
      const payload = response?.data;

      // On failure the backend omits `data` entirely — never assume it exists.
      if (!payload?.success || !payload.data) {
        return EMPTY_PAGE;
      }

      return payload.data;
    },
  });
};

// ============================================================
// Download URL — deliberate one-shot action, NOT a query/mutation
//
// The signed URL is a short-lived bearer credential. A query or mutation
// would keep it in the React Query cache, so this stays a plain async call:
// the caller holds the URL in a local variable and drops it immediately
// after opening the download.
//
// The path parameter is the numeric document `id` (NOT the uuid).
// ============================================================

/**
 * The client endpoint only ever returns ACTIVE + SHARED documents, but the
 * download action still checks both so a lifecycle-inconsistent row is never
 * presented as downloadable.
 */
export const isClientDocumentDownloadable = (
  document: Pick<ClientDocument, "status" | "visibility">
): boolean => document.status === "ACTIVE" && document.visibility === "SHARED";

export const requestClientDocumentDownloadUrl = (documentId: number) => {
  return LawFirmCRMClient.get<ApiResponse<DocumentDownloadUrl>>(
    api.CLIENT_DOCUMENTS.DOWNLOAD_URL.replace(
      "{documentId}",
      documentId.toString()
    )
  );
};
