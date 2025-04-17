import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { PivotTableProps } from "../interfaces/props";

const columnHelper = createColumnHelper<CellData[]>();

export const useColumns = ({
  pivotTableProps,
}: {
  pivotTableProps: PivotTableProps;
}) => {
  const { rowHeader } = pivotTableProps;

  const columns = useMemo(() => {
    return [
      columnHelper.group({
        header: "Info",
        footer: (props) => props.column.id,
        columns: [
          columnHelper.group({
            id: "rowHeader",
            header: () => (
              <div className="text-[12px]leading-4 flex flex-row gap-1 tracking-[0.5px] text-[#626265]">
                <div>价格信息</div>
                <button className="text-[#16A5AF]">一键折叠</button>
              </div>
            ),
            columns: [
              columnHelper.accessor("visits", {
                header: () => <span>Visits</span>,
                footer: (props) => props.column.id,
              }),
              columnHelper.accessor("status", {
                header: "Status",
                footer: (props) => props.column.id,
              }),
            ],
          }),
          columnHelper.group({
            header: "More Info",
            columns: [
              columnHelper.accessor("visits", {
                header: () => <span>Visits</span>,
                footer: (props) => props.column.id,
              }),
              columnHelper.accessor("status", {
                header: "Status",
                footer: (props) => props.column.id,
              }),
              columnHelper.accessor("progress", {
                header: "Profile Progress",
                footer: (props) => props.column.id,
              }),
            ],
          }),
        ],
      }),
    ];
  }, [rowHeader]);

  return {
    columns,
  };
};
