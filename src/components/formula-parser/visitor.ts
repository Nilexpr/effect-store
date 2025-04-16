import { GrammarEnum } from "./constants";
import { formulaParser } from "./parser";
import { CstNode } from "chevrotain";

const BaseCstVisitor = formulaParser.getBaseCstVisitorConstructor();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any;

export class FormulaInterpreter<D, R> extends BaseCstVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  private data?: D;
  private deps?: Record<string, Readonly<[D, R?]>>;

  init({ data, deps }: { data: D; deps: Record<string, Readonly<[D, R?]>> }) {
    this.data = data;
    this.deps = deps;
  }

  [GrammarEnum.expression](ctx: AnyType) {
    if (ctx.additionExpression) {
      return this.visit(ctx.additionExpression);
    } else {
      return this.visit(ctx.uminusExpression);
    }
  }

  [GrammarEnum.uminusExpression](ctx: AnyType) {}

  [GrammarEnum.additionExpression](ctx: AnyType) {}

  [GrammarEnum.multiplicationExpression](ctx: AnyType) {}

  [GrammarEnum.formulaExpression](ctx: AnyType) {}

  [GrammarEnum.atomicExpression](ctx: AnyType) {}

  [GrammarEnum.parenthesisExpression](ctx: AnyType) {}

  [GrammarEnum.commaExpression](ctx: AnyType) {}

  [GrammarEnum.referenceExpression](ctx: AnyType) {}
}
