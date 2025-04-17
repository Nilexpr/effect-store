import {
  createRow,
  getMemoOptions,
  memo,
  Row,
  RowData,
  RowModel,
  Table,
} from '@tanstack/react-table';
import { getCellByIndexRecursively } from './calIndexRecursively';
import { ExcelState } from '../interface/excel';

export function getCoreRowModel<TData extends RowData>(
  rowHeaders: ExcelState['rowHeaders'],
): (table: Table<TData>) => () => RowModel<TData> {
  return (table) =>
    memo(
      () => [table.options.data],
      (
        data,
      ): {
        rows: Row<TData>[];
        flatRows: Row<TData>[];
        rowsById: Record<string, Row<TData>>;
      } => {
        // console.log('Call get CoreRowModel', JSON.stringify(rowHeaders));
        const rowModel: RowModel<TData> = {
          rows: [],
          flatRows: [],
          rowsById: {},
        };

        let curIndex = 0;
        const accessRows = (
          originalRows: TData[],
          depth = 0,
          // curIndex = 0,
          parentRow?: Row<TData>,
        ): Row<TData>[] => {
          const rows = [] as Row<TData>[];

          for (let i = 0; i < originalRows.length; i++) {
            if (depth === 0) {
              const rowDepth = getCellByIndexRecursively(rowHeaders, i).depth;

              if (rowDepth !== 0) {
                continue;
              }
            }
            // Make the row
            const row = createRow(
              table,
              table._getRowId(originalRows[i]!, curIndex++, parentRow),
              originalRows[i]!,
              curIndex,
              depth,
              undefined,
              parentRow?.id,
            );

            // Keep track of every row in a flat array
            rowModel.flatRows.push(row);
            // Also keep track of every row by its ID
            rowModel.rowsById[row.id] = row;
            // Push table row into parent
            rows.push(row);

            // Get the original subrows
            if (table.options.getSubRows) {
              row.originalSubRows = table.options.getSubRows(originalRows[i]!, i);

              // Then recursively access them
              if (row.originalSubRows?.length) {
                row.subRows = accessRows(
                  row.originalSubRows,
                  depth + 1,
                  // rows.length + curIndex + 1,
                  row,
                );
              }
            }
          }

          return rows;
        };

        rowModel.rows = accessRows(data);

        return rowModel;
      },
      getMemoOptions(table.options, 'debugTable', 'getRowModel', () => table._autoResetPageIndex()),
    );
}
