import type {
  ICreateDataStoreParams,
  IData,
  IKey,
  IOriginData,
  IStore,
} from "./interfaces/data";

/**
 * 创建一个 key value 的 Store，其中每条数据相互依赖，是一张图
 *
 * 当其中一个依赖更新时，更新所有的被依赖项
 *
 * 只存参与计算的 value，如何展示由外部控制
 */
export const createDataStore = <D, R>({
  generateKey,
  parser,
}: ICreateDataStoreParams<D, R>): IStore<D, R> => {
  /** 数据源 */
  const dataStore = new Map<string, IData<D, R>>();

  // TODO 转成 class
  /** 对插入的值做前序转化 */
  const dataTransformer = (data: IOriginData<D>): IData<D, R> => {
    let callbackRef: () => void;
    let resultValue: 

    const { deps } = parser(data.value);

    const setValue: IData<D>["setValue"] = (newValue) => {
      transformedData.value = newValue;
      const deps = getDepsValue(data).reduce((pre, cur) => {
        const depKey = generateKey(cur);
        pre[depKey] = cur.value;
        return pre;
      }, {} as Record<IKey, D>);

      onUpdate(transformedData, newValue, deps);
    };

    const onUpdate: IData<D, R>["onUpdate"] = (self, value, deps) => {
      /** 更新队列，后面优化可以用 */
      const updateQueue = [];

      const propagateUpdate = (curData: IData<D, R>) => {
        const dependents = Array.from(self.dependents).map(get);
        updateQueue.push(...dependents);
      };
    };

    const subscribe: IData<D, R>["subscribe"] = (callback) => {
      callbackRef = callback;
      const cancel = () => {};
      return cancel;
    };

    const getSnapshot: IData<D, R>["getSnapshot"] = () => {};

    const transformedData: IData<D, R> = {
      ...data,
      deps: new Set(...deps),
      dependents: new Set(),
      setValue,
      onUpdate,
      subscribe,
      getSnapshot,
    };

    return transformedData;
  };

  const get: IData<D, R>["get"] = (key) => {
    const target = dataStore.get(key);
    if (!target) {
      throw new Error(`Target not found on key ${key}`);
    }
    return target;
  };

  const getDepsValue = (data: IOriginData<D>) => {
    const { deps } = parser(data.value);
    const values = deps.map(get);
    return values;
  };

  const setDependents = () => {
    dataStore.forEach((value, key) => {
      const deps = value.deps;
      const dependents = Array.from(deps).map(get);
      dependents.forEach((dependent) => {
        dependent.dependents.add(key);
      });
    });
  };

  return {
    init: async (data) => {
      data.forEach((dataItem) => {
        const key = generateKey(dataItem);
        dataStore.set(key, dataTransformer(dataItem));
        setDependents();
      });
    },
    get,
    clear: () => {
      dataStore.clear();
    },
  };
};
