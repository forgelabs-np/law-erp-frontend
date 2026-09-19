import {
  Box,
  Button,
  Grid,
  HStack,
  Input,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Scale, Search, X } from "lucide-react";

import { AddIcon } from "@/assets/svgs";
import { Pagination } from "@/shared/components/datatable/pagination";
import { InputGroup } from "@/shared/components/ui";

import { MatterCard } from "../components/MatterCard";
import { MatterCardSkeleton } from "../components/MatterCardSkeleton";
import { FieldSelect } from "../components/ui";

import { useGetMattersQuery } from "../api/matter.api";
import { useModulePermissions } from "@/shared/hooks/usePermissions";
import { MatterFilters as MatterFiltersType } from "../types/matter.types";

const DEFAULT_FILTERS: MatterFiltersType = { page: 0, size: 20 };

const SKELETON_COUNT = 6;

/** Polished empty state shared by the "no matches" and "no matters" cases. */
const MatterEmptyState = ({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) => (
  <VStack
    gap={3}
    py={{ base: 12, md: 16 }}
    px={6}
    bg="white"
    border="1px dashed"
    borderColor="gray.300"
    borderRadius="xl"
    textAlign="center"
  >
    <Box
      w="12"
      h="12"
      borderRadius="xl"
      bg="primary.50"
      color="primary.500"
      display="grid"
      placeItems="center"
    >
      <FileText size={22} />
    </Box>
    <VStack gap={1}>
      <Text fontSize="lg" fontWeight="600" color="gray.800">
        {title}
      </Text>
      <Text fontSize="sm" color="gray.500" maxW="sm">
        {description}
      </Text>
    </VStack>
    {action}
  </VStack>
);

const MattersListPage = () => {
  const navigate = useNavigate();
  const { canCreate } = useModulePermissions("CASE_MANAGEMENT");
  const [filters, setFilters] = useState<MatterFiltersType>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState("");

  const { data: mattersData, isLoading } = useGetMattersQuery(filters);

  const updateFilters = (patch: Partial<MatterFiltersType>) => {
    setFilters((prev) => ({ ...prev, ...patch, page: 0 }));
  };

  const applySearch = () => {
    updateFilters({ search: searchInput.trim() || undefined });
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput("");
  };

  const matters = mattersData?.content ?? [];
  const totalElements = mattersData?.totalElements ?? matters.length;

  const hasActiveFilters =
    !!filters.matterType || !!filters.status || !!filters.search;

  const isEmpty = !isLoading && matters.length === 0;

  return (
    <Stack gap={6} padding={2} w="100%" maxW="100%" minW={0}>
      {/* ---------------- Page header ---------------- */}
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
            <Scale size={20} />
          </Box>
          <Stack gap={0.5} minW={0}>
            <Text textStyle="heading_4">All Matters</Text>
            <Text textStyle="paragraph_regular" color="gray.500">
              Manage matters, court cases and Tarik/Peshi
            </Text>
          </Stack>
        </HStack>

        <HStack gap={2}>
          <Button
            variant="outline"
            onClick={() => navigate("/case-management")}
          >
            Dashboard
          </Button>
          {canCreate && (
            <Button variant="primary" onClick={() => navigate("/cases/create")}>
              <AddIcon color="white" />
              New Matter
            </Button>
          )}
        </HStack>
      </HStack>

      {/* ---------------- Search / filter toolbar ---------------- */}
      <Box
        bg="gray.50"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="xl"
        p={3}
      >
        <HStack gap={3} flexWrap="wrap" alignItems="center">
          <Box flex="1" minW={{ base: "100%", md: "260px" }}>
            <InputGroup
              startElement={
                <Grid
                  placeItems="center"
                  boxSize="10"
                  color="system.inputGroup.element"
                  css={{ "& > svg": { boxSize: "5" } }}
                >
                  <Search size={16} />
                </Grid>
              }
            >
              <Input
                placeholder="Search by matter number, title or party..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applySearch();
                }}
                paddingLeft="10 !important"
              />
            </InputGroup>
          </Box>

          <Button variant="primary" onClick={applySearch} flexShrink={0}>
            Search
          </Button>

          <Box w={{ base: "100%", sm: "160px" }} flexShrink={0}>
            <FieldSelect
              value={filters.matterType ?? ""}
              onChange={(value) =>
                updateFilters({
                  matterType: (value || undefined) as
                    | "CIVIL"
                    | "CRIMINAL"
                    | undefined,
                })
              }
              placeholder="All Types"
            >
              <option value="CIVIL">Civil</option>
              <option value="CRIMINAL">Criminal</option>
            </FieldSelect>
          </Box>

          <Box w={{ base: "100%", sm: "160px" }} flexShrink={0}>
            <FieldSelect
              value={filters.status ?? ""}
              onChange={(value) =>
                updateFilters({
                  status: (value || undefined) as
                    | "ACTIVE"
                    | "DORMANT"
                    | "CLOSED"
                    | undefined,
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
            <Button variant="ghost" onClick={clearFilters} flexShrink={0}>
              <X size={16} />
              Clear
            </Button>
          )}
        </HStack>
      </Box>

      {/* ---------------- List header ---------------- */}
      <HStack justifyContent="space-between" alignItems="baseline" gap={2}>
        <Text fontSize="lg" fontWeight="600" color="gray.900">
          Matters
        </Text>
        {!isLoading && (
          <Text fontSize="sm" color="gray.500">
            {`Total ${totalElements} ${
              totalElements === 1 ? "matter" : "matters"
            }`}
          </Text>
        )}
      </HStack>

      {/* ---------------- Body ---------------- */}
      {isLoading ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={5}>
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <MatterCardSkeleton key={index} />
          ))}
        </SimpleGrid>
      ) : isEmpty ? (
        hasActiveFilters ? (
          <MatterEmptyState
            title="No matters found"
            description="There are no matters matching your current search or filters."
            action={
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            }
          />
        ) : (
          <MatterEmptyState
            title="No matters created yet"
            description="Create your first matter to get started."
            action={
              canCreate ? (
                <Button
                  variant="primary"
                  onClick={() => navigate("/cases/create")}
                >
                  <AddIcon color="white" />
                  Create Matter
                </Button>
              ) : undefined
            }
          />
        )
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={5}>
          {matters.map((matter) => (
            <MatterCard
              key={matter.id}
              matter={matter}
              onOpen={(matterNumber) => navigate(`/cases/${matterNumber}`)}
            />
          ))}
        </SimpleGrid>
      )}

      {/* ---------------- Pagination ---------------- */}
      {!isEmpty && (
        <Pagination
          currentPage={(filters.page ?? 0) + 1}
          pageCount={Math.max(1, mattersData?.totalPages ?? 1)}
          pageSize={filters.size ?? 20}
          onPaginationChange={(page) =>
            setFilters((prev) => ({ ...prev, page: page - 1 }))
          }
          setPageSize={(size) =>
            setFilters((prev) => ({ ...prev, size, page: 0 }))
          }
        />
      )}
    </Stack>
  );
};

export default MattersListPage;
