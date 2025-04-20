import { ReactNode } from "react";
import { ColHeaders, RowHeaders } from "./header";

export interface PivotTableProps {
  rowHeaders: RowHeaders;
  colHeaders: ColHeaders;
  IntersectionCell: ReactNode;
}
