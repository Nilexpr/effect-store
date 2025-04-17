import { FC, useCallback, useState, useSyncExternalStore } from "react";
import { createDataStore } from "./components/data-store/store";
import "./components/formula-parser";

type Data = {
  value: string;
  formula?: string;
  res?: number;
};

const dataStore = createDataStore<Data, string>({
  generateKey(data) {
    return data.value;
  },
  parser(data) {
    return {
      deps: (data.formula?.split("+") ?? []).filter((item) =>
        /^[a-zA-Z]$/.test(item)
      ),
      evaluate(data, deps) {
        // return data.value + JSON.stringify(deps);
        if (data.res) {
          return String(data.res);
        }
        if (data.formula) {
          const value = data.formula
            .split("+")
            .map((item) => {
              if (/^[a-zA-Z]$/.test(item)) {
                return deps[item];
              }
              return Number(item);
            })
            .reduce((pre: number, cur) => {
              if (typeof cur === "number") {
                return pre + cur;
              }
              const [_, res] = cur;
              if (!res) {
                return pre;
              }
              return pre + Number(res);
            }, 0);

          return String(value);
        }
        return "";
      },
    };
  },
});

dataStore.init(
  [
    {
      value: "a",
      formula: "b+c",
    },
    {
      value: "b",
      formula: "c+1",
    },
    {
      value: "c",
      res: 3,
    },
    {
      value: "d",
      res: 4,
    },
    {
      value: "e",
      formula: "c+d",
    },
    {
      value: "f",
      formula: "e+a",
    },
    {
      value: "g",
      formula: "f+a",
    },
  ].reverse()
);

const Item: FC<{ dataKey: string }> = ({ dataKey }) => {
  const itemCfg = dataStore.get(dataKey);

  const originData = itemCfg.getOriginData();

  const subscribe = useCallback(itemCfg.subscribe.bind(itemCfg), [
    itemCfg.subscribe,
  ]);

  const result = useSyncExternalStore(
    subscribe,
    itemCfg.getSnapshot.bind(itemCfg)
  );

  if (result === null) {
    return "空的";
  }
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      <div>{dataKey}</div>
      <input
        placeholder="TODO"
        value={result}
        onChange={(e) => {
          itemCfg.onChange.bind(itemCfg)((cur) => {
            return {
              ...cur,
              res: e.target.value,
            };
          });
        }}
      ></input>
      <div>{originData.formula}</div>
    </div>
  );
};

function App() {
  const keys = dataStore.getKeys();
  const [update, setUpdate] = useState({});
  return (
    <section style={{ display: "flex", gap: "2px", flexDirection: "column" }}>
      <div
        onClick={() => {
          setUpdate({});
          console.log(dataStore);
        }}
      >
        View
      </div>
      {keys.map((key) => {
        return <Item dataKey={key} key={key}></Item>;
      })}
    </section>
  );
}

export default App;
