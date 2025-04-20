import React, { cloneElement, useMemo } from "react";
import { CoreOptions, createColumnHelper } from "@tanstack/react-table";
import { PivotTableProps } from "../interfaces/props";

const columnHelper = createColumnHelper<any[]>();


export const useColumns = ({
  pivotTableProps,
}: {
  pivotTableProps: PivotTableProps;
}) => {
  const { rowHeaders, colHeaders } = pivotTableProps;

  // 先写死是2,目前最多只有两个表头
  const maxSpan = 2;

  const columns = useMemo(() => {
    return [
      ...colHeaders.map(
        (colHeader) => {
          if (colHeader.children) {
            return columnHelper.group({
              id: colHeader.main.key,
              header: colHeader.main.label,
              columns: colHeader.children.map((child) => {
                return columnHelper.group({
                  id: child.main.key,
                  header: child.main.label
                })
              })
            })
          }
          return columnHelper.group({
            id: colHeader.main.key,
            header: colHeader.main.label,
            meta: {
              startRowSpan: 1,
              endRowSpan: 2
            }
          })
        }
      )
    ];
  }, [rowHeaders]);

  console.log(columns)

  return {
    columns,
  };
};
