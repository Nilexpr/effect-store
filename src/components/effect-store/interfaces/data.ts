import { Equal, Option } from "effect";

export interface IData<K extends Equal.Equal, D> {
  /** 唯一 ID */
  key: K;
  /** 对应的值 */
  value: D;
  /** 依赖项变更的时候触发的更新函数 */
  onUpdate: (...deps: IData<K, D>[]) => void;
  /** 所有的依赖项 key */
  deps: K[];
}

export interface IStore<K extends Equal.Equal, D extends IData<K, D>> {
  get: (key: K) => Option.Option<D>;
  init: () => Promise<void>;
  insert: (key: K, data: D) => void;
  log: () => void;
}
