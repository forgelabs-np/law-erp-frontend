import {
  Table as ChakraTable,
  Skeleton,
  Stack,
  Text,
  Box,
} from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

import { MetaProps, TableProps } from "@/shared/types";

import NoDataAvailable from "../NoDataAvailable/NoDataAvailable";

export const TableUI = <T,>({
  data,
  columns,
  isLoading,
  columnVisibility,
  onColumnVisibilityChange,
}: TableProps<T> & { isLoading?: boolean }) => {
  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => (row as { id: string })?.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange,
  });

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="12px"
      boxShadow="0 1px 3px rgba(0, 0, 0, 0.05)"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      maxH="calc(100vh - 220px)"
      w="100%"
      maxW="100%"
      minW={0}
    >
      <Box
        overflowX="auto"
        overflowY="auto"
        flex="1"
        minHeight={0}
        w="100%"
        maxW="100%"
        minW={0}
      >
        <ChakraTable.Root
          css={{
            "& tbody tr": {
              bg: "white",
              _hover: { bg: "gray.50" },
            },
          }}
          borderCollapse={"separate"}
          borderSpacing={0}
          w="100%"
          minW="100%"
        >
          <ChakraTable.Header>
            {headerGroups.map((headerGroup) => (
              <ChakraTable.Row
                key={headerGroup.id}
                backgroundColor={"gray.50"}
                borderBottom="1px solid"
                borderColor="gray.200"
              >
                {headerGroup.headers.map((header) => {
                  const meta =
                    (header.column.columnDef?.meta as MetaProps) || {};
                  return (
                    <ChakraTable.ColumnHeader
                      key={header.id}
                      position="sticky"
                      top={0}
                      zIndex={1}
                      bg="gray.50"
                      css={{ ...meta }}
                      py="3"
                      px="4"
                      whiteSpace="nowrap"
                    >
                      <Text
                        fontSize={"13px"}
                        fontWeight={600}
                        color={"gray.700"}
                        textTransform={"capitalize"}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </Text>
                    </ChakraTable.ColumnHeader>
                  );
                })}
              </ChakraTable.Row>
            ))}
          </ChakraTable.Header>

          <ChakraTable.Body>
            {isLoading ? (
              <ChakraTable.Row>
                <ChakraTable.Cell
                  colSpan={headerGroups[0].headers.length}
                  textAlign={"center"}
                  borderBottom={0}
                >
                  <Stack width={"full"}>
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                  </Stack>
                </ChakraTable.Cell>
              </ChakraTable.Row>
            ) : data?.length === 0 ? (
              <ChakraTable.Row>
                <ChakraTable.Cell
                  colSpan={headerGroups[0].headers.length}
                  textAlign={"center"}
                  borderBottom={0}
                >
                  <NoDataAvailable content={"No Data Available"} />
                </ChakraTable.Cell>
              </ChakraTable.Row>
            ) : (
              rows.map((row) => (
                <ChakraTable.Row
                  key={row.id}
                  borderBottom="1px solid"
                  borderColor="gray.100"
                  transition="background-color 0.15s ease"
                >
                  {row.getVisibleCells()?.map((cell) => {
                    const meta =
                      (cell.column.columnDef?.meta as MetaProps) || {};
                    return (
                      <ChakraTable.Cell
                        key={cell.id}
                        whiteSpace="nowrap"
                        css={{ ...meta }}
                        fontSize={"14px"}
                        py="4"
                        px="4"
                        verticalAlign="middle"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </ChakraTable.Cell>
                    );
                  })}
                </ChakraTable.Row>
              ))
            )}
          </ChakraTable.Body>
        </ChakraTable.Root>
      </Box>
    </Box>
  );
};

// this prevents unnecessary re-renders
export const Table = React.memo(TableUI, (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.columns) === JSON.stringify(nextProps.columns) &&
    JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data) &&
    JSON.stringify(prevProps.columnVisibility) ===
      JSON.stringify(nextProps.columnVisibility) &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.revisionKey === nextProps.revisionKey
  );
}) as <T>(props: TableProps<T>) => ReturnType<typeof TableUI>;
