import { TableHeaderProps } from "./header";
import { TablePaginationProps } from "./pagination";
import { TableProps } from "../ui";

export type DatatableProps<T> = TableProps<T> & {
  header?: TableHeaderProps;
  autoPagination?: boolean;
  pagination?: TablePaginationProps;
};
