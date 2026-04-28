import { QueryFunction } from "@tanstack/react-query";

import { TableHeaderProps } from "./header";
import { TableProps } from "../ui";

export type DynamicDatatableProps<T> = Pick<TableProps<T>, "columns"> & {
  queryKey: string[];
  queryFn: QueryFunction<unknown, unknown[], never>;
  header?: TableHeaderProps;
};
