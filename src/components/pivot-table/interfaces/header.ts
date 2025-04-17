import type { Recursively } from "./tool";

export interface Header {
  /** 表头 */
  label: React.ReactNode;
  /** 唯一 Key */
  key: React.Key;
  align?: string;
}

export type RowHeader = Recursively<Header>[];

export type ColHeader = Recursively<Header>[];
