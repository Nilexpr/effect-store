import { Data } from "../data";

export type IKey = string;

/**
 * D: 原数据类型
 *
 * R: 结果类型
 */
export interface IStore<D, R> {
  /** 找到对应的数据源，如果没有抛异常 */
  get: (key: IKey) => Data<D, R>;
  /** 初始化整个 Store */
  init: (data: D[]) => Promise<void>;
  /** 清除 Store */
  clear: () => void;
  /** 获取所有的 key */
  getKeys: () => IKey[];
}

export interface ICreateDataStoreParams<D, R> {
  /** 生成唯一key */
  generateKey: (data: D) => IKey;
  /** 外部传入解析的方法，获取所有的依赖 */
  parser: (data: D) => {
    /** 所有的依赖项 key */
    deps: IKey[];
    /** 给定 value 和 deps，能够获取到最终结果值 */
    evaluate: (data: D, deps: Record<IKey, Readonly<[D, R?]>>) => R;
    /** 改变的回调 */
    onChange: (data: D) => D;
  };
}
