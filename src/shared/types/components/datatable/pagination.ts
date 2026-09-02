export type TablePaginationIconProps = {
  isDisabled: boolean;
  isRight?: boolean;
};

export type TablePaginationProps = PageSizeSelectorProps & {
  currentPage: number;
  pageCount: number;
  onPaginationChange: (currentPage: number) => void;
  isFirstPage?: boolean;
  isLastPage?: boolean;
};

export type PageSizeSelectorProps = {
  pageSize: number;
  setPageSize: (pageSize: number) => void;
};
