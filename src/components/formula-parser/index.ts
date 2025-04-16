export const parseFormula = <D, R>(): ((
  data: D,
  deps: Record<string, Readonly<[D, R?]>>
) => R) => {
  return (data, deps) => {
    console.log("create evaluate", data, deps);
    return null as R;
  };
};
