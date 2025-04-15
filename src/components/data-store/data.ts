import { ICreateDataStoreParams, IKey, IOriginData } from "./interfaces/data";

export class Data<D, R> {
  /** 需要参与计算的值 */
  private value: D;
  /** 计算结果 */
  private result: R | null = null;
  /** 其他的值，Store 不关心 */
  extra: {
    [key: string]: unknown;
  };
  /** 所有依赖项的 Key */
  private deps: Set<IKey>;
  /** 依赖当前项的 Key */
  private dependents: Set<IKey>;
  /** 给 React 用的 */
  private onStoreChange?: () => void;

  constructor(
    /** 初始数据 */
    originData: IOriginData<D>,
    /** 外部传入的一些工具函数 */
    private createStoreMethods: ICreateDataStoreParams<D, R>,
    /** 更新回调 */
    private updateCallback: (origin: Data<D, R>) => void,
    /** 获取依赖对象 */
    private getDepsMap: (deps: Set<IKey>) => Record<string, D>
  ) {
    const { value, ...rest } = originData;
    this.value = value;
    this.extra = rest;

    const { deps } = createStoreMethods.parser(originData.value);

    this.deps = new Set(...deps);
    this.dependents = new Set();
  }

  setValue(newValue: D) {
    this.value = newValue;
    this.result = this.createStoreMethods.evaluate(
      this.value,
      this.getDepsMap(this.deps)
    );

    this.onStoreChange?.();

    this.updateCallback(this);
  }

  getDependents() {
    return this.dependents;
  }

  addDependents(newDependent: IKey) {
    this.dependents.add(newDependent);
  }

  subscribe(onStoreChange: () => void) {
    this.result = this.createStoreMethods.evaluate(
      this.value,
      this.getDepsMap(this.deps)
    );
    this.onStoreChange = onStoreChange;

    return () => {
      this.onStoreChange = undefined;
    };
  }

  getSnapshot() {
    return this.result;
  }
}
