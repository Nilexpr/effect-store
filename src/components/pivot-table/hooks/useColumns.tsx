import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { PivotTableProps } from "../interfaces/props";
import { Recursively } from "../interfaces/tool";
import { Header } from "../interfaces/header";

const columnHelper = createColumnHelper<CellData[]>();

const test = (colHeader: Recursively<Header>) => {
  if (colHeader.children) {
    return columnHelper.display("123", {
      header: () => colHeader.main.label,
      cell: () => "Cell",
    });
  }
  return columnHelper.accessor("123", {
    header: () => colHeader.main.label,
    cell: () => "Cell",
  });
};

export const useColumns = ({
  pivotTableProps,
}: {
  pivotTableProps: PivotTableProps;
}) => {
  const { rowHeaders, colHeaders } = pivotTableProps;

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("rowHeader", {
        cell: (info) => info.getValue(),
        header: () => pivotTableProps.IntersectionCell,
      }),
      colHeaders.map((colHeader) => {}),
      columnHelper.group({
        header: "More Info",
        columns: [
          columnHelper.accessor("visits", {
            header: () => (
              <th>
                <span>Visits</span>,
              </th>
            ),
            footer: (props) => props.column.id,
          }),
          columnHelper.accessor("progress", {
            header: "Profile Progress",
            footer: (props) => props.column.id,
          }),
        ],
      }),
    ];
  }, [rowHeader]);

  return {
    columns,
  };
};
