import { CstNode, IToken, tokenMatcher } from "chevrotain";
import { CalculateHelper } from "./calculator";
import { GrammarEnum, OperateType } from "./constants";
import { formulaParser } from "./parser";
import { Max, Min, Multi, Plus } from "./lexer";

type Ctx<D, R> = [D, Record<string, Readonly<[D, R]>>, CalculateHelper<D, R>];

export const getVisitorClass = <D, R>() => {
  const BaseCstVisitor = formulaParser.getBaseCstVisitorConstructor<
    Ctx<D, R>,
    [D, R]
  >();

  return class FormulaInterpreter extends BaseCstVisitor {
    constructor() {
      super();
      this.validateVisitor();
    }

    [GrammarEnum.expression](ctx: CstNode["children"], args: Ctx<D, R>) {
      // console.log("expression", { ctx, args });
      return this.visit(ctx.additionExpression[0] as CstNode, args);
    }

    [GrammarEnum.additionExpression](
      ctx: CstNode["children"],
      args: Ctx<D, R>
    ) {
      // console.log("additionExpression", {
      //   ctx,
      //   args,
      // });
      let result = this.visit(ctx.lhs[0] as CstNode, args);

      if (ctx.rhs) {
        ctx.rhs.forEach((rhsOperand, idx) => {
          // console.log("rhsOperand", rhsOperand);
          const rhsValue = this.visit(rhsOperand as CstNode, args);
          const operator = ctx.AdditionOperator[idx] as IToken;

          if (tokenMatcher(operator, Plus)) {
            result = [
              args[0],
              args[2].compute(OperateType.Plus, result, rhsValue),
            ];
          } else {
            result = [
              args[0],
              args[2].compute(OperateType.Minus, result, rhsValue),
            ];
          }
        });
      }

      return result;
    }

    [GrammarEnum.multiplicationExpression](
      ctx: CstNode["children"],
      args: Ctx<D, R>
    ) {
      let result = this.visit(ctx.lhs[0] as CstNode, args);

      if (ctx.rhs) {
        ctx.rhs.forEach((rhsOperand, idx) => {
          const rhsValue = this.visit(rhsOperand as CstNode, args);
          const operator = ctx.MultiplicationOperator[idx];

          if (tokenMatcher(operator as IToken, Multi)) {
            result = [
              args[0],
              args[2].compute(OperateType.Multi, result, rhsValue),
            ];
          } else {
            result = [
              args[0],
              args[2].compute(OperateType.Div, result, rhsValue),
            ];
          }
        });
      }

      return result;
    }

    [GrammarEnum.formulaExpression](ctx: CstNode["children"], args: Ctx<D, R>) {
      // console.log("formulaExpression", { ctx, args });
      const formula = ctx.formula[0] as IToken;
      if (tokenMatcher(formula, Min)) {
        return ctx.rhs.reduce((pre, cur) => {
          if ("name" in cur) {
            const curValue = this.visit(cur, args);
            if (!pre) {
              return curValue;
            }
            const a = args[2].compute(OperateType.Min, pre, curValue);
            return [args[0], a] as const;
          }
          const curValue = args[2].compute(OperateType.Literal, [
            cur.image as D,
            cur.image as R,
          ]);
          if (!pre) {
            return [args[0], curValue];
          }
          const a = args[2].compute(OperateType.Min, pre, [args[0], curValue]);
          return a;
        }, null as null | [D, R]);
      }
      if (tokenMatcher(formula, Max)) {
        return ctx.rhs.reduce((pre, cur) => {});
      }
      // return this.calculateHelper.compute(OperateType.Uminus, this.);
    }

    [GrammarEnum.atomicExpression](ctx: CstNode["children"], args: Ctx<D, R>) {
      // console.log("atomicExpression", { ctx, args });
      if (ctx.parenthesisExpression) {
        return this.visit(ctx.parenthesisExpression[0] as CstNode, args);
      } else if (ctx.NumberLiteral) {
        const token = ctx.NumberLiteral[0] as IToken;
        const res = args[2].compute(OperateType.Literal, [
          token.image as D,
          token.image as R,
        ]);
        return [res, res];
      } else if (ctx.referenceExpression) {
        // console.log("ctx.referenceExpression", ctx.referenceExpression);
        return this.visit(ctx.referenceExpression[0] as CstNode, args);
      } else if (ctx.formulaExpression) {
        return this.visit(ctx.formulaExpression[0] as CstNode, args);
      }
      // return this.calculateHelper.compute(OperateType.Uminus, this.);
    }

    [GrammarEnum.parenthesisExpression](
      ctx: CstNode["children"],
      args: Ctx<D, R>
    ) {
      // console.log("parenthesisExpression", { ctx, args });
      return this.visit(ctx.expression[0] as CstNode, args);
      // return this.calculateHelper.compute(OperateType.Uminus, this.);
    }

    [GrammarEnum.referenceExpression](
      ctx: CstNode["children"],
      args: Ctx<D, R>
    ) {
      // console.log("referenceExpression", { ctx, args });
      const key = (ctx.ReferenceLiteral[0] as IToken).image;
      const depValue = args[1][key];

      if (!depValue) {
        console.error(`reference error on ${key}`, { ctx, args });
      }

      return depValue;
    }
  };
};
