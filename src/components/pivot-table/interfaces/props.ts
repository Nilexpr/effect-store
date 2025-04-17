import { ReactNode } from "react";
import { ColHeader, RowHeader } from "./header";

export interface PivotTableProps {
  rowHeaders: RowHeader;
  colHeaders: ColHeader;
  IntersectionCell: ReactNode;
}
