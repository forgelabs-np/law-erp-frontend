import { Badge, Box, Button, Grid, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { usePlatformAuditLogsQuery } from "@/api/auditLogs.ts";
import { Datatable } from "@/shared/components";
import { FormProvider, TextFieldInput } from "@/shared/components";
import { ROUTES_CONFIG } from "@/shared/config";

import { AuditFilters, AuditLog, AuditLogData } from "./types";
import {
  ACTION_OPTIONS,
  formatAuditDate,
  getActionBadgeColor,
  truncateSummary,
} from "./utils";

const DEFAULT_PAGE_SIZE = 10;
const defaultFilters: AuditFilters = {
  action: undefined,
  fromDate: undefined,
  toDate: undefined,
  page: 0,
  size: DEFAULT_PAGE_SIZE,
};

const AuditLogs = () => {
  const [filters, setFilters] = useState<AuditFilters>(defaultFilters);
  const methods = useForm({
    defaultValues: {
      action: "",
      fromDate: "",
      toDate: "",
    },
  });

  const { data: auditData, isLoading, error } = usePlatformAuditLogsQuery(filters);

  const handleReset = () => {
    methods.reset();
    setFilters(defaultFilters);
  };

  const handleFilterChange = (field: keyof AuditFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value || undefined,
      page: 0,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page: page - 1 }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, size: pageSize, page: 0 }));
  };

  const columns: Array<ColumnDef<AuditLog>> = useMemo(
    () => [
      {
        accessorKey: "createdAt",
        header: "Timestamp",
        cell: ({ row }) => {
          const { date, time } = formatAuditDate(row.original.createdAt);
          return (
            <VStack align="start" gap="0">
              <Text fontSize="sm" fontWeight="500">
                {date}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {time}
              </Text>
            </VStack>
          );
        },
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => {
          const color = getActionBadgeColor(row.original.action);
          return (
            <Badge
              bg={`${color}.100`}
              color={`${color}.700`}
              px="2"
              py="1"
              borderRadius="md"
              fontSize="xs"
              fontWeight="600"
            >
              {row.original.action}
            </Badge>
          );
        },
      },
      {
        accessorKey: "entityType",
        header: "Entity Type",
        cell: ({ row }) => (
          <Badge
            bg="gray.100"
            color="gray.700"
            px="2"
            py="1"
            borderRadius="md"
            fontSize="xs"
            fontWeight="500"
          >
            {row.original.entityType}
          </Badge>
        ),
      },
      {
        accessorKey: "summary",
        header: "Summary",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.700">
            {truncateSummary(row.original.summary, 60)}
          </Text>
        ),
      },
      {
        accessorKey: "userType",
        header: "User Type",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.700">
            {row.original.userType}
          </Text>
        ),
      },
      {
        accessorKey: "ipAddress",
        header: "IP Address",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.700">
            {row.original.ipAddress || "-"}
          </Text>
        ),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: () => (
          <Button size="xs" variant="ghost" color="gray.500">
            View
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <Stack gap={6} padding={8}>
      {/* Header */}
      <Stack gap={2}>
        <Text textStyle="heading_4">Audit Logs</Text>
        <Text textStyle="paragraph_regular" color="gray.500">
          Track and monitor all system activities
        </Text>
      </Stack>

      {/* Filters */}
      <FormProvider methods={methods} onSubmit={() => {}}>
        <Box
          bg="white"
          p="6"
          borderRadius="lg"
          border="1px"
          borderColor="gray.200"
        >
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
            <TextFieldInput
              name="action"
              label="Action"
              placeholder="Select action"
              onChange={(value) => handleFilterChange("action", value)}
            />
            <TextFieldInput
              name="fromDate"
              type="date"
              label="From Date"
              placeholder="Select from date"
              onChange={(value) => handleFilterChange("fromDate", value)}
            />
            <TextFieldInput
              name="toDate"
              type="date"
              label="To Date"
              placeholder="Select to date"
              onChange={(value) => handleFilterChange("toDate", value)}
            />
          </Grid>
          <HStack justify="flex-end" mt={4}>
            <Button variant="outline" onClick={handleReset}>
              Reset Filters
            </Button>
          </HStack>
        </Box>
      </FormProvider>

      {/* Table */}
      <Datatable
        columns={columns}
        data={auditData?.data?.content ?? []}
        isLoading={isLoading}
        pagination={
          auditData?.data && auditData.data.totalPages > 1
            ? {
                currentPage: filters.page + 1,
                pageCount: auditData.data.totalPages,
                pageSize: filters.size,
                onPaginationChange: handlePageChange,
                setPageSize: handlePageSizeChange,
              }
            : undefined
        }
      />
    </Stack>
  );
};

export default AuditLogs;
