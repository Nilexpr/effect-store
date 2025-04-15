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

  // TODO 转成 class
  /** 对插入的值做前序转化 */
  // const dataTransformer = (data: IOriginData<D>): IData<D, R> => {
  //   let callbackRef: () => void;

  //   const { deps } = parser(data.value);

  //   const setValue: IData<D>["setValue"] = (newValue) => {
  //     transformedData.value = newValue;
  //     const deps = getDepsValue(data, parser, get).reduce((pre, cur) => {
  //       const depKey = generateKey(cur);
  //       pre[depKey] = cur.value;
  //       return pre;
  //     }, {} as Record<IKey, D>);

  //     onUpdate(transformedData, newValue, deps);
  //   };

  //   const onUpdate: IData<D, R>["onUpdate"] = (self, value, deps) => {
  //     /** 更新队列，后面优化可以用 */
  //     const updateQueue = [];

  //     const propagateUpdate = (curData: IData<D, R>) => {
  //       const dependents = Array.from(self.dependents).map(get);
  //       updateQueue.push(...dependents);
  //     };
  //   };

  //   const subscribe: IData<D, R>["subscribe"] = (callback) => {
  //     callbackRef = callback;
  //     const cancel = () => {};
  //     return cancel;
  //   };

  //   const getSnapshot: IData<D, R>["getSnapshot"] = () => {};

  //   const transformedData: IData<D, R> = {
  //     ...data,
  //     deps: new Set(...deps),
  //     dependents: new Set(),
  //     setValue,
  //     onUpdate,
  //     subscribe,
  //     getSnapshot,
  //   };

  //   return transformedData;
  // };

  const setDependents = () => {
    dataStore.forEach((value, key) => {
      const deps = value.getDependents();
      const dependents = Array.from(deps).map(get);
      dependents.forEach((dependent) => {
        dependent.addDependents(key);
      });
    });
  };

  const updateCallback: ConstructorParameters<typeof Data<D, R>>["2"] = (
    origin
  ) => {
    const dependents = origin.getDependents();
    const dependentInstances = Array.from(dependents).map(get);
  };

  const updateCallback: ConstructorParameters<typeof Data<D, R>>["2"] = (
    origin
  ) => {
    const dependents = origin.getDependents();
    const dependentInstances = Array.from(dependents).map(get);
  };

  const init: IStore<D, R>["init"] = async (data) => {
    data.forEach((dataItem) => {
      const key = generateKey(dataItem);
      dataStore.set(key, new Data(dataItem, params, updateCallback));
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
