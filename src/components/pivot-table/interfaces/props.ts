import { ReactNode } from "react";
import { ColHeaders, RowHeaders } from "./header";

export interface PivotTableProps<T> {
  rowHeaders: RowHeaders;
  colHeaders: ColHeaders;
  data: T[];
  IntersectionCell: ReactNode;
}
