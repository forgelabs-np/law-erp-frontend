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
}: DatatableProps<T>) => {
  return (
    <VStack alignItems="stretch">
      {header?.title && <TableHeader {...header} />}

      <Table data={data} columns={columns} />

      {pagination && <Pagination {...pagination} />}
    </VStack>
  );
};
