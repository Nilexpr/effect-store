export interface IData<D> {
  /** 唯一 ID */
  key: string;
  /** 对应的值 */
  value: D;
  /** 依赖项变更的时候触发的更新函数 */
  onUpdate: (...deps: IData<D>[]) => void;
  /** 所有的依赖项 key */
  deps: IData<D>["key"][];
}

export interface IStore<D> {
  get: (key: IData<D>["key"]) => IData<D> | null;
  init: (data: IData<D>[]) => Promise<void>;
}
