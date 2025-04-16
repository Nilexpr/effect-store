import { ICreateDataStoreParams, IKey } from "./interfaces/data";

export class Data<D, R> {
  /** 唯一 Key */
  key: IKey;
  /** 计算结果 */
  private result?: R;
  /** 所有依赖项的 Key */
  private deps: Set<IKey>;
  /** 依赖当前项的 Key */
  private dependents: Set<IKey>;
  /** 给 React 用的 */
  private onStoreChange?: () => void;
  /** 给定 value 和 deps，能够获取到最终结果值 */
  private evaluate: ReturnType<
    ICreateDataStoreParams<D, R>["parser"]
  >["evaluate"];

  constructor(
    /** 唯一 Key */
    key: IKey,
    /** 原始数据 */
    private originData: D,
    /** 外部传入的一些工具函数 */
    createStoreMethods: ICreateDataStoreParams<D, R>,
    /** 更新回调 */
    private updateCallback: (origin: Data<D, R>) => void,
    /** 获取依赖对象 */
    private getDepsMap: (deps: Set<IKey>) => Record<string, readonly [D, R?]>
  ) {
    const { deps, evaluate } = createStoreMethods.parser(originData);

    this.dependents = new Set();
    this.deps = new Set(deps);
    this.evaluate = evaluate;

    this.key = key;
  }

  update() {
    this.result = this.evaluate(
      this.getOriginData(),
      this.getDepsMap(this.deps)
    );
    this.onStoreChange?.();
    this.updateCallback(this);
  }

  getDeps() {
    return this.deps;
  }

  getDependents() {
    return this.dependents;
  }

  addDependents(newDependent: IKey) {
    this.dependents.add(newDependent);
  }

  getOriginData(): D {
    return this.originData;
  }

  /** 改变的回调 */
  onChange(cb: (currentValue: D) => D): D {
    const modifyResult = cb(this.originData);
    this.originData = modifyResult;
    return this.originData;
  }

  subscribe(onStoreChange: () => void) {
    this.result = this.evaluate(
      this.getOriginData(),
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
