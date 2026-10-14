import { Box } from "@chakra-ui/react";

import { DatatableProps } from "@/shared/types";
import { TableToolbar } from "./TableToolbar";
import { Pagination } from "./pagination";
import { TableUI } from "../ui/Table";

export const DatatableWithManualPagination = <T,>({
  data,
  columns,
  header,
  pagination,
  isLoading,
  revisionKey,
  columnVisibility,
  onColumnVisibilityChange,
  toolbar,
  search,
  filters,
  actions,
  totalElements,
  itemName = "RECORDS",
}: DatatableProps<T>) => {
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
        search={search}
        filters={filters}
        actions={actions}
        toolbar={toolbar}
      />

      <Box overflowX="auto" flex="1" minHeight={0} w="100%" minW={0}>
        <TableUI
          data={data}
          columns={columns}
          isLoading={isLoading}
          revisionKey={revisionKey}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={onColumnVisibilityChange}
          isInsideCard={true}
        />
      </Box>

      {pagination && (
        <Box
          borderTop="1px solid"
          borderColor="gray.100"
          px={{ base: 4, md: 6 }}
          py={3.5}
          bg="white"
        >
          <Pagination
            {...pagination}
            totalElements={pagination.totalElements ?? totalElements}
            itemName={pagination.itemName ?? itemName}
            currentCount={pagination.currentCount ?? data.length}
          />
        </Box>
      )}
    </Box>
  );
};
