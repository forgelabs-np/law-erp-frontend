import { Box } from "@chakra-ui/react";
import { useState } from "react";

import { DATA_PER_PAGE } from "@/shared/constants/table";
import { DatatableProps } from "@/shared/types";
import { TableToolbar } from "./TableToolbar";
import { Pagination } from "./pagination";
import { TableUI } from "../ui/Table";

export const DatatableWithAutoPagination = <T,>({
  data,
  columns,
  header,
  revisionKey,
  isLoading,
  columnVisibility,
  onColumnVisibilityChange,
  toolbar,
  search,
  filters,
  actions,
  itemName = "RECORDS",
}: DatatableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DATA_PER_PAGE);
  const [searchText, setSearchText] = useState("");

  // Auto-filter by search query if text is present
  const filteredData = searchText
    ? data.filter((item) => {
        try {
          const str = JSON.stringify(item).toLowerCase();
          return str.includes(searchText.toLowerCase());
        } catch {
          return true;
        }
      })
    : data;

  const totalElements = filteredData.length;
  const pageCount = Math.ceil(totalElements / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const effectiveSearch =
    search ??
    (header?.hasSearch
      ? {
          value: header.searchText ?? searchText,
          onChange: (val: string) => {
            header.setSearchText?.(val);
            setSearchText(val);
            setCurrentPage(1);
          },
          placeholder: "Search...",
        }
      : undefined);

  return (
    <Box
      bg="white"
      borderRadius="20px"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.04)"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      w="100%"
      maxW="100%"
      minW={0}
    >
      <TableToolbar
        header={header}
        search={effectiveSearch}
        filters={filters}
        actions={actions}
        toolbar={toolbar}
      />

      <Box overflowX="auto" flex="1" minHeight={0} w="100%" minW={0}>
        <TableUI
          data={paginatedData}
          columns={columns}
          revisionKey={revisionKey}
          isLoading={isLoading}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={onColumnVisibilityChange}
          isInsideCard={true}
        />
      </Box>

      <Box
        borderTop="1px solid"
        borderColor="gray.100"
        px={{ base: 4, md: 6 }}
        py={3.5}
        bg="white"
      >
        <Pagination
          currentPage={currentPage}
          onPaginationChange={(page) => setCurrentPage(page)}
          pageCount={pageCount}
          pageSize={pageSize}
          setPageSize={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          totalElements={totalElements}
          currentCount={paginatedData.length}
          itemName={itemName}
        />
      </Box>
    </Box>
  );
};
