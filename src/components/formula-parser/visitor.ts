import { GrammarEnum } from "./constants";
import { formulaParser } from "./parser";
import { CstNode } from "chevrotain";

const BaseCstVisitor = formulaParser.getBaseCstVisitorConstructor();

export class FormulaInterpreter<D, R> extends BaseCstVisitor {
  constructor(private data: [D, R?]) {
    super();
    this.validateVisitor();
  }

  visit(cstNode: CstNode | CstNode[]) {
    return super.visit(cstNode);
  }

  [GrammarEnum.expression](ctx) {}
}
