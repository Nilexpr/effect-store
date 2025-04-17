import { getCoreRowModel, TableOptions } from "@tanstack/react-table";
import { useColumns } from "./useColumns";
import { PivotTableProps } from "../interfaces/props";

export const useTableConfig = ({
  pivotTableProps,
}: {
  pivotTableProps: PivotTableProps;
}): TableOptions<any> => {
  const columnsCfg = useColumns({
    pivotTableProps,
  });

  return {
    columns: columnsCfg.columns,
    data: [],
    getCoreRowModel: getCoreRowModel(),
  };
};
