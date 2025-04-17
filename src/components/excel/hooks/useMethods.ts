import { Table } from '@tanstack/react-table';
import { CellState } from '../interface/cell';
import { ExcelProps, ExcelRef } from '../interface/excel';
import { Dispatch, ForwardedRef, useImperativeHandle } from 'react';
import { useBoolean } from 'ahooks';
import Big from 'big.js';

export const useMethods = (
  ref: ForwardedRef<ExcelRef>,
  {
    props,
    table,
    data,
    isEdited,
    setIsEdited,
  }: {
    props: ExcelProps;
    table: Table<CellState[]>;
    data: CellState[][];
    isEdited?: boolean;
    setIsEdited?: Dispatch<React.SetStateAction<boolean>>;
  },
) => {
  const [loading, { setTrue, setFalse }] = useBoolean(false);

  useImperativeHandle(ref, () => {
    return {
      handleExpand: table.getToggleAllRowsExpandedHandler(),
      resetExpand: () => {
        console.log('reset expand');
        table.resetExpanded();
      },
      checkEditState: () => {
        return isEdited;
      },
      setEditState: (value: boolean) => {
        setIsEdited(value);
      },
      traversalQuery: (cb: (cell: any) => any) => {
        return data.map((row) => {
          return row.map((cell) => {
            return cb(cell);
          });
        });
      },
      setLoading: (loading) => {
        setTrue();
        loading.finally(setFalse);
      },
      getState: () => {
        return data;
      },
      getTableInstance: () => {
        return table;
      },
      // 给百分比专门用的
      setTargetCellFormula: ({
        rowIndex,
        colIndex,
        value,
      }: {
        rowIndex: number;
        colIndex: number;
        value: any;
      }) => {
        const cell = data?.[rowIndex]?.[colIndex];
        console.log('setTargetCellFormula', {
          rowIndex,
          colIndex,
          value: Big(value).toFixed(1),
          cell,
          originValue: cell.getFactorValue(),
          originCell: cell.getOriginCell(),
        });
        if (!cell) {
          console.error(`certain cell not found at ${rowIndex}, ${colIndex}}`);
          return;
        }
        const modifiedFormula = (cell.getOriginCell() as any)?.formula?.replace?.(
          /\b\d+(\.\d+)?\b/,
          Big(value).toString(),
        );
        console.log({
          modifiedFormula,
        });
        cell.setFormula(modifiedFormula);
      },
      // 给百分比专门用的
      setTargetCellFormulaDirect: ({
        rowIndex,
        colIndex,
        value,
      }: {
        rowIndex: number;
        colIndex: number;
        value: any;
      }) => {
        const cell = data?.[rowIndex]?.[colIndex];
        console.log('setTargetCellFormulaDirect', {
          rowIndex,
          colIndex,
          value,
          cell,
          originValue: cell.getFactorValue(),
          originCell: cell.getOriginCell(),
        });
        if (!cell) {
          console.error(`certain cell not found at ${rowIndex}, ${colIndex}}`);
          return;
        }
        cell.setFormula(value);
      },
      // 给百分比专门用的
      setTargetCellValue: ({
        rowIndex,
        colIndex,
        value,
      }: {
        rowIndex: number;
        colIndex: number;
        value: any;
      }) => {
        const cell = data?.[rowIndex]?.[colIndex];
        console.log('setTargetCellValue', {
          rowIndex,
          colIndex,
          value: Big(value).toString(),
          cell,
          originValue: cell.getFactorValue(),
          originCell: cell.getOriginCell(),
        });
        if (!cell) {
          console.error(`certain cell not found at ${rowIndex}, ${colIndex}}`);
          return;
        }
        cell.setFactorValue(Big(Big(value).toFixed(1)));
      },
      setTargetCellAttr: ({
        rowIndex,
        colIndex,
        key,
        value,
      }: {
        rowIndex: number;
        colIndex: number;
        key: any;
        value: any;
      }) => {
        const cell = data?.[rowIndex]?.[colIndex];
        console.log('setTargetCellAttr', {
          rowIndex,
          colIndex,
          value,
          cell,
          originValue: cell.getFactorValue(),
          originCell: cell.getOriginCell(),
        });
        if (!cell) {
          console.error(`certain cell not found at ${rowIndex}, ${colIndex}}`);
          return;
        }
        cell.setAttr(key, value);
      },
    };
  });

  return {
    loading,
  };
};
