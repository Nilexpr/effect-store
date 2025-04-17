import Big from 'big.js';
import { BigOrEmpty, Empty } from './tool';

export type CellValueType = number | string | Empty;

export type StateCell<T extends object = object> = {
  type: 'state';
  value: CellValueType;
} & T;

export type ComputedCell<T extends object = object> = {
  type: 'computed';
  formula: string;
  /** 比例这种有可能也有自己的因子 */
  value?: CellValueType;
} & T;

export type Cell<
  S extends object = object,
  C extends object = object,
  T extends object = object,
> = (StateCell<S> | ComputedCell<C>) & T;

type OmitValue<T> = T extends { value?: unknown } ? Omit<T, 'value'> : T;

export type CellStateValueType = BigOrEmpty;

export type CellState<
  S extends object = object,
  C extends object = object,
  T extends object = object,
> = OmitValue<Cell<S, C, T>> & {
  value?: Big.Big;

  /** 获取用于计算的值 */
  getFactorValue: (...args: any[]) => {
    value: BigOrEmpty;
    factor?: Big.Big;
  };

  /** 设置用于计算的值 */
  setFactorValue: (...args: any[]) => void;

  /** 获取依赖项 */
  getDeps: () => {
    deps: { RowIndex: number; ColIndex: number; reference: string }[];
    targets: CellState[];
  };

  /** 设置公式的值 */
  setFormula: (...args: any[]) => void;

  getOriginCell: () => Cell<S, C, T>;

  setAttr: (key: string, value: any) => void;

  /**
   * @deprecated 仅为方便验证使用，实际应该直接用闭包里的值
   */
  rowIndex: number;
  /**
   * @deprecated 仅为方便验证使用，实际应该直接用闭包里的值
   */
  colIndex: number;
};
