import { VStack } from "@chakra-ui/react";

import { DatatableProps } from "@/shared/types";

import { TableHeader } from "./header";
import { Pagination } from "./pagination";
import { Table } from "../ui";

export const DatatableWithManualPagination = <T,>({
  data,
  columns,
  header,
  pagination,
  isLoading,
  revisionKey,
  columnVisibility,
  onColumnVisibilityChange,
}: DatatableProps<T>) => {
  return (
    <VStack alignItems="stretch" w="100%" maxW="100%" minW={0}>
      {header?.title && <TableHeader {...header} />}

      <Table
        data={data}
        columns={columns}
        isLoading={isLoading}
        revisionKey={revisionKey}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={onColumnVisibilityChange}
      />

      {pagination && <Pagination {...pagination} />}
    </VStack>
  );
};
