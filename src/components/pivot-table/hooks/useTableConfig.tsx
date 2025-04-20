import { getCoreRowModel, TableOptions } from "@tanstack/react-table";
import { useColumns } from "./useColumns";
import { PivotTableProps } from "../interfaces/props";
import { useMemo } from "react";

export function useTableConfig({
  pivotTableProps,
}: {
  pivotTableProps: PivotTableProps;
}): TableOptions<any> {
  const columnsCfg = useColumns({
    pivotTableProps,
  });

  return useMemo(() => ({
    columns: columnsCfg.columns,
    data: [],
    getCoreRowModel: getCoreRowModel(),
  }), [columnsCfg.columns]);
}
