import {
  Box,
  Button,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

import { AddIcon } from "@/assets/svgs";
import { Datatable } from "@/shared/components";
import { Tooltip } from "@/shared/components/ui";
import { FieldSelect } from "../components/ui";

import { useGetMattersQuery } from "../api/matter.api";
import { MatterFilters as MatterFiltersType, MatterSummary } from "../types/matter.types";
import { formatDate } from "../utils/matterHelpers";
import { MatterStatusBadge, MatterTypeBadge } from "../components/MatterBadges";

const DEFAULT_FILTERS: MatterFiltersType = { page: 0, size: 20 };

const MattersListPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<MatterFiltersType>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState("");

  const { data: mattersData, isLoading } = useGetMattersQuery(filters);

  const updateFilters = (patch: Partial<MatterFiltersType>) => {
    setFilters((prev) => ({ ...prev, ...patch, page: 0 }));
  };

  const applySearch = () => {
    updateFilters({ search: searchInput.trim() || undefined });
  };

  const columns: Array<ColumnDef<MatterSummary>> = useMemo(
    () => [
      {
        accessorKey: "matterNumber",
        header: "Matter Number",
        cell: ({ row }) => (
          <Text fontSize="sm" fontWeight="500" fontFamily="monospace">
            {row.original.matterNumber}
          </Text>
        ),
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <Text fontSize="sm" fontWeight="500" lineClamp={2}>
            {row.original.title}
          </Text>
        ),
      },
      {
        accessorKey: "matterType",
        header: "Type",
        cell: ({ row }) => <MatterTypeBadge type={row.original.matterType} />,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <MatterStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "parties",
        header: "Parties",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.700" lineClamp={1}>
            {(row.original.parties ?? []).join(", ") || "-"}
          </Text>
        ),
      },
      {
        accessorKey: "currentCourt",
        header: "Current Court",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.700">
            {row.original.currentCourt || "-"}
          </Text>
        ),
      },
      {
        accessorKey: "currentStage",
        header: "Stage",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.700">
            {row.original.currentStage
              ? row.original.currentStage.replace(/_/g, " ")
              : "-"}
          </Text>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.700">
            {formatDate(row.original.updatedAt)}
          </Text>
        ),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Tooltip content="Open Matter">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/cases/${row.original.matterNumber}`)}
            >
              <Eye size={16} />
            </Button>
          </Tooltip>
        ),
      },
    ],
    [navigate]
  );

  const hasActiveFilters =
    !!filters.matterType || !!filters.status || !!filters.search;

  return (
    <Stack gap={6} padding={8}>
      <HStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={4}>
        <Stack gap={2}>
          <Text textStyle="heading_4">All Matters</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            Manage matters, court cases and Tarik/Peshi
          </Text>
        </Stack>

        <HStack gap={2}>
          <Button variant="outline" onClick={() => navigate("/case-management")}>
            Dashboard
          </Button>
          <Button variant="primary" onClick={() => navigate("/cases/create")}>
            <AddIcon color="white" />
            New Matter
          </Button>
        </HStack>
      </HStack>

      {/* Filter bar */}
      <HStack gap={3} flexWrap="wrap">
        <Input
          placeholder="Search by matter number, title or party..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") applySearch();
          }}
          w={{ base: "100%", md: "320px" }}
        />
        <Button variant="outline" size="md" onClick={applySearch}>
          Search
        </Button>
        <Box w="160px">
          <FieldSelect
            value={filters.matterType ?? ""}
            onChange={(value) =>
              updateFilters({
                matterType: (value || undefined) as "CIVIL" | "CRIMINAL" | undefined,
              })
            }
            placeholder="All Types"
          >
            <option value="CIVIL">Civil</option>
            <option value="CRIMINAL">Criminal</option>
          </FieldSelect>
        </Box>
        <Box w="160px">
          <FieldSelect
            value={filters.status ?? ""}
            onChange={(value) =>
              updateFilters({
                status: (value || undefined) as "ACTIVE" | "DORMANT" | "CLOSED" | undefined,
              })
            }
            placeholder="All Statuses"
          >
            <option value="ACTIVE">Active</option>
            <option value="DORMANT">Dormant</option>
            <option value="CLOSED">Closed</option>
          </FieldSelect>
        </Box>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="md"
            onClick={() => {
              setFilters(DEFAULT_FILTERS);
              setSearchInput("");
            }}
          >
            Clear
          </Button>
        )}
      </HStack>

      {!isLoading &&
      mattersData?.content &&
      mattersData.content.length === 0 &&
      hasActiveFilters ? (
        <VStack py={12} gap={4}>
          <Text fontSize="lg" fontWeight="500" color="gray.600">
            No matters match your filters
          </Text>
          <Button
            variant="outline"
            onClick={() => {
              setFilters(DEFAULT_FILTERS);
              setSearchInput("");
            }}
          >
            Clear Filters
          </Button>
        </VStack>
      ) : !isLoading && (!mattersData?.content || mattersData.content.length === 0) ? (
        <VStack py={12} gap={4}>
          <Text fontSize="lg" fontWeight="500" color="gray.600">
            No matters created yet
          </Text>
          <Text fontSize="sm" color="gray.500">
            Create your first matter to get started
          </Text>
          <Button variant="primary" onClick={() => navigate("/cases/create")}>
            <AddIcon color="white" />
            Create Matter
          </Button>
        </VStack>
      ) : (
        <Datatable
          isLoading={isLoading}
          columns={columns}
          data={mattersData?.content || []}
          header={{ title: "Matters" }}
          pagination={{
            currentPage: (filters.page ?? 0) + 1,
            pageCount: Math.max(1, mattersData?.totalPages ?? 1),
            pageSize: filters.size ?? 20,
            onPaginationChange: (page) =>
              setFilters((prev) => ({ ...prev, page: page - 1 })),
            setPageSize: (size) =>
              setFilters((prev) => ({ ...prev, size, page: 0 })),
          }}
        />
      )}
    </Stack>
  );
};

export default MattersListPage;
