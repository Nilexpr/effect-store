import { ValidateError, ValidateFieldsError } from 'async-validator';

/** 可递归的 */
export interface Recursively<T> {
  main: T;
  depth?: number;
  children?: Recursively<T>[];
}

export type CustomValidateError = {
  errors: ValidateError[];
  fields: ValidateFieldsError;
};

export type Empty = '-';

export type BigOrEmpty = Big.Big | Empty;
