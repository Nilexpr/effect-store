import { Header, RowHeaders } from "../interfaces/header";
import { Recursively } from "../interfaces/tool";

// 寻找行表头中指定位置的表头
export const getRowHeaderFromIndex = ({
  index,
  depth,
  rowHeaders,
}: {
  index: number;
  depth: number,
  rowHeaders: RowHeaders;
}) => {
  const targetHeader = rowHeaders.reduce((remain, header) => {
    if (typeof remain !== "number") {
      return remain;
    }

    if (header.children) {
      return header.children.reduce((subRemain, child) => {
        if (typeof subRemain !== "number") {
          return subRemain;
        }
        if (subRemain === 0) {
          if (depth === 1) {
            return child
          }
          return header;
        }
        return subRemain - 1;
      }, remain as number | Recursively<Header>);
    }
    if (remain === 0) {
      return header;
    }
    return remain - 1;
  }, index as number | Recursively<Header>);


  if (typeof targetHeader === 'number') {
    throw new Error('target not found')
  }

  return targetHeader;
};
