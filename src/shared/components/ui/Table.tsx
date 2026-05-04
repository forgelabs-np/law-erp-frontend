import { Table as ChakraTable, Skeleton, Stack, Text } from "@chakra-ui/react";
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
    <ChakraTable.Root
      css={{
        "& tbody tr": {
          _odd: { bg: "white" },
          _even: { bg: "gray.100" },
        },
      }}
      borderCollapse={"separate"}
      borderSpacing={0}
    >
      <ChakraTable.Header position={"sticky"} top={"0px"} zIndex={10}>
        {table.getHeaderGroups().map((headerGroup) => (
          <ChakraTable.Row key={headerGroup.id} backgroundColor={"gray.100"}>
            {headerGroup.headers.map((header) => {
              const meta = (header.column.columnDef?.meta as MetaProps) || {};
              return (
                <ChakraTable.ColumnHeader
                  key={header.id}
                  css={{ ...meta }}
                  borderTop={"1px solid"}
                  borderColor={"gray.200"}
                >
                  <Text
                    fontSize={"14px"}
                    fontWeight={700}
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
            <ChakraTable.Row key={row.id}>
              {row.getVisibleCells()?.map((cell) => {
                const meta = (cell.column.columnDef?.meta as MetaProps) || {};
                return (
                  <ChakraTable.Cell
                    key={cell.id}
                    css={{ ...meta }}
                    fontSize={"14px"}
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
  );
};

// this prevents unnecessary re-renders
export const Table = React.memo(TableUI, (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.columns) === JSON.stringify(nextProps.columns) &&
    JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data) &&
    prevProps.isLoading === nextProps.isLoading
  );
}) as <T>(props: TableProps<T>) => ReturnType<typeof TableUI>;
