import { cloneElement, Fragment, useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { PivotTableProps } from "../interfaces/props";
import { calColSpan } from "../utils/calSpan";
import { getRowHeaderFromIndex } from "../utils/getRowHeader";

const columnHelper = createColumnHelper<any[]>();

export const useColumns = ({
  pivotTableProps,
}: {
  pivotTableProps: PivotTableProps<any>;
}) => {
  const { rowHeaders, colHeaders } = pivotTableProps;

  /** 行表头跨多少列 */
  const maxRowHeaderColSpan = calColSpan();

  const columns = useMemo(() => {
    return [
      ...Array.from({ length: maxRowHeaderColSpan }, (_, index) => {
        if (index === 0) {
          return columnHelper.accessor("rowHeader", {
            // id:,
            header: pivotTableProps.IntersectionCell as any,
            meta: {
              startRowSpan: 1,
              endRowSpan: 2,
              colSpan: 2,
            },
            cell: (info,) => {
              const rowIndex = info.row.index
              const rowHeader = getRowHeaderFromIndex({
                rowHeaders,
                index: rowIndex,
                depth: 0
              })


              return cloneElement(rowHeader.main.label, {
                rowSpan: rowHeader.children?.length
              });
            },
          });
        }
        return {
          id: "rowHeader",
          header: <Fragment></Fragment>,
          cell: (info,) => {
            const rowIndex = info.row.index
            const rowHeader = getRowHeaderFromIndex({
              rowHeaders,
              index: rowIndex,
              depth: 1
            })

            return rowHeader.main.label
          },
        };
      }),
      ...colHeaders.map((colHeader) => {
        if (colHeader.children) {
          return columnHelper.group({
            id: colHeader.main.key,
            header: colHeader.main.label as any,
            cell: (info) => info.getValue(),
            columns: colHeader.children.map((child) => {
              return columnHelper.accessor(child.main.key, {
                id: child.main.key,
                header: child.main.label as any,
                cell: (info) => {
                  return <td>123</td>;
                },
              });
            }),
          });
        }
        return columnHelper.group({
          id: colHeader.main.key,
          header: colHeader.main.label as any,
          cell: (info) => {
            return <td>123</td>;
          },
          meta: {
            startRowSpan: 1,
            endRowSpan: 2,
          },
        });
      }),
    ];
  }, [rowHeaders, colHeaders]);

  return {
    columns,
  };
};
