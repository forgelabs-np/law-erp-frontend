import { Box, Button, HStack, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetMattersQuery } from "@/pages/User/CaseManagement/api/matter.api";
import { useProjectsQuery } from "@/pages/User/ProjectManagement/api/project.api";
import NoDataAvailable from "@/shared/components/NoDataAvailable/NoDataAvailable";
import { ROUTES_CONFIG } from "@/shared/config";
import { useModulePermissions } from "@/shared/hooks/usePermissions";
import {
  DEFAULT_DOCUMENT_PAGE,
  DocumentListParams,
  DocumentRecord,
  DocumentStatus,
  DocumentVisibility,
} from "@/shared/types/documents";
import {
  getBackendErrorMessage,
  groupDocumentsByFolder,
} from "@/shared/utils/documents";

import {
  useFirmDocumentsQuery,
  useStorageUsageQuery,
} from "../api/firmDocuments.api";
import { useDocumentActions } from "../hooks/useDocumentActions";
import { DocumentActionDialogs } from "./DocumentActionDialogs";
import { DocumentFilters } from "./DocumentFilters";
import { DocumentFolderCard } from "./DocumentFolderCard";
import { DocumentFolderCardSkeleton } from "./DocumentFolderCardSkeleton";
import { DocumentFolderKind } from "./DocumentFolderKindBadge";
import { DocumentGrid } from "./DocumentGrid";
import {
  DocumentSelectOption,
  DocumentUploadDialog,
} from "./DocumentUploadDialog";
import { FolderSectionHeader } from "./FolderSectionHeader";
import { StorageUsageCard } from "./StorageUsageCard";

const SEARCH_DEBOUNCE_MS = 300;
/**
 * Documents loaded for folder grouping. The library derives its folders from
 * the documents it actually holds, so the window is deliberately larger than a
 * table page and can be grown on demand — never one request per folder.
 */
const LIBRARY_WINDOW_SIZE = 60;
/** Matters/projects fetched at most once, for folder names + upload targets. */
const FOLDER_OPTION_LIMIT = 100;
const FOLDER_GRID_COLUMNS = { base: 1, md: 2, xl: 3, "2xl": 4 } as const;
const FOLDER_SKELETON_COUNT = 6;

interface ResultSection {
  key: string;
  kind: DocumentFolderKind;
  code: string;
  name?: string;
  documents: DocumentRecord[];
}

/**
 * The document library (`/folder`).
 *
 * Information architecture: Projects and Matters are the first level, and the
 * documents of a folder are opened on their own route. The folders are derived
 * from the paginated document endpoint (the only aggregation the backend
 * exposes) by reading the existing `projectCode` / `matterNumber` fields, so no
 * N+1 request fan-out is needed to build the page.
 *
 * Counts are honest about that window: a folder shows `12 documents` once the
 * whole result set is loaded and `12+ documents` while more may exist, and the
 * library offers an explicit "Load more documents" action instead of silently
 * presenting a truncated library as complete.
 *
 * Searching keeps using the backend `search` parameter and switches to grouped
 * result sections, so matches are never hidden just because they no longer fit
 * the folder structure.
 */
export const DocumentLibraryView = () => {
  const navigate = useNavigate();

  const { canUpload, canShare, canEdit } = useModulePermissions(
    "DOCUMENT_MANAGEMENT"
  );
  // Folder names come from the matter/project modules, so they are only read
  // when the caller may actually view those modules.
  const canReadMatters = useModulePermissions("CASE_MANAGEMENT").canView;
  const canReadProjects = useModulePermissions("PROJECT_MANAGEMENT").canView;

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<DocumentStatus | "">("");
  const [visibility, setVisibility] = useState<DocumentVisibility | "">("");
  const [windowSize, setWindowSize] = useState(LIBRARY_WINDOW_SIZE);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const actions = useDocumentActions();

  // Debounce the search box into the query state.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      // A new result set starts from the first window again.
      setWindowSize(LIBRARY_WINDOW_SIZE);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const params = useMemo<DocumentListParams>(
    () => ({
      page: DEFAULT_DOCUMENT_PAGE,
      size: windowSize,
      status: status || undefined,
      visibility: visibility || undefined,
      search: search || undefined,
    }),
    [windowSize, status, visibility, search]
  );

  const { data, isPending, isError, error, refetch } =
    useFirmDocumentsQuery(params);

  const { data: storageUsage, isPending: isStorageUsagePending } =
    useStorageUsageQuery();

  const documents = useMemo(() => data?.content ?? [], [data]);
  const groups = useMemo(() => groupDocumentsByFolder(documents), [documents]);

  const totalElements = data?.totalElements ?? 0;
  const loadedCount = documents.length;
  const hasMore = totalElements > loadedCount;
  const isSearching = search.length > 0;
  const hasActiveFilters = Boolean(search || status || visibility);

  // Fetched at most once each: needed for folder names, and (while the upload
  // dialog is open) for the destination pickers.
  const { data: mattersPage, isLoading: isLoadingMatters } = useGetMattersQuery(
    { page: 0, size: FOLDER_OPTION_LIMIT },
    { enabled: canReadMatters && (isUploadOpen || groups.matters.length > 0) }
  );
  const { data: projectsPage, isLoading: isLoadingProjects } = useProjectsQuery(
    { page: 0, size: FOLDER_OPTION_LIMIT },
    {
      enabled: canReadProjects && (isUploadOpen || groups.projects.length > 0),
    }
  );

  const matterNameByNumber = useMemo(
    () =>
      new Map(
        (mattersPage?.content ?? []).map((m) => [m.matterNumber, m.title])
      ),
    [mattersPage]
  );
  const projectNameByCode = useMemo(
    () =>
      new Map(
        (projectsPage?.content ?? []).map((project) => [
          project.projectCode,
          project.name,
        ])
      ),
    [projectsPage]
  );

  const matterOptions = useMemo<DocumentSelectOption[]>(
    () =>
      (mattersPage?.content ?? []).map((matter) => ({
        value: matter.matterNumber,
        label: `${matter.matterNumber} • ${matter.title}`,
      })),
    [mattersPage]
  );

  const projectOptions = useMemo<DocumentSelectOption[]>(
    () =>
      (projectsPage?.content ?? []).map((project) => ({
        value: project.projectCode,
        label: `${project.projectCode} • ${project.name}`,
      })),
    [projectsPage]
  );

  const folderName = (kind: DocumentFolderKind, code: string) =>
    kind === "project"
      ? projectNameByCode.get(code)
      : matterNameByNumber.get(code);

  const openFolder = (kind: DocumentFolderKind, code: string) => {
    const path =
      kind === "project"
        ? ROUTES_CONFIG.USER.FOLDER_PROJECT_DOCUMENTS.replace(
            ":projectCode",
            encodeURIComponent(code)
          )
        : ROUTES_CONFIG.USER.FOLDER_MATTER_DOCUMENTS.replace(
            ":matterNumber",
            encodeURIComponent(code)
          );

    navigate(path);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setVisibility("");
    setWindowSize(LIBRARY_WINDOW_SIZE);
  };

  // Documents returned by a search, grouped by the folder they belong to.
  const resultSections = useMemo<ResultSection[]>(() => {
    const sections: ResultSection[] = [];

    groups.projects.forEach((group) =>
      sections.push({
        key: `project:${group.code}`,
        kind: "project",
        code: group.code,
        name: projectNameByCode.get(group.code),
        documents: group.documents,
      })
    );

    groups.matters.forEach((group) =>
      sections.push({
        key: `matter:${group.code}`,
        kind: "matter",
        code: group.code,
        name: matterNameByNumber.get(group.code),
        documents: group.documents,
      })
    );

    if (groups.unfiled.length > 0) {
      sections.push({
        key: "unfiled",
        kind: "matter",
        code: "",
        documents: groups.unfiled,
      });
    }

    return sections;
  }, [groups, matterNameByNumber, projectNameByCode]);

  const uploadAction = canUpload ? (
    <Button
      variant="primary"
      onClick={() => setIsUploadOpen(true)}
      flexShrink={0}
    >
      <Upload size={16} /> Upload Document
    </Button>
  ) : undefined;

  const folderGridProps = {
    canShare,
    canEdit,
    onRequestView: actions.requestView,
    onRequestVisibilityChange: actions.requestVisibilityChange,
    onRequestArchive: actions.requestArchive,
  };

  const renderFolderSection = (
    kind: DocumentFolderKind,
    title: string,
    sectionGroups: typeof groups.projects,
    emptyMessage: string
  ) => (
    <Stack gap={4} key={kind}>
      <HStack justify="space-between" align="center" gap={3}>
        <Text fontSize="md" fontWeight={600} color="gray.800">
          {title}
        </Text>
        {sectionGroups.length > 0 && (
          <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
            {sectionGroups.length}{" "}
            {sectionGroups.length === 1 ? "folder" : "folders"}
          </Text>
        )}
      </HStack>

      {sectionGroups.length === 0 ? (
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          pb={4}
        >
          <NoDataAvailable content={emptyMessage} />
        </Box>
      ) : (
        <SimpleGrid columns={FOLDER_GRID_COLUMNS} gap={5}>
          {sectionGroups.map((group) => (
            <DocumentFolderCard
              key={`${kind}-${group.code}`}
              kind={kind}
              code={group.code}
              name={folderName(kind, group.code)}
              documentCount={group.documents.length}
              countIsPartial={hasMore}
              latestCreatedAt={group.latestCreatedAt}
              onOpen={() => openFolder(kind, group.code)}
            />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );

  const isLoadingFirstPage = isPending && documents.length === 0;
  const isLibraryEmpty = !isError && !isPending && documents.length === 0;

  return (
    <Stack gap={5} minW={0}>
      <StorageUsageCard
        usage={storageUsage}
        isLoading={isStorageUsagePending}
      />

      <DocumentFilters
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        status={status}
        onStatusChange={(value) => {
          setStatus(value);
          setWindowSize(LIBRARY_WINDOW_SIZE);
        }}
        visibility={visibility}
        onVisibilityChange={(value) => {
          setVisibility(value);
          setWindowSize(LIBRARY_WINDOW_SIZE);
        }}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
        actions={uploadAction}
      />

      {isError ? (
        <Box
          p={6}
          bg="red.50"
          border="1px solid"
          borderColor="red.200"
          borderRadius="lg"
          textAlign="center"
        >
          <Text fontSize="sm" color="red.700">
            {getBackendErrorMessage(error) ?? "Failed to load documents."}
          </Text>
          <Button
            variant="outline"
            size="sm"
            mt={4}
            onClick={() => void refetch()}
          >
            Retry
          </Button>
        </Box>
      ) : isLoadingFirstPage ? (
        <Stack gap={8}>
          <SimpleGrid columns={FOLDER_GRID_COLUMNS} gap={5}>
            {Array.from({ length: FOLDER_SKELETON_COUNT }).map((_, index) => (
              <DocumentFolderCardSkeleton key={index} />
            ))}
          </SimpleGrid>
        </Stack>
      ) : isLibraryEmpty ? (
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
                : "No documents yet"
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
            <Stack gap={2} align="center" px={6}>
              <Text fontSize="sm" color="gray.500">
                Your firm&apos;s uploaded documents will appear here.
              </Text>
              {canUpload && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsUploadOpen(true)}
                >
                  <Upload size={16} /> Upload Document
                </Button>
              )}
            </Stack>
          )}
        </Box>
      ) : isSearching ? (
        /* ---------- Search: matching documents, grouped by folder ---------- */
        <Stack gap={8}>
          {resultSections.map((section) => (
            <Stack gap={4} key={section.key}>
              {section.code ? (
                <FolderSectionHeader
                  kind={section.kind}
                  code={section.code}
                  name={section.name}
                  documentCount={section.documents.length}
                  countIsPartial={hasMore}
                  onOpen={() => openFolder(section.kind, section.code)}
                />
              ) : (
                <Text fontSize="sm" fontWeight={600} color="gray.800">
                  Unfiled documents
                </Text>
              )}

              <DocumentGrid
                documents={section.documents}
                {...folderGridProps}
              />
            </Stack>
          ))}
        </Stack>
      ) : (
        /* ---------- Library: Projects and Matters as folders ---------- */
        <Stack gap={8}>
          {renderFolderSection(
            "project",
            "Projects",
            groups.projects,
            "No project documents yet"
          )}
          {renderFolderSection(
            "matter",
            "Matters",
            groups.matters,
            "No matter documents yet"
          )}

          {groups.unfiled.length > 0 && (
            <Stack gap={4}>
              <Text fontSize="md" fontWeight={600} color="gray.800">
                Unfiled documents
              </Text>
              <DocumentGrid documents={groups.unfiled} {...folderGridProps} />
            </Stack>
          )}
        </Stack>
      )}

      {/* Honest window footer: counts are lower bounds until everything loaded */}
      {!isError && totalElements > 0 && (
        <HStack justify="space-between" align="center" gap={3} flexWrap="wrap">
          <Text fontSize="xs" color="gray.500">
            Showing {loadedCount} of {totalElements} document
            {totalElements === 1 ? "" : "s"} — folders are built from the
            documents loaded here.
          </Text>
          {hasMore && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setWindowSize((previous) => previous + LIBRARY_WINDOW_SIZE)
              }
            >
              Load more documents
            </Button>
          )}
        </HStack>
      )}

      <DocumentUploadDialog
        open={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        context={{ kind: "library" }}
        matterOptions={matterOptions}
        projectOptions={projectOptions}
        isOptionsLoading={isLoadingMatters || isLoadingProjects}
      />

      <DocumentActionDialogs actions={actions} />
    </Stack>
  );
};
