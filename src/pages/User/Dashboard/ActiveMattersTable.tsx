import { Box, HStack, Text } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

import { Datatable } from "@/shared/components/datatable"; // your existing component
import { TablePaginationProps } from "@/shared/types";

export interface ActiveMatter {
  id: string;
  client: string;
  caseType: string;
  stage: string;
  lastUpdate: string;
  nextAction: string;
}

export interface ActiveMattersTableData {
  matters: ActiveMatter[];
  pagination?: TablePaginationProps;
  onRowClick?: (matter: ActiveMatter) => void;
  onViewAll?: () => void;
}

export const ActiveMattersTable = ({
  matters,
  pagination,
  onRowClick,
  onViewAll,
}: ActiveMattersTableData) => {
  const columns = useMemo<ColumnDef<ActiveMatter>[]>(
    () => [
      {
        accessorKey: "client",
        header: "Client",
        cell: ({ getValue }) => (
          <Text fontSize="sm" color="gray.800">
            {getValue<string>()}
          </Text>
        ),
      },
      {
        accessorKey: "caseType",
        header: "Case type",
        cell: ({ getValue }) => (
          <Text fontSize="sm" color="gray.600">
            {getValue<string>()}
          </Text>
        ),
      },
      {
        accessorKey: "stage",
        header: "Stage",
        cell: ({ getValue }) => (
          <Text fontSize="sm" color="gray.600">
            {getValue<string>()}
          </Text>
        ),
      },
      {
        accessorKey: "lastUpdate",
        header: "Last update",
        cell: ({ getValue }) => (
          <Text fontSize="sm" color="gray.600">
            {getValue<string>()}
          </Text>
        ),
      },
      {
        accessorKey: "nextAction",
        header: "Next action",
        cell: ({ row, getValue }) => (
          <HStack
            justifyContent="space-between"
            cursor={onRowClick ? "pointer" : "default"}
            onClick={() => onRowClick?.(row.original)}
          >
            <Text fontSize="sm" color="gray.700">
              {getValue<string>()}
            </Text>
            <Text color="gray.400" fontSize="sm">
              →
            </Text>
          </HStack>
        ),
      },
    ],
    [onRowClick]
  );

  return (
    <Box
      bg="white"
      borderRadius="16px"
      border="1px solid"
      borderColor="gray.200"
      p={5}
    >
      <Text fontWeight={700} fontSize="md" mb={4}>
        Active Matters
      </Text>

      <Datatable
        data={matters}
        columns={columns}
        {...(pagination
          ? { autoPagination: false, pagination }
          : { autoPagination: true })}
      />

      <Text
        mt={4}
        fontSize="sm"
        color="blue.500"
        cursor="pointer"
        _hover={{ textDecoration: "underline" }}
        onClick={onViewAll}
      >
        View all matters →
      </Text>
    </Box>
  );
};
