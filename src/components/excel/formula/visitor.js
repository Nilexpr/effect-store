import { tokenMatcher } from 'chevrotain';
import { formulaParser } from './parser';
import _ from 'lodash';
import { Avg, Max, Min, Multi, NotNull, Plus, Sum } from './lexer';
import { getIndexes, letterToNumber } from './utils';
import Big from 'big.js';

const BaseCstVisitor = formulaParser.getBaseCstVisitorConstructor();

export class FormulaInterpreter extends BaseCstVisitor {
  isFactor = false;

  constructor(data) {
    super();
    this.data = data;
    this.validateVisitor();
  }

  visit(value, isFactor = false) {
    if (isFactor) {
      this.isFactor = isFactor;
    }
    return super.visit(value);
  }

  expression(ctx) {
    if (ctx.additionExpression) {
      return this.visit(ctx.additionExpression);
    } else {
      return this.visit(ctx.uminusExpression);
    }
  }

  uminusExpression(ctx) {
    const expRes = this.visit(ctx.expression);
    // console.log({
    //   expRes,
    //   test: Big(-1),
    // });
    if (expRes === '-') {
      return '-';
    }
    return Big(-1).mul(expRes);
  }

  additionExpression(ctx) {
    let result = this.visit(ctx.lhs);

    if (ctx.rhs) {
      ctx.rhs.forEach((rhsOperand, idx) => {
        const rhsValue = this.visit(rhsOperand);
        const operator = ctx.AdditionOperator[idx];

        if (rhsValue === '-' || result === '-') {
          result = '-';
          return '-';
        }

        if (tokenMatcher(operator, Plus)) {
          result = result?.add?.(rhsValue);
        } else {
          result = result?.sub?.(rhsValue);
        }
      });
    }

    return result;
  }

  multiplicationExpression(ctx) {
    let result = this.visit(ctx.lhs);
    if (ctx.rhs) {
      ctx.rhs.forEach((rhsOperand, idx) => {
        const rhsValue = this.visit(rhsOperand);
        const operator = ctx.MultiplicationOperator[idx];

        if (rhsValue === '-' || result === '-') {
          result = '-';
          return '-';
        }

        if (tokenMatcher(operator, Multi)) {
          result = result.mul(rhsValue);
        } else {
          result = result.div(rhsValue);
        }
      });
    }

    return result;
  }

  atomicExpression(ctx) {
    if (ctx.parenthesisExpression) {
      return this.visit(ctx.parenthesisExpression);
    } else if (ctx.NumberLiteral) {
      return parseFloat(ctx.NumberLiteral[0].image);
    } else if (ctx.formulaExpression) {
      return this.visit(ctx.formulaExpression);
    } else if (ctx.cellExpression) {
      return this.visit(ctx.cellExpression);
    }
  }

  parenthesisExpression(ctx) {
    return this.visit(ctx.expression);
  }

  formulaExpression(ctx) {
    // console.log({ ctx });
    const formula = ctx.formula[0];
    const commaExpression = ctx.commaExpression[0].children;
    // if (!this.data.hasOwnProperty(reference)) {
    //   throw new Error(`Unknown reference: ${reference}`);
    // }
    // console.log('commaExpression.lhs', commaExpression.lhs);
    const array = [this.visit(commaExpression.lhs)];
    if (commaExpression.rhs) {
      commaExpression.rhs.forEach((rhsOperand, idx) => {
        // there will be one operator for each rhs operand
        const rhsValue = this.visit(rhsOperand);
        array.push(rhsValue);
      });
    }
    // console.log({ array });
    // const values = this.data[reference];
    // if (values.length === 0) {
    //   throw new Error(`Empty reference: ${reference}`);
    // }
    if (tokenMatcher(formula, Min)) {
      return array.reduce((pre, cur) => {
        const curValue = typeof cur === 'number' ? Big(cur) : cur;
        if (pre === '-') {
          return curValue;
        }
        if (curValue.lt(pre)) {
          return curValue;
        }
        return pre;
      }, '-');
    }
    if (tokenMatcher(formula, Max)) {
      return array.reduce((pre, cur) => {
        const curValue = typeof cur === 'number' ? Big(cur) : cur;
        if (pre === '-') {
          return curValue;
        }
        if (curValue.gt(pre)) {
          return curValue;
        }
        return pre;
      }, '-');
    }
    if (tokenMatcher(formula, NotNull)) {
      return array.reduce((pre, cur) => {
        const curValue = typeof cur === 'number' ? Big(cur) : cur;
        if (pre === '-') {
          if (curValue.gt(0)) {
            return curValue;
          }
          return '-';
        }
        if (curValue.lt(pre)) {
          return curValue;
        }
        return pre;
      }, '-');
    }
  }

  cellExpression(ctx) {
    const image = ctx.ReferenceLiteral[0].image;
    // const RowIndex = Number(/[0-9]\d*/.exec(image)[0]) - 1;
    // const ColIndex = letterToNumber(/[A-Za-z]/.exec(image)[0]);
    const { RowIndex, ColIndex } = getIndexes(image);

    // return '-';
    // return `${RowIndex} ${ColIndex}`;
    // console.log({
    //   data: this.data,
    //   RowIndex,
    //   ColIndex,
    //   image,
    // });
    const res = this.data[RowIndex][ColIndex]?.getFactorValue?.() ?? {
      value: 0,
    };
    const { value } = res;
    if (this.isFactor && value === '-') {
      return Big(0);
    }
    if (value === '-') {
      return '-';
    }
    if (typeof value === 'number') {
      return Big(value);
    }
    return value;
  }

  commaExpression(ctx) {
    console.log('commaExpression', ctx);

    // TODO
    return [Big(999999), Big(999999)];
  }
}
