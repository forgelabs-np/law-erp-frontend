import { HStack } from "@chakra-ui/react";
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
}: TablePaginationProps) => {
  const pageRangeDisplayed = 3;
  const marginPagesDisplayed = 2;

  // need to add 1 because pagination change returns the index
  const handlePaginationChange = (selected: number) => {
    onPaginationChange(selected + 1);
  };

  // Use isFirstPage/isLastPage if provided, otherwise fall back to page calculation
  const disablePrevious = isFirstPage !== undefined ? isFirstPage : currentPage === 1;
  const disableNext = isLastPage !== undefined ? isLastPage : currentPage === pageCount;

  return (
    <HStack
      flexDirection={{
        base: "column",
        md: "row",
      }}
      alignItems={{
        base: "center",
      }}
      gap="4"
      justifyContent="space-between"
      userSelect="none"
      padding="4"
      flexShrink={0}
    >
      <PageSizeSelector pageSize={pageSize} setPageSize={setPageSize} />

      <ReactPaginate
        forcePage={currentPage - 1}
        pageCount={pageCount}
        pageRangeDisplayed={pageRangeDisplayed}
        marginPagesDisplayed={marginPagesDisplayed}
        previousLabel={<TablePaginationIcon isDisabled={disablePrevious} />}
        nextLabel={
          <TablePaginationIcon
            isRight={true}
            isDisabled={disableNext}
          />
        }
        onPageChange={(page) => handlePaginationChange(page.selected)}
        className="pagination"
        activeClassName="pagination__link--active"
      />
    </HStack>
  );
};
