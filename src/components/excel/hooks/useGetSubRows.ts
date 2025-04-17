import { TableOptions } from '@tanstack/react-table';
import { useMap, useMemoizedFn } from 'ahooks';
// import { DataCell } from 'Excel/interface/cell';
import { ExcelProps, ExcelState } from '../interface/excel';
import { calIndexInRecursively, getCellByIndexRecursively } from '../utils/calIndexRecursively';

export const useGetSubRows = ({
  data,
  rowHeaders,
}: {
  data: ExcelState['data'];
  rowHeaders: ExcelProps['rowHeaders'];
}) => {
  const func = useMemoizedFn<NonNullable<TableOptions<ExcelState['data'][number]>['getSubRows']>>(
    (row) => {
      const rowIndex = data.findIndex((dataRow) => dataRow === row);

      const target = getCellByIndexRecursively(rowHeaders, rowIndex).target;

      if (target === null) {
        console.log('row Columns not exist');
        return undefined;
      }

      const targetIndexes = target.children?.map((child) => {
        const childIndex = calIndexInRecursively(rowHeaders, child.main).resIndex;
        return childIndex!;
      });

      const subRows = targetIndexes?.map((index) => data[index]);

      return subRows;
    },
  );

  return func;
};
