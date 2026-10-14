import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import { FileText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useClientDashboardQuery } from "@/api/dashboard";
import { useClientProjectsQuery } from "@/pages/User/ProjectManagement/api/project.api";
import NoDataAvailable from "@/shared/components/NoDataAvailable/NoDataAvailable";

import { useClientDocumentsQuery } from "../api/clientDocuments.api";
import {
  ClientDocumentsFilters,
  ClientDocumentFilterOption,
} from "../components/ClientDocumentsFilters";
import { ClientDocumentsTable } from "../components/ClientDocumentsTable";
import {
  ClientDocumentListParams,
  DEFAULT_DOCUMENT_PAGE,
  DEFAULT_DOCUMENT_PAGE_SIZE,
} from "../types/clientDocument.types";
import { getBackendErrorMessage } from "@/shared/utils/documents";

/** Search is debounced so typing does not fire a request per keystroke. */
const SEARCH_DEBOUNCE_MS = 300;
const SKELETON_ROWS = 6;

const ClientDocumentsPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [matterNumber, setMatterNumber] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [page, setPage] = useState(DEFAULT_DOCUMENT_PAGE);
  const [size, setSize] = useState(DEFAULT_DOCUMENT_PAGE_SIZE);

  // Debounce the search box into the query state (existing inline pattern).
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(DEFAULT_DOCUMENT_PAGE);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const params = useMemo<ClientDocumentListParams>(
    () => ({
      page,
      size,
      search: search || undefined,
      matterNumber: matterNumber || undefined,
      projectCode: projectCode || undefined,
    }),
    [page, size, search, matterNumber, projectCode]
  );

  const {
    data: documentsPage,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useClientDocumentsQuery(params);

  // Filter option sources are the client's own records: matters from the
  // client dashboard and projects from the client projects endpoint. Both are
  // already scoped to the authenticated client — never firm-wide data.
  const { data: clientDashboard } = useClientDashboardQuery();
  const { data: clientProjectsPage } = useClientProjectsQuery();

  const matterOptions = useMemo<ClientDocumentFilterOption[]>(() => {
    const seen = new Set<string>();

    return (clientDashboard?.myMatters ?? []).reduce<
      ClientDocumentFilterOption[]
    >((options, matter) => {
      if (!matter.matterNumber || seen.has(matter.matterNumber)) {
        return options;
      }

      seen.add(matter.matterNumber);
      options.push({
        value: matter.matterNumber,
        label: matter.matterTitle
          ? `${matter.matterNumber} • ${matter.matterTitle}`
          : matter.matterNumber,
      });

      return options;
    }, []);
  }, [clientDashboard]);

  const projectOptions = useMemo<ClientDocumentFilterOption[]>(() => {
    const seen = new Set<string>();

    return (clientProjectsPage?.content ?? []).reduce<
      ClientDocumentFilterOption[]
    >((options, project) => {
      if (!project.projectCode || seen.has(project.projectCode)) {
        return options;
      }

      seen.add(project.projectCode);
      options.push({
        value: project.projectCode,
        label: `${project.projectCode} • ${project.name}`,
      });

      return options;
    }, []);
  }, [clientProjectsPage]);

  const documents = documentsPage?.content ?? [];
  const totalPages = documentsPage?.totalPages ?? 0;
  const totalElements = documentsPage?.totalElements ?? 0;

  const hasActiveFilters = Boolean(search || matterNumber || projectCode);
  const isEmpty = !isLoading && !isError && documents.length === 0;

  const handleMatterChange = (value: string) => {
    setMatterNumber(value);
    setPage(DEFAULT_DOCUMENT_PAGE);
  };

  const handleProjectChange = (value: string) => {
    setProjectCode(value);
    setPage(DEFAULT_DOCUMENT_PAGE);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearch("");
    setMatterNumber("");
    setProjectCode("");
    setPage(DEFAULT_DOCUMENT_PAGE);
  };

  const handlePageSizeChange = (nextSize: number) => {
    setSize(nextSize);
    setPage(DEFAULT_DOCUMENT_PAGE);
  };

  // ─── Initial load: full page skeleton ───────────────────────────────────
  if (isLoading) {
    return (
      <Stack gap={6} padding={2}>
        <Stack gap={2}>
          <Box h="28px" w="220px" bg="gray.100" borderRadius="md" />
          <Box h="16px" w="360px" bg="gray.100" borderRadius="md" />
        </Stack>
        <Box h="70px" bg="gray.100" borderRadius="xl" />
        <Stack gap={3}>
          {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
            <Box key={index} h="48px" bg="gray.100" borderRadius="md" />
          ))}
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack gap={6} padding={2} w="100%" maxW="100%" minW={0}>
      {/* ==================== HEADER ==================== */}
      <HStack
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={4}
      >
        <HStack gap={3} alignItems="center" minW={0}>
          <Box
            w="10"
            h="10"
            borderRadius="xl"
            bg="primary.50"
            color="primary.500"
            display="grid"
            placeItems="center"
            flexShrink={0}
          >
            <FileText size={20} />
          </Box>
          <Stack gap={0.5} minW={0}>
            <Text textStyle="heading_4">Documents</Text>
            <Text textStyle="paragraph_regular" color="gray.500">
              Documents shared with you from your cases and projects
              {totalElements > 0 ? ` (${totalElements} total)` : ""}
            </Text>
          </Stack>
        </HStack>
      </HStack>

      {/* ==================== FILTERS ==================== */}
      <ClientDocumentsFilters
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        matterNumber={matterNumber}
        onMatterChange={handleMatterChange}
        matterOptions={matterOptions}
        projectCode={projectCode}
        onProjectChange={handleProjectChange}
        projectOptions={projectOptions}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      {/* ==================== BODY ==================== */}
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
      ) : isEmpty ? (
        <Box
          p={6}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          textAlign="center"
        >
          <NoDataAvailable
            content={
              hasActiveFilters
                ? "No documents match your current filters"
                : "No documents have been shared with you yet"
            }
          />
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              mt={2}
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          )}
        </Box>
      ) : (
        <ClientDocumentsTable
          documents={documents}
          // Only a subsequent fetch shows the in-table loading state, so
          // search/filter/page changes keep the layout on screen.
          isLoading={isFetching && !isLoading}
          pagination={{
            currentPage: page + 1,
            pageCount: Math.max(1, totalPages),
            pageSize: size,
            onPaginationChange: (nextPage: number) => setPage(nextPage - 1),
            setPageSize: handlePageSizeChange,
            isFirstPage: page <= 0,
            isLastPage: totalPages <= 0 || page >= totalPages - 1,
          }}
        />
      )}
    </Stack>
  );
};

export default ClientDocumentsPage;
