import type { Recursively } from "./tool";
import { HTMLAttributes } from "react";

export interface Header {
  /** 表头 */
  label: React.ReactElement<HTMLAttributes<HTMLTableCellElement>>;
  // label: React.ReactElement;
  /** 唯一 Key */
  key: string;
  align?: string;
}

export type RowHeaders = Recursively<Header>[];

export type ColHeaders = Recursively<Header>[];
