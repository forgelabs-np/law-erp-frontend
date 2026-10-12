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
  totalElements?: number;
  currentCount?: number;
  itemName?: string;
  showShowingText?: boolean;
};

export type PageSizeSelectorProps = {
  pageSize: number;
  setPageSize: (pageSize: number) => void;
};
