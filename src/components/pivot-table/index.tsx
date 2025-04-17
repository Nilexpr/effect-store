import { FC, Fragment } from "react";
import { PivotTableProps } from "./interfaces/props";
import { useTableConfig } from "./hooks/useTableConfig";
import { flexRender, useReactTable } from "@tanstack/react-table";

export const PivotTable: FC<PivotTableProps> = (props) => {
  const tableCfg = useTableConfig({ pivotTableProps: props });
  const tableInstance = useReactTable(tableCfg);

  return (
    <div>
      <thead>
        {tableInstance.getHeaderGroups().map((headerGroup) => {
          return (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
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
