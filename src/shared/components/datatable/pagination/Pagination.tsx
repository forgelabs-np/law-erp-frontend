import { Flex, HStack, Text } from "@chakra-ui/react";
import ReactPaginate from "react-paginate";

import { TablePaginationProps } from "@/shared/types";

import "@/shared/styles/pagination.css";

import { PageSizeSelector } from "./PageSizeSelector";
import { TablePaginationIcon } from "./TablePaginationIcon";

export const Pagination = ({
  currentPage,
  pageCount,
  onPaginationChange,
  pageSize,
  setPageSize,
  isFirstPage,
  isLastPage,
  totalElements,
  currentCount,
  itemName = "USERS",
}: TablePaginationProps) => {
  const pageRangeDisplayed = 3;
  const marginPagesDisplayed = 2;

  const handlePaginationChange = (selected: number) => {
    onPaginationChange(selected + 1);
  };

  const disablePrevious =
    isFirstPage !== undefined ? isFirstPage : currentPage === 1;
  const disableNext =
    isLastPage !== undefined ? isLastPage : currentPage === pageCount;

  return (
    <Flex
      direction={{ base: "column", sm: "row" }}
      align={{ base: "flex-start", sm: "center" }}
      gap="4"
      justify="space-between"
      userSelect="none"
      w="100%"
    >
      {/* Left side: Showing count text */}
      <HStack gap={3} align="center">
        {totalElements !== undefined ? (
          <Text
            fontSize="xs"
            fontWeight="600"
            color="gray.400"
            letterSpacing="0.05em"
            textTransform="uppercase"
          >
            SHOWING{" "}
            <Text as="span" color="gray.800" fontWeight="700">
              {currentCount ?? pageSize}
            </Text>{" "}
            OF{" "}
            <Text as="span" color="gray.800" fontWeight="700">
              {totalElements}
            </Text>{" "}
            {itemName.toUpperCase()}
          </Text>
        ) : (
          <PageSizeSelector pageSize={pageSize} setPageSize={setPageSize} />
        )}
      </HStack>

      {/* Right side: Page navigation */}
      <ReactPaginate
        forcePage={currentPage - 1}
        pageCount={pageCount}
        pageRangeDisplayed={pageRangeDisplayed}
        marginPagesDisplayed={marginPagesDisplayed}
        previousLabel={<TablePaginationIcon isDisabled={disablePrevious} />}
        nextLabel={
          <TablePaginationIcon isRight={true} isDisabled={disableNext} />
        }
        onPageChange={(page) => handlePaginationChange(page.selected)}
        className="pagination"
        activeClassName="pagination__link--active"
      />
    </Flex>
  );
};
