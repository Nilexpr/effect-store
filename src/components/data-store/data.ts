import { ICreateDataStoreParams, IData, IOriginData } from "./interfaces/data";

export class Data<D, R> implements IData<D, R> {
  [key: string]: unknown;
  value: D;
  deps: Set<string>;
  dependents: Set<string>;

  constructor(
    originData: IOriginData<D>,
    params: ICreateDataStoreParams<D, R>
  ) {
    const { value, ...rest } = originData;
    this.value = value;

    Object.entries(rest).forEach(([key, value]) => {
      this[key] = value;
    });
    const { deps } = params.parser(originData.value);

    this.deps = new Set(...deps);
    this.dependents = new Set();
  }

  setValue(newValue: D) {
    this.value = newValue;
    const deps = getDepsValue(data).reduce((pre, cur) => {
      const depKey = generateKey(cur);
      pre[depKey] = cur.value;
      return pre;
    }, {} as Record<IKey, D>);

    this.onUpdate(newValue, deps);
  }

  onUpdate(value: D, deps: Record<string, D>) {}

  subscribe(onStoreChange: () => void) {}

  getSnapshot() {}
}
