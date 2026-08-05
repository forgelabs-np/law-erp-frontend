import { Box, Button, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Case, useGetCasesQuery } from "../api/case.api";
import { CaseFilters as CaseFiltersType } from "../types/case.types";
import { AddIcon } from "@/assets/svgs";
import { Datatable } from "@/shared/components";
import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";

import { CaseFiltersModal } from "../components/CaseFiltersModal";
import { CaseStageBadge } from "../components/CaseStageBadge";
import { CaseStatusBadge } from "../components/CaseStatusBadge";
import { CaseTypeBadge } from "../components/CaseTypeBadge";

const CaseListPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<CaseFiltersType>({
    page: 0,
    size: 20,
  });
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<string | null>(null);

  const { data: casesData, isLoading } = useGetCasesQuery(filters);

  const handleFilterChange = (newFilters: CaseFiltersType) => {
    setFilters({ ...newFilters, page: 0 }); // Reset to page 0 when filters change
  };

  const handleClearFilters = () => {
    setFilters({ page: 0, size: 20 });
  };

  const handleRowClick = (caseNumber: string) => {
    navigate(`/cases/${caseNumber}`);
  };

  const handleDeleteClick = (caseNumber: string) => {
    setCaseToDelete(caseNumber);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    // TODO: Implement delete mutation
    setDeleteConfirmOpen(false);
    setCaseToDelete(null);
  };

  const columns: Array<ColumnDef<Case>> = useMemo(
    () => [
      {
        accessorKey: "caseNumber",
        header: "Case Number",
        cell: ({ row }) => (
          <Text fontSize="sm" fontWeight="500" fontFamily="monospace">
            {row.original.caseNumber}
          </Text>
        ),
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <Text fontSize="sm" fontWeight="500">
            {row.original.title}
          </Text>
        ),
      },
      {
        accessorKey: "caseType",
        header: "Type",
        cell: ({ row }) => <CaseTypeBadge type={row.original.caseType} />,
      },
      {
        accessorKey: "caseStage",
        header: "Stage",
        cell: ({ row }) => <CaseStageBadge stage={row.original.caseStage} />,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <CaseStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "courtName",
        header: "Court",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.700">
            {row.original.courtName || "-"}
          </Text>
        ),
      },
      {
        accessorKey: "assignedTo",
        header: "Assigned To",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.700">
            {row.original.assignedTo || "-"}
          </Text>
        ),
      },
      {
        accessorKey: "filingDate",
        header: "Filing Date",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.700">
            {row.original.filingDate
              ? new Date(row.original.filingDate).toLocaleDateString()
              : "-"}
          </Text>
        ),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <HStack gap={2}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRowClick(row.original.caseNumber)}
            >
              View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              colorScheme="red"
              onClick={() => handleDeleteClick(row.original.caseNumber)}
            >
              Delete
            </Button>
          </HStack>
        ),
      },
    ],
    []
  );

  const hasNoCases =
    !isLoading && (!casesData?.content || casesData.content.length === 0);
  const hasNoResults =
    !isLoading &&
    casesData?.content &&
    casesData.content.length === 0 &&
    (filters.caseType ||
      filters.caseStage ||
      filters.status ||
      filters.search ||
      filters.courtName);

  return (
    <Stack gap={6} padding={8}>
      <HStack justifyContent="space-between" alignItems="center">
        <Stack gap={2}>
          <Text textStyle="heading_4">Case Management</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            Manage your legal cases and track their progress
          </Text>
        </Stack>

        <HStack gap={2}>
          <Button variant="outline" onClick={() => setFiltersModalOpen(true)}>
            Filters
          </Button>
          <Button variant="primary" onClick={() => navigate("/cases/create")}>
            <AddIcon color="white" />
            New Case
          </Button>
        </HStack>
      </HStack>

      <CaseFiltersModal
        isOpen={filtersModalOpen}
        onClose={() => setFiltersModalOpen(false)}
        filters={filters}
        onFiltersChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {isLoading ? (
        <Stack gap={4}>
          {[...Array(5)].map((_, i) => (
            <Box
              key={i}
              h="60px"
              bg="gray.100"
              borderRadius="md"
              animation="pulse"
            />
          ))}
        </Stack>
      ) : hasNoResults ? (
        <VStack py={12} gap={4}>
          <Text fontSize="lg" fontWeight="500" color="gray.600">
            No cases match your filters
          </Text>
          <Button variant="outline" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </VStack>
      ) : hasNoCases ? (
        <VStack py={12} gap={4}>
          <Text fontSize="lg" fontWeight="500" color="gray.600">
            No cases created yet
          </Text>
          <Text fontSize="sm" color="gray.500">
            Create your first case to get started
          </Text>
          <Button variant="primary" onClick={() => navigate("/cases/create")}>
            <AddIcon color="white" />
            Create Case
          </Button>
        </VStack>
      ) : (
        <Datatable
          isLoading={isLoading}
          columns={columns}
          data={casesData?.content || []}
          header={{
            title: "All Cases",
          }}
        />
      )}

      <ConfirmationDialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setCaseToDelete(null);
        }}
        title="Delete Case?"
        action="delete this case"
        handleSubmit={handleDeleteConfirm}
      />
    </Stack>
  );
};

export default CaseListPage;
