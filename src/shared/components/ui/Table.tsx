import { Box, Table as ChakraTable } from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

import { TableProps } from "@/shared/types";

export const TableUI = <T,>({ data, columns }: TableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => (row as { id: string })?.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  return (
    <ChakraTable.Root>
      <ChakraTable.Header>
        {table.getHeaderGroups().map((headerGroup) => (
          <ChakraTable.Row key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <ChakraTable.ColumnHeader key={header.id}>
                  <Box>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </Box>
                </ChakraTable.ColumnHeader>
              );
            })}
          </ChakraTable.Row>
        ))}
      </ChakraTable.Header>

      <ChakraTable.Body>
        {table.getRowModel().rows.map((row) => (
          <ChakraTable.Row key={row.id}>
            {row.getVisibleCells().map((cell) => {
              return (
                <ChakraTable.Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </ChakraTable.Cell>
              );
            })}
          </ChakraTable.Row>
        ))}
      </ChakraTable.Body>
    </ChakraTable.Root>
  );
};

// this prevents unnecessary re-renders
export const Table = React.memo(TableUI, (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.columns) === JSON.stringify(nextProps.columns) &&
    JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data)
  );
}) as <T>(props: TableProps<T>) => ReturnType<typeof TableUI>;
