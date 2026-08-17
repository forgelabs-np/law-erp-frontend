import { Table as ChakraTable, Skeleton, Stack, Text, Box } from "@chakra-ui/react";
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
}: TableProps<T> & { isLoading?: boolean }) => {
  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => (row as { id: string })?.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="12px"
      boxShadow="0 1px 3px rgba(0, 0, 0, 0.05)"
      overflow="hidden"
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
      >
        <ChakraTable.Header position={"sticky"} top={"0px"} zIndex={10}>
          {table.getHeaderGroups().map((headerGroup) => (
            <ChakraTable.Row 
              key={headerGroup.id} 
              backgroundColor={"gray.50"}
              borderBottom="1px solid"
              borderColor="gray.200"
            >
              {headerGroup.headers.map((header) => {
                const meta = (header.column.columnDef?.meta as MetaProps) || {};
                return (
                  <ChakraTable.ColumnHeader
                    key={header.id}
                    css={{ ...meta }}
                    py="3"
                    px="4"
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
                colSpan={table.getHeaderGroups()[0].headers.length}
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
                colSpan={table.getHeaderGroups()[0].headers.length}
                textAlign={"center"}
                borderBottom={0}
              >
                <NoDataAvailable content={"No Data Available"} />
              </ChakraTable.Cell>
            </ChakraTable.Row>
          ) : (
            table.getRowModel().rows?.map((row) => (
              <ChakraTable.Row 
                key={row.id}
                borderBottom="1px solid"
                borderColor="gray.100"
                transition="background-color 0.15s ease"
              >
                {row.getVisibleCells()?.map((cell) => {
                  const meta = (cell.column.columnDef?.meta as MetaProps) || {};
                  return (
                    <ChakraTable.Cell
                      key={cell.id}
                      css={{ ...meta }}
                      fontSize={"14px"}
                      py="4"
                      px="4"
                      verticalAlign="middle"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </ChakraTable.Cell>
                  );
                })}
              </ChakraTable.Row>
            ))
          )}
        </ChakraTable.Body>
      </ChakraTable.Root>
    </Box>
  );
};

// this prevents unnecessary re-renders
export const Table = React.memo(TableUI, (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.columns) === JSON.stringify(nextProps.columns) &&
    JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data) &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.revisionKey === nextProps.revisionKey
  );
}) as <T>(props: TableProps<T>) => ReturnType<typeof TableUI>;
