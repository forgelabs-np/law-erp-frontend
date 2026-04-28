export type TableHeaderProps = {
  title: string;

  hasSearch?: boolean;
  searchText?: string;
  setSearchText?: (searchText: string) => void;

  actionButtonLabel?: string;
  onActionButtonClick?: VoidFunction;
};
