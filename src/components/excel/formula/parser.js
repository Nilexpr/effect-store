import { CstParser } from 'chevrotain';
import {
  AdditionOperator,
  allTokens,
  FormulaLiteral,
  LParen,
  Minus,
  MultiplicationOperator,
  NumberLiteral,
  RParen,
  Comma,
  ReferenceLiteral,
} from './lexer';

class FormulaParser extends CstParser {
  constructor() {
    super(allTokens);

    const $ = this;

    $.RULE('expression', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.uminusExpression) },
        { ALT: () => $.SUBRULE($.additionExpression) },
      ]);
    });

    $.RULE('uminusExpression', () => {
      $.CONSUME(Minus);
      $.SUBRULE($.expression);
    });

    $.RULE('additionExpression', () => {
      $.SUBRULE($.multiplicationExpression, { LABEL: 'lhs' });
      $.MANY(() => {
        $.CONSUME(AdditionOperator);
        $.SUBRULE2($.multiplicationExpression, { LABEL: 'rhs' });
      });
    });

    $.RULE('multiplicationExpression', () => {
      $.SUBRULE($.atomicExpression, { LABEL: 'lhs' });
      $.MANY(() => {
        $.CONSUME(MultiplicationOperator);
        $.SUBRULE2($.atomicExpression, { LABEL: 'rhs' });
      });
    });

    $.RULE('formulaExpression', () => {
      $.CONSUME(FormulaLiteral, { LABEL: 'formula' });
      $.CONSUME(LParen);
      $.SUBRULE($.commaExpression);
      $.CONSUME(RParen);
    });

    $.RULE('atomicExpression', () =>
      $.OR([
        // parenthesisExpression has the highest precedence and thus it appears
        // in the "lowest" leaf in the expression ParseTree.
        { ALT: () => $.SUBRULE($.parenthesisExpression) },
        { ALT: () => $.CONSUME(NumberLiteral) },
        { ALT: () => $.SUBRULE($.formulaExpression) },
        { ALT: () => $.SUBRULE($.cellExpression) },
      ]),
    );

    $.RULE('parenthesisExpression', () => {
      $.CONSUME(LParen);
      $.SUBRULE($.expression);
      $.CONSUME(RParen);
    });

    $.RULE('commaExpression', () => {
      $.SUBRULE($.multiplicationExpression, { LABEL: 'lhs' });
      // $.OR([
      //   // parenthesisExpression has the highest precedence and thus it appears
      //   // in the "lowest" leaf in the expression ParseTree.
      //   { ALT: () => $.CONSUME(NumberLiteral) },
      //   { ALT: () => $.SUBRULE($.cellExpression, { LABEL: 'lhs' }) },
      //   // { ALT: () => $.SUBRULE($.formulaExpression) },
      //   // { ALT: () => $.SUBRULE($.cellExpression) },
      // ]);
      $.MANY(() => {
        $.CONSUME(Comma);
        // $.OR([
        //   // parenthesisExpression has the highest precedence and thus it appears
        //   // in the "lowest" leaf in the expression ParseTree.
        //   { ALT: () => $.CONSUME(NumberLiteral) },
        //   { ALT: () => $.SUBRULE2($.cellExpression, { LABEL: 'rhs' }) },
        //   // { ALT: () => $.SUBRULE($.formulaExpression) },
        //   // { ALT: () => $.SUBRULE($.cellExpression) },
        // ]);
        $.SUBRULE2($.multiplicationExpression, { LABEL: 'rhs' });
      });
    });

    $.RULE('cellExpression', () => {
      // $.CONSUME($.referenceExpression);
      $.CONSUME(ReferenceLiteral);
    });

    // $.RULE('referenceExpression', () => {
    //   $.SUBRULE($.rowIndexExpression);
    //   $.SUBRULE2($.colIndexExpression);
    // });

    // $.RULE('rowIndexExpression', () => {
    //   $.CONSUME(RowIndex);
    // });

    // $.RULE('colIndexExpression', () => {
    //   $.CONSUME(ColIndex);
    // });

    this.performSelfAnalysis();
  }
}

export const formulaParser = new FormulaParser();

export const defaultRuleName = 'expression';
