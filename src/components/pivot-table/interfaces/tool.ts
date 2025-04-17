/** 可递归的 */
export interface Recursively<T> {
  main: T;
  children?: Recursively<T>[];
}

/** 可递归的 */
export interface RecursivelyWithDepth<T> {
  main: T;
  depth: number;
  children?: Recursively<T>[];
}
