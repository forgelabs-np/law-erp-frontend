import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";

import { useModulePermissions } from "@/shared/hooks/usePermissions";
import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { toastFail, toastSuccess } from "@/shared/toast";
import {
  ApiRequestEnvelope,
  DEFAULT_DOCUMENT_PAGE,
  DEFAULT_DOCUMENT_PAGE_SIZE,
  DocumentDownloadUrl,
  DocumentListParams,
  DocumentVisibility,
} from "@/shared/types/documents";
import { ApiResponse } from "@/shared/types/response";
import {
  ConfirmUploadRequest,
  FirmDocument,
  FirmDocumentPage,
  InitiateUploadRequest,
  StorageUsage,
  UploadTicket,
} from "../types/firmDocument.types";
import { getBackendErrorMessage } from "@/shared/utils/documents";

// ============================================================
// Query keys — every key is prefixed with "firm-documents" so one targeted
// invalidation refreshes every scope (library / matter / project / storage)
// without touching unrelated queries.
// ============================================================

export const firmDocumentKeys = {
  all: ["firm-documents"] as const,
  library: (params: DocumentListParams) =>
    ["firm-documents", "library", params] as const,
  matter: (matterNumber: string, params: DocumentListParams) =>
    ["firm-documents", "matter", matterNumber, params] as const,
  project: (projectCode: string, params: DocumentListParams) =>
    ["firm-documents", "project", projectCode, params] as const,
  storageUsage: ["firm-documents", "storage-usage"] as const,
};

const EMPTY_PAGE: FirmDocumentPage = {
  content: [],
  page: DEFAULT_DOCUMENT_PAGE,
  size: DEFAULT_DOCUMENT_PAGE_SIZE,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
  empty: true,
};

/**
 * Never assume `data` exists — the backend omits it entirely on failure.
 */
const toDocumentPage = (
  response: { data?: ApiResponse<FirmDocumentPage> } | undefined
): FirmDocumentPage => {
  const payload = response?.data;

  if (!payload?.success || !payload.data) {
    return EMPTY_PAGE;
  }

  return payload.data;
};

// ============================================================
// Reads
// ============================================================

const getLibraryDocuments = (params: DocumentListParams) => {
  return LawFirmCRMClient.get<ApiResponse<FirmDocumentPage>>(
    api.FIRM_DOCUMENTS.LIBRARY,
    { params }
  );
};

/** Entire firm library (already scoped to the caller's accessible matters/projects). */
export const useFirmDocumentsQuery = (
  params: DocumentListParams,
  options?: { enabled?: boolean }
) => {
  const { canView } = useModulePermissions("DOCUMENT_MANAGEMENT");

  return useQuery({
    queryKey: firmDocumentKeys.library(params),
    queryFn: () => getLibraryDocuments(params),
    enabled: canView && (options?.enabled ?? true),
    select: toDocumentPage,
  });
};

const getMatterDocuments = (
  matterNumber: string,
  params: DocumentListParams
) => {
  return LawFirmCRMClient.get<ApiResponse<FirmDocumentPage>>(
    api.FIRM_DOCUMENTS.MATTER_DOCUMENTS.replace("{matterNumber}", matterNumber),
    { params }
  );
};

export const useMatterDocumentsQuery = (
  matterNumber: string,
  params: DocumentListParams,
  options?: { enabled?: boolean }
) => {
  const { canView } = useModulePermissions("DOCUMENT_MANAGEMENT");

  return useQuery({
    queryKey: firmDocumentKeys.matter(matterNumber, params),
    queryFn: () => getMatterDocuments(matterNumber, params),
    enabled: canView && Boolean(matterNumber) && (options?.enabled ?? true),
    select: toDocumentPage,
  });
};

const getProjectDocuments = (
  projectCode: string,
  params: DocumentListParams
) => {
  return LawFirmCRMClient.get<ApiResponse<FirmDocumentPage>>(
    api.FIRM_DOCUMENTS.PROJECT_DOCUMENTS.replace("{projectCode}", projectCode),
    { params }
  );
};

export const useProjectDocumentsQuery = (
  projectCode: string,
  params: DocumentListParams,
  options?: { enabled?: boolean }
) => {
  const { canView } = useModulePermissions("DOCUMENT_MANAGEMENT");

  return useQuery({
    queryKey: firmDocumentKeys.project(projectCode, params),
    queryFn: () => getProjectDocuments(projectCode, params),
    enabled: canView && Boolean(projectCode) && (options?.enabled ?? true),
    select: toDocumentPage,
  });
};

const getStorageUsage = () => {
  return LawFirmCRMClient.get<ApiResponse<StorageUsage>>(
    api.FIRM_DOCUMENTS.STORAGE_USAGE
  );
};

export const useStorageUsageQuery = (options?: { enabled?: boolean }) => {
  const { canView } = useModulePermissions("DOCUMENT_MANAGEMENT");

  return useQuery({
    queryKey: firmDocumentKeys.storageUsage,
    queryFn: getStorageUsage,
    enabled: canView && (options?.enabled ?? true),
    select: (response) => {
      const payload = response?.data;
      return payload?.success ? payload.data : undefined;
    },
  });
};

// ============================================================
// Sensitive one-shot reads (never cached)
//
// Signed URLs are bearer credentials, so these stay plain async calls rather
// than queries/mutations: the caller keeps the value in a local variable and
// drops it immediately after opening the download.
// ============================================================

/** Path parameter is the numeric document `id` (NOT the uuid). */
export const requestFirmDocumentDownloadUrl = (documentId: number) => {
  return LawFirmCRMClient.get<ApiResponse<DocumentDownloadUrl>>(
    api.FIRM_DOCUMENTS.DOWNLOAD_URL.replace(
      "{documentId}",
      documentId.toString()
    )
  );
};

/** Step 1 of the upload flow. */
export const requestUploadTicket = (request: InitiateUploadRequest) => {
  return LawFirmCRMClient.post<ApiResponse<UploadTicket>>(
    api.FIRM_DOCUMENTS.UPLOAD_TICKET,
    { data: request } satisfies ApiRequestEnvelope<InitiateUploadRequest>
  );
};

/** Step 3 of the upload flow — only after the storage POST succeeds. */
export const confirmDocumentUpload = (
  documentId: number,
  request: ConfirmUploadRequest = {}
) => {
  return LawFirmCRMClient.post<ApiResponse<FirmDocument>>(
    api.FIRM_DOCUMENTS.CONFIRM.replace("{documentId}", documentId.toString()),
    { data: request } satisfies ApiRequestEnvelope<ConfirmUploadRequest>
  );
};

// ============================================================
// Targeted invalidation
// ============================================================

/**
 * Refreshes every document list plus storage usage. Used after upload and
 * archive (both of which change the firm's reserved storage) — never a
 * blanket cache reset.
 */
export const invalidateFirmDocuments = (queryClient: QueryClient) => {
  void queryClient.invalidateQueries({ queryKey: firmDocumentKeys.all });
};

/**
 * Refreshes only the document lists. Used for visibility changes, which do
 * not affect storage usage.
 */
export const invalidateDocumentLists = (queryClient: QueryClient) => {
  (["library", "matter", "project"] as const).forEach((scope) => {
    void queryClient.invalidateQueries({
      queryKey: [firmDocumentKeys.all[0], scope],
    });
  });
};

// ============================================================
// Writes
// ============================================================

const updateDocumentVisibility = ({
  documentId,
  visibility,
}: {
  documentId: number;
  visibility: DocumentVisibility;
}) => {
  return LawFirmCRMClient.patch<ApiResponse<unknown>>(
    api.FIRM_DOCUMENTS.VISIBILITY.replace(
      "{documentId}",
      documentId.toString()
    ),
    { data: { visibility } } satisfies ApiRequestEnvelope<{
      visibility: DocumentVisibility;
    }>
  );
};

export const useUpdateDocumentVisibilityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDocumentVisibility,
    onSuccess: (_response, variables) => {
      toastSuccess(
        variables.visibility === "SHARED"
          ? "Document shared with the client."
          : "Document is now private."
      );
      // Visibility does not change reserved storage, so storage usage is not
      // refetched here.
      invalidateDocumentLists(queryClient);
    },
    onError: (error: unknown) => {
      toastFail(
        getBackendErrorMessage(error) ??
        "Failed to change the document visibility."
      );
    },
  });
};

/** `DELETE` is a soft archive — the stored file is retained. */
const archiveDocument = (documentId: number) => {
  return LawFirmCRMClient.delete<ApiResponse<unknown>>(
    api.FIRM_DOCUMENTS.ARCHIVE.replace("{documentId}", documentId.toString())
  );
};

export const useArchiveDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveDocument,
    onSuccess: () => {
      toastSuccess("Document archived.");
      invalidateFirmDocuments(queryClient);
    },
    onError: (error: unknown) => {
      toastFail(
        getBackendErrorMessage(error) ?? "Failed to archive the document."
      );
    },
  });
};
