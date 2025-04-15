import { Data } from "./data";
import type { ICreateDataStoreParams, IStore } from "./interfaces/data";

/**
 * 创建一个 key value 的 Store，其中每条数据相互依赖，是一张图
 *
 * 当其中一个依赖更新时，更新所有的被依赖项
 *
 * 只存参与计算的 value，如何展示由外部控制
 */
export const createDataStore = <D, R>(
  params: ICreateDataStoreParams<D, R>
): IStore<D, R> => {
  const { generateKey } = params;

  /** 数据源 */
  const dataStore = new Map<string, Data<D, R>>();

  const setDependents = () => {
    dataStore.forEach((value, key) => {
      const deps = value.getDependents();
      const dependents = Array.from(deps).map(get);
      dependents.forEach((dependent) => {
        dependent.addDependents(key);
      });
    });
  };

  const getDepsMap: ConstructorParameters<typeof Data<D, R>>["3"] = (deps) => {
    return Array.from(deps)
      .map(get)
      .reduce((pre, cur) => {
        pre[cur.key] = cur.getValue();
        return pre;
      }, {} as Record<string, D>);
  };

  const updateCallback: ConstructorParameters<typeof Data<D, R>>["2"] = (
    origin
  ) => {
    // TODO 待优化，使用一个更新队列减少不必要的更新
    const dependents = origin.getDependents();
    const dependentInstances = Array.from(dependents).map(get);
    dependentInstances.forEach((item) => {
      item.update();
    });
  };

  const init: IStore<D, R>["init"] = async (data) => {
    data.forEach((dataItem) => {
      const key = generateKey(dataItem);
      dataStore.set(
        key,
        new Data(dataItem, params, updateCallback, getDepsMap, key)
      );
      setDependents();
    });
  };

  const get: IStore<D, R>["get"] = (key) => {
    const target = dataStore.get(key);
    if (!target) {
      throw new Error(`Target not found on key ${key}`);
    }
    return target;
  };

  return {
    init,
    get,
    clear: dataStore.clear,
  };
};
