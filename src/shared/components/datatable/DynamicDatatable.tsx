import { VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { DATA_PER_PAGE } from "@/shared/constants";
import { DynamicDatatableProps } from "@/shared/types";

import { TableHeader } from "./header";
import { Pagination } from "./pagination";
import { Table } from "../ui";

export const DynamicDatatable = <T,>({
  columns,
  header,
  queryKey,
  queryFn,
}: DynamicDatatableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DATA_PER_PAGE);
  const [searchText, setSearchText] = useState("");

  const { data } = useQuery({
    queryKey,
    queryFn,
  });

  const formattedData = Array.isArray(data) ? data : [];

  const pageCount = Math.ceil(formattedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;

  const paginatedData = formattedData.slice(startIndex, startIndex + pageSize);

  return (
    <VStack alignItems="stretch">
      {header?.title && (
        <TableHeader
          {...header}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      )}

      <Table data={paginatedData} columns={columns} />

      <Pagination
        currentPage={currentPage}
        onPaginationChange={(page) => setCurrentPage(page)}
        pageCount={pageCount}
        pageSize={pageSize}
        setPageSize={(pageSize) => {
          setPageSize(pageSize);
          setCurrentPage(1);
        }}
      />
    </VStack>
  );
};
