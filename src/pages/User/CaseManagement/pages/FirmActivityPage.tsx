import {
  Box,
  Button,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";

import { Datatable } from "@/shared/components";
import { ColumnDef } from "@tanstack/react-table";
import { FieldSelect } from "../components/ui";

import { useGetFirmTimelineQuery } from "../api/matter.api";
import {
  FirmTimelineFilters,
  MatterTimelineEvent,
} from "../types/matter.types";
import { formatDateTime } from "../utils/matterHelpers";
import { TimelineEventTypeBadge } from "../components/TimelineEventTypeBadge";

const DEFAULT_FILTERS: FirmTimelineFilters = { page: 0, size: 20 };

const FirmActivityPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FirmTimelineFilters>(DEFAULT_FILTERS);

  const { data: timelineData, isLoading } = useGetFirmTimelineQuery(filters);

  const updateFilters = (patch: Partial<FirmTimelineFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch, page: 0 }));
  };

  const columns: Array<ColumnDef<MatterTimelineEvent>> = useMemo(
    () => [
      {
        accessorKey: "eventType",
        header: "Type",
        cell: ({ row }) => (
          <TimelineEventTypeBadge type={row.original.eventType} />
        ),
      },
      {
        accessorKey: "matterNumber",
        header: "Matter",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            fontFamily="monospace"
            p={0}
            onClick={() => navigate(`/cases/${row.original.matterNumber}`)}
          >
            {row.original.matterNumber}
          </Button>
        ),
      },
      {
        accessorKey: "matterTitle",
        header: "Matter Title",
        cell: ({ row }) => (
          <Text fontSize="sm" fontWeight="500" lineClamp={1}>
            {row.original.matterTitle}
          </Text>
        ),
      },
      {
        accessorKey: "ourCourtCaseRef",
        header: "Court Case",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.700" fontFamily="monospace">
            {row.original.ourCourtCaseRef || "-"}
          </Text>
        ),
      },
      {
        accessorKey: "title",
        header: "Activity",
        cell: ({ row }) => (
          <VStack align="stretch" gap={0}>
            <Text fontSize="sm" fontWeight="600" color="gray.900">
              {row.original.title}
            </Text>
            {row.original.description && (
              <Text fontSize="xs" color="gray.600" lineClamp={2}>
                {row.original.description}
              </Text>
            )}
          </VStack>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Timestamp",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.700">
            {formatDateTime(row.original.createdAt)}
          </Text>
        ),
      },
    ],
    [navigate]
  );

  const hasActiveFilters =
    !!filters.matterType || !!filters.status || !!filters.from || !!filters.to;

  return (
    <Stack gap={6} padding={8}>
      <HStack
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={4}
      >
        <Stack gap={2}>
          <Text textStyle="heading_4">Firm Activity</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            Recent activity across all matters
          </Text>
        </Stack>
      </HStack>

      {/* Filters */}
      <HStack gap={3} flexWrap="wrap">
        <Input
          type="date"
          w="160px"
          value={filters.from ?? ""}
          onChange={(e) => updateFilters({ from: e.target.value || undefined })}
        />
        <Input
          type="date"
          w="160px"
          value={filters.to ?? ""}
          onChange={(e) => updateFilters({ to: e.target.value || undefined })}
        />
        <Box w="150px">
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
        <Box w="150px">
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
          <Button
            variant="ghost"
            size="md"
            onClick={() => setFilters(DEFAULT_FILTERS)}
          >
            Clear
          </Button>
        )}
      </HStack>

      {!isLoading &&
      timelineData?.content &&
      timelineData.content.length === 0 ? (
        <VStack py={12} gap={3}>
          <Activity size={40} color="#9ca3af" />
          <Text fontSize="lg" fontWeight="500" color="gray.600">
            No activity found
          </Text>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={() => setFilters(DEFAULT_FILTERS)}
            >
              Clear Filters
            </Button>
          )}
        </VStack>
      ) : (
        <Datatable
          isLoading={isLoading}
          columns={columns}
          data={timelineData?.content || []}
          header={{ title: "Activity Timeline" }}
          pagination={{
            currentPage: (filters.page ?? 0) + 1,
            pageCount: Math.max(1, timelineData?.totalPages ?? 1),
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

export default FirmActivityPage;
