import { OperateType } from "./constants";

export type Calculate<D, R> = (...operands: Readonly<[D, R]>[]) => R;

export class CalculateHelper<D, R> {
  private customImplementations: Partial<Record<OperateType, Calculate<D, R>>> =
    {};

  constructor(
    private commonImplementations: Record<OperateType, Calculate<D, R>>
  ) {}

  registerMethods(
    implementations: Partial<Record<OperateType, Calculate<D, R>>>
  ): void {
    this.customImplementations = implementations;
  }

  clearMethods() {
    this.customImplementations = {};
  }

  compute(methodName: OperateType, ...args: Parameters<Calculate<D, R>>) {
    if (typeof this.customImplementations[methodName] === "function") {
      return this.customImplementations[methodName](...args);
    }

    if (typeof this.commonImplementations[methodName] === "function") {
      return this.commonImplementations[methodName](...args);
    }

    throw new Error(`Method ${methodName} not implemented`);
  }
}
