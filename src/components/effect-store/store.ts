import { HashMap, Equal, Data } from "effect";
import type { IData, IStore } from "./interfaces/data";

/**
 * 创建一个 key value 的 Store，其中每条数据相互依赖，是一张图
 *
 * 当其中一个依赖更新时，更新所有的被依赖项
 */
export const createEffectStore = <
  K extends Equal.Equal,
  D extends IData<K, D>
>(): IStore<K, D> => {
  const storeMap = HashMap.empty<K, D>();

  return {
    get: (key) => {
      const res = HashMap.get(storeMap, Data.struct(key));
      return res;
    },
    insert: (key, data) => {
      const res = storeMap.pipe(HashMap.set(key, data));
      return res;
    },
    log: () => {
      console.log(storeMap.toJSON());
    },
  };
};
