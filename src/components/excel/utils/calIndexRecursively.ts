import { Recursively } from '../interface/tool';

type IndexObj = {
  curIndex: number;
  resIndex: number | null;
};

/** 从递归数组中找到对应项的下标 */
export const calIndexInRecursively = <T extends { isPlaceholder?: boolean }>(
  baseArr: Recursively<T>[],
  target: T,
  indexConfig = {
    curIndex: 0,
    resIndex: null,
  } as IndexObj,
): IndexObj => {
  const res = baseArr.reduce(
    (pre, cur) => {
      if (pre.resIndex !== null) {
        return pre;
      }

      if (cur.main === target && !cur.main.isPlaceholder) {
        return { curIndex: pre.curIndex, resIndex: pre.curIndex };
      }

      if (!cur.children) {
        return {
          curIndex: cur.main.isPlaceholder ? pre.curIndex : pre.curIndex + 1,
          resIndex: null,
        };
      }
      const subRes = calIndexInRecursively(cur.children, target, {
        curIndex: cur.main.isPlaceholder ? pre.curIndex : pre.curIndex + 1,
        resIndex: null,
      });
      return subRes;
    },
    { ...indexConfig },
  );

  return res;
};

type TargetObj<T> = {
  curIndex: number;
  target: Recursively<T> | null;
  depth: number;
};

/** 从下标中拿到递归数组中的对应项 */
export const getCellByIndexRecursively = <T extends { isPlaceholder?: boolean }>(
  baseArr: Recursively<T>[],
  targetIndex: number,
  config = {
    curIndex: 0,
    target: null,
    depth: 0,
  } as TargetObj<T>,
): TargetObj<T> => {
  const res = baseArr.reduce(
    (pre, cur) => {
      if (pre.target !== null) {
        return pre;
      }

      if (pre.curIndex === targetIndex && !cur.main.isPlaceholder) {
        return {
          curIndex: targetIndex,
          target: cur,
          depth: config.depth,
        };
      }

      if (!cur.children) {
        return {
          curIndex: cur.main.isPlaceholder ? pre.curIndex : pre.curIndex + 1,
          target: null,
          depth: config.depth,
        };
      }

      return getCellByIndexRecursively(cur.children, targetIndex, {
        curIndex: cur.main.isPlaceholder ? pre.curIndex : pre.curIndex + 1,
        target: null,
        depth: config.depth + 1,
      });
    },
    { ...config },
  );

  return res;
};

// const arr: Recursively<{
//   label: number;
// }>[] = [
//   {
//     main: { label: 1 },
//   },
//   {
//     main: { label: 2 },
//     children: [
//       { main: { label: 3 } },
//       { main: { label: 4 } },
//       { main: { label: 5 } },
//     ],
//   },
//   {
//     main: { label: 6 },
//   },
// ];

// console.log('getCellByIndexRecursively', getCellByIndexRecursively(arr, 2));
