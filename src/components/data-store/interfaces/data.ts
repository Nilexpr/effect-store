import { Data } from "../data";

export type IKey = string;

export interface IOriginData<D> {
  /** 需要参与计算的值 */
  value: D;
  /** 其他的值，Store 不关心 */
  [key: string]: unknown;
}

export interface IStore<D, R> {
  /** 找到对应的数据源，如果没有抛异常 */
  get: (key: IKey) => Data<D, R>;
  /** 初始化整个 Store */
  init: (data: IOriginData<D>[]) => Promise<void>;
  /** 清除 Store */
  clear: () => void;
}

export interface ICreateDataStoreParams<D, R> {
  /** 生成唯一key */
  generateKey: (data: IOriginData<D>) => IKey;
  /** 外部传入解析的方法，获取所有的依赖 */
  parser: (value: D) => {
    /** 所有的依赖项 key */
    deps: IKey[];
  };
  /** 给定 value 和 deps，能够获取到最终结果值 */
  evaluate: (value: D, deps: Record<IKey, D>) => R;
}
