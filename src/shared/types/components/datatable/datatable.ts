import React from "react";
import { TableHeaderProps } from "./header";
import { TablePaginationProps } from "./pagination";
import { TableProps } from "../ui";

export type DatatableSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: string;
};

export type DatatableProps<T> = TableProps<T> & {
  header?: TableHeaderProps;
  autoPagination?: boolean;
  pagination?: TablePaginationProps;
  isLoading?: boolean;
  /** Full custom toolbar node rendered inside top of the table card */
  toolbar?: React.ReactNode;
  /** Search input rendered on the left of toolbar */
  search?: DatatableSearchProps;
  /** Filter dropdowns/controls rendered on the right of toolbar beside search */
  filters?: React.ReactNode;
  /** Action buttons rendered on the far right of toolbar */
  actions?: React.ReactNode;
  /** Total count of items for SHOWING X OF Y label */
  totalElements?: number;
  /** Item name for SHOWING X OF Y label (e.g. USERS, CLIENTS, MATTERS, RECORDS) */
  itemName?: string;
};
