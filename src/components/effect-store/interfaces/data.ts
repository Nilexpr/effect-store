import { Equal } from "effect";

export interface Data<K extends Equal.Equal> {
  /** 唯一 ID */
  key: K;
  /** 对应的值 */
  value: any;
  /** 依赖项变更的时候触发的更新函数 */
  onUpdate: (...deps: Data<K>[]) => void;
  /** 所有的依赖项 key */
  deps: K[];
}

export interface Store<K extends Equal.Equal, D extends Data<K>> {
  get: (key: K) => D;
  insert: (key: K, data: D) => void;
}
