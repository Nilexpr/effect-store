import {
  ICreateDataStoreParams,
  IOriginData,
  IStore,
} from "../interfaces/data";

export const getDepsValue = <D, R>(
  data: IOriginData<D>,
  parser: ICreateDataStoreParams<D, R>["parser"],
  get: IStore<D, R>["get"]
) => {
  const { deps } = parser(data.value);
  const values = deps.map(get);
  return values;
};
