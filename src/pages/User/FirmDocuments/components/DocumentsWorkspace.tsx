import { Box, Button, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { LayoutGrid, List, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import NoDataAvailable from "@/shared/components/NoDataAvailable/NoDataAvailable";
import { useModulePermissions } from "@/shared/hooks/usePermissions";
import {
  DEFAULT_DOCUMENT_PAGE,
  DEFAULT_DOCUMENT_PAGE_SIZE,
  DocumentListParams,
  DocumentStatus,
  DocumentVisibility,
} from "@/shared/types/documents";
import { getBackendErrorMessage } from "@/shared/utils/documents";

import {
  useMatterDocumentsQuery,
  useProjectDocumentsQuery,
} from "../api/firmDocuments.api";
import { useDocumentActions } from "../hooks/useDocumentActions";
import { DocumentActionDialogs } from "./DocumentActionDialogs";
import { DocumentFilters } from "./DocumentFilters";
import { DocumentGrid } from "./DocumentGrid";
import {
  DocumentSelectOption,
  DocumentUploadDialog,
} from "./DocumentUploadDialog";
import { DocumentsTable } from "./DocumentsTable";
import { FolderDetailHeader } from "./FolderDetailHeader";

const SEARCH_DEBOUNCE_MS = 300;

/**
 * Where a document folder is rendered. The destination is always already
 * known, so the upload dialog never asks the user to choose it again.
 */
export type DocumentsScope =
  | {
      kind: "matter";
      matterNumber: string;
      /** Court cases of this matter; enables the optional court case tag. */
      courtCaseOptions?: DocumentSelectOption[];
    }
  | { kind: "project"; projectCode: string };

type DocumentsView = "grid" | "list";

interface DocumentsWorkspaceProps {
  scope: DocumentsScope;
  /** Copy for the empty state when no filter is active. */
  emptyMessage: string;
  /**
   * Folder identity for the library folder routes. When present the workspace
   * renders the folder header (breadcrumb, name, real total, Upload action) —
   * used by `/folder/projects/:projectCode` and `/folder/matters/:matterNumber`.
   */
  folderMeta?: {
    kind: "project" | "matter";
    code: string;
    name?: string;
    onBack: () => void;
  };
}

/**
 * The documents of one project or matter, reused by:
 * - `/folder/projects/:projectCode` and `/folder/matters/:matterNumber`
 * - the Documents tab of a Matter detail page
 * - the Documents tab of a Project detail page
 *
 * Only the scope differs: which list endpoint is called. Everything else —
 * filters, search, pagination, the upload dialog, the viewer, visibility and
 * archive — is the same implementation, so the three entry points cannot
 * drift. Document cards are the default representation; the existing table
 * stays available through the grid/list switch.
 */
export const DocumentsWorkspace = ({
  scope,
  emptyMessage,
  folderMeta,
}: DocumentsWorkspaceProps) => {
  const { canUpload, canShare, canEdit } = useModulePermissions(
    "DOCUMENT_MANAGEMENT"
  );

  const isMatterScope = scope.kind === "matter";
  const matterNumber = isMatterScope ? scope.matterNumber : "";
  const projectCode = isMatterScope ? "" : scope.projectCode;

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<DocumentStatus | "">("");
  const [visibility, setVisibility] = useState<DocumentVisibility | "">("");
  const [page, setPage] = useState(DEFAULT_DOCUMENT_PAGE);
  const [size, setSize] = useState(DEFAULT_DOCUMENT_PAGE_SIZE);
  const [view, setView] = useState<DocumentsView>("grid");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const actions = useDocumentActions();

  // Debounce the search box into the query state.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(DEFAULT_DOCUMENT_PAGE);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const params = useMemo<DocumentListParams>(
    () => ({
      page,
      size,
      status: status || undefined,
      visibility: visibility || undefined,
      search: search || undefined,
    }),
    [page, size, status, visibility, search]
  );

  // Only the active scope's list request is enabled.
  const matterQuery = useMatterDocumentsQuery(matterNumber, params, {
    enabled: isMatterScope,
  });
  const projectQuery = useProjectDocumentsQuery(projectCode, params, {
    enabled: !isMatterScope,
  });

  const activeQuery = isMatterScope ? matterQuery : projectQuery;

  const documents = activeQuery.data?.content ?? [];
  const totalPages = activeQuery.data?.totalPages ?? 0;
  const totalElements = activeQuery.data?.totalElements ?? 0;
  const hasActiveFilters = Boolean(search || status || visibility);
  // `isPending` covers the gaps between retry attempts (status `pending` but
  // `fetchStatus` `idle`), so a failed/refetching list can never be mistaken
  // for an empty one.
  const isBusy = activeQuery.isPending || activeQuery.isFetching;
  const isEmpty = !activeQuery.isError && !isBusy && documents.length === 0;

  const handleClearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setVisibility("");
    setPage(DEFAULT_DOCUMENT_PAGE);
  };

  const uploadAction = canUpload ? (
    <Button
      variant="primary"
      onClick={() => setIsUploadOpen(true)}
      flexShrink={0}
    >
      <Upload size={16} /> Upload Document
    </Button>
  ) : undefined;

  const viewToggle = (
    <HStack
      gap={0}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      flexShrink={0}
    >
      <IconButton
        aria-label="Grid view"
        aria-pressed={view === "grid"}
        variant={view === "grid" ? "surface" : "ghost"}
        size="sm"
        borderRadius={0}
        onClick={() => setView("grid")}
      >
        <LayoutGrid size={16} />
      </IconButton>
      <IconButton
        aria-label="List view"
        aria-pressed={view === "list"}
        variant={view === "list" ? "surface" : "ghost"}
        size="sm"
        borderRadius={0}
        onClick={() => setView("list")}
      >
        <List size={16} />
      </IconButton>
    </HStack>
  );

  return (
    <Stack gap={5} minW={0}>
      {folderMeta && (
        <FolderDetailHeader
          kind={folderMeta.kind}
          code={folderMeta.code}
          name={folderMeta.name}
          documentCount={totalElements}
          isLoading={activeQuery.isPending}
          onBack={folderMeta.onBack}
          action={uploadAction}
        />
      )}

      <DocumentFilters
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        status={status}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(DEFAULT_DOCUMENT_PAGE);
        }}
        visibility={visibility}
        onVisibilityChange={(value) => {
          setVisibility(value);
          setPage(DEFAULT_DOCUMENT_PAGE);
        }}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
        actions={
          <HStack gap={2} flexShrink={0}>
            {viewToggle}
            {/* Inside a library folder the Upload action lives in the header. */}
            {!folderMeta && uploadAction}
          </HStack>
        }
      />

      {activeQuery.isError ? (
        <Box
          p={6}
          bg="red.50"
          border="1px solid"
          borderColor="red.200"
          borderRadius="lg"
          textAlign="center"
        >
          <Text fontSize="sm" color="red.700">
            {getBackendErrorMessage(activeQuery.error) ??
              "Failed to load documents."}
          </Text>
          <Button
            variant="outline"
            size="sm"
            mt={4}
            onClick={() => void activeQuery.refetch()}
          >
            Retry
          </Button>
        </Box>
      ) : isEmpty ? (
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          py={6}
          textAlign="center"
        >
          <NoDataAvailable
            content={
              hasActiveFilters
                ? "No documents match your current filters"
                : emptyMessage
            }
          />
          {hasActiveFilters ? (
            <Button
              variant="outline"
              size="sm"
              mt={2}
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          ) : (
            canUpload && (
              <Button
                variant="primary"
                size="sm"
                mt={2}
                onClick={() => setIsUploadOpen(true)}
              >
                <Upload size={16} /> Upload Document
              </Button>
            )
          )}
        </Box>
      ) : view === "grid" ? (
        <DocumentGrid
          documents={documents}
          isLoading={isBusy && documents.length === 0}
          canShare={canShare}
          canEdit={canEdit}
          onRequestView={actions.requestView}
          onRequestVisibilityChange={actions.requestVisibilityChange}
          onRequestArchive={actions.requestArchive}
        />
      ) : (
        <DocumentsTable
          documents={documents}
          isLoading={isBusy}
          canShare={canShare}
          canEdit={canEdit}
          onRequestView={actions.requestView}
          onRequestVisibilityChange={actions.requestVisibilityChange}
          onRequestArchive={actions.requestArchive}
          pagination={{
            currentPage: page + 1,
            pageCount: Math.max(1, totalPages),
            pageSize: size,
            onPaginationChange: (nextPage: number) => setPage(nextPage - 1),
            setPageSize: (nextSize: number) => {
              setSize(nextSize);
              setPage(DEFAULT_DOCUMENT_PAGE);
            },
            isFirstPage: page <= 0,
            isLastPage: totalPages <= 0 || page >= totalPages - 1,
          }}
        />
      )}

      {/* Server pagination for the card grid. */}
      {view === "grid" && totalPages > 1 && (
        <HStack justify="space-between" align="center" gap={3}>
          <Text fontSize="xs" color="gray.500">
            Page {page + 1} of {totalPages} — {totalElements} document
            {totalElements === 1 ? "" : "s"}
          </Text>
          <HStack gap={2}>
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 0 || isBusy}
              onClick={() => setPage((current) => Math.max(0, current - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1 || isBusy}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </HStack>
        </HStack>
      )}

      {totalElements > 0 && view === "grid" && totalPages <= 1 && (
        <Text fontSize="xs" color="gray.500">
          {totalElements} document{totalElements === 1 ? "" : "s"}
        </Text>
      )}

      <DocumentUploadDialog
        open={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        context={
          isMatterScope
            ? {
                kind: "matter",
                matterNumber: scope.matterNumber,
                courtCaseOptions: scope.courtCaseOptions,
              }
            : { kind: "project", projectCode: scope.projectCode }
        }
      />

      <DocumentActionDialogs actions={actions} />
    </Stack>
  );
};
