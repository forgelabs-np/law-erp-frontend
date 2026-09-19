import { TableOptions, VisibilityState } from "@tanstack/react-table";

export type TableProps<T> = {
  data: T[];
  columns: TableOptions<T>["columns"];
  isLoading?: boolean;
  revisionKey?: number | string;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void;
};

export interface MetaProps {
  width?: string;
  textAlign?: string;
}
