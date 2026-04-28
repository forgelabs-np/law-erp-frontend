import { TableOptions } from "@tanstack/react-table";

export type TableProps<T> = {
  data: T[];
  columns: TableOptions<T>["columns"];
};
