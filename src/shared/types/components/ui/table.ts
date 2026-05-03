import { TableOptions } from "@tanstack/react-table";

export type TableProps<T> = {
  data: T[];
  columns: TableOptions<T>["columns"];
  isLoading?: boolean;
};

export interface MetaProps {
  width?: string;
  textAlign?: string;
}
