import { ExpandedInstance, Table } from '@tanstack/react-table';
import { Cell, CellState } from './cell';
import { Header } from './header';
import { ReactNode } from 'react';

export interface ExcelProps<
  S extends object = object,
  C extends object = object,
  T extends object = object,
> {
  rowHeaders: Header[];
  colHeaders: Header[];
  data: Cell<S, C, T>[][];
  overallHeaderCell: string;
  renderCell: (data: CellState<S, C, T>) => ReactNode;
}

export interface ExcelRef<
  S extends object = object,
  C extends object = object,
  T extends object = object,
> {
  /** 一键展开 */
  handleExpand: ReturnType<
    ExpandedInstance<CellState<S, C, T>[]>['getToggleAllRowsExpandedHandler']
  >;
  /** 一键展开 */
  resetExpand: ExpandedInstance<CellState<S, C, T>[]>['resetExpanded'];
  /** 检查编辑情况 */
  checkEditState: () => boolean;
  /** 设置编辑情况 */
  setEditState: (value: boolean) => void;
  /** 设置表格loading态 */
  setLoading: (loading: Promise<any>) => void;
  /** 获取表格当前状态 */
  getState: () => CellState<S, C, T>[][];
  /** 获取表格实例 */
  getTableInstance: () => Table<CellState[]>;
  /** 设置特定单元格的值 */
  setTargetCellFormula: (params: { rowIndex: number; colIndex: number; value: any }) => void;
  /** 设置特定单元格的值 */
  setTargetCellFormulaDirect: (params: { rowIndex: number; colIndex: number; value: any }) => void;
  setTargetCellAttr: (params: { rowIndex: number; colIndex: number; value: any; key: any }) => void;
  /** 设置特定单元格的值 */
  setTargetCellValue: (params: { rowIndex: number; colIndex: number; value: any }) => void;
  /** 遍历整张表格 */
  traversalQuery: (cb: (cell: any) => any) => any;
}

export interface ExcelState<
  S extends object = object,
  C extends object = object,
  T extends object = object,
> {
  rowHeaders: Header[];
  colHeaders: Header[];
  data: CellState<S, C, T>[][];
}
