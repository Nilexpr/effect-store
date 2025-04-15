import type { IData, IStore } from "./interfaces/data";

/**
 * 创建一个 key value 的 Store，其中每条数据相互依赖，是一张图
 *
 * 当其中一个依赖更新时，更新所有的被依赖项
 */
export const createDataStore = <D extends IData<D>>(): IStore<D> => {
  const dataStore = new Map<string, IData<D>>();

  return {
    init: () => {},
  };
};
