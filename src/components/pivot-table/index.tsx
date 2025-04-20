import React, {
  cloneElement,
  FC,
  Fragment,
  ReactElement,
  ReactNode,
} from "react";
import { PivotTableProps } from "./interfaces/props";
import { useTableConfig } from "./hooks/useTableConfig";
import { flexRender, useReactTable } from "@tanstack/react-table";
import "./style.css";

export const PivotTable: FC<PivotTableProps> = (props) => {
  const tableCfg = useTableConfig({ pivotTableProps: props });
  const tableInstance = useReactTable(tableCfg);

  return (
    <div>
      <thead>
        {tableInstance.getHeaderGroups().map((headerGroup, index) => {
          // console.log({
          //   headerGroup: tableInstance.getHeaderGroups()
          // })
          return (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as any;
                const curSpan = index + 1;
                const colSpan = header.colSpan;

                if (meta?.startRowSpan && meta?.endRowSpan) {
                  if (meta.startRowSpan === curSpan) {
                    return cloneElement(
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      ) as ReactElement<HTMLTableCellElement>,
                      {
                        rowSpan: meta.endRowSpan - meta.startRowSpan + 1,
                        colSpan,
                      }
                    );
                  }
                  return null;
                }
                return cloneElement(
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  ) as ReactElement<HTMLTableCellElement>,
                  {
                    colSpan,
                  }
                );
              })}
            </tr>
          );
        })}
      </thead>
      <tbody>
        {tableInstance.getRowModel().rows.map((row) => {
          return (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell, colIndex) => {
                if (colIndex === 0) {
                  return (
                    <Fragment key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Fragment>
                  );
                }
                return (
                  <Fragment key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Fragment>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </div>
  );
};
