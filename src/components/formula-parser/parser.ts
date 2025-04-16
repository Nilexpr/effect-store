import { CstParser } from "chevrotain";
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
} from "./lexer";
import { GrammarEnum } from "./constants";

class FormulaParser extends CstParser {
  constructor() {
    super(allTokens);
    this.performSelfAnalysis();
  }

  [GrammarEnum.expression] = this.RULE(GrammarEnum.expression, () => {
    this.OR([
      {
        ALT: () => {
          this.SUBRULE(this.uminusExpression);
        },
      },
      {
        ALT: () => {
          this.SUBRULE(this.additionExpression);
        },
      },
    ]);
  });

  [GrammarEnum.uminusExpression] = this.RULE(
    GrammarEnum.uminusExpression,
    () => {
      this.CONSUME(Minus);
      this.SUBRULE(this.expression);
    }
  );

  [GrammarEnum.additionExpression] = this.RULE(
    GrammarEnum.additionExpression,
    () => {
      this.SUBRULE(this.multiplicationExpression, { LABEL: "lhs" });
      this.MANY(() => {
        this.CONSUME(AdditionOperator);
        this.SUBRULE2(this.multiplicationExpression, { LABEL: "rhs" });
      });
    }
  );

  [GrammarEnum.multiplicationExpression] = this.RULE(
    GrammarEnum.multiplicationExpression,
    () => {
      this.SUBRULE(this.atomicExpression, { LABEL: "lhs" });
      this.MANY(() => {
        this.CONSUME(MultiplicationOperator);
        this.SUBRULE2(this.atomicExpression, { LABEL: "rhs" });
      });
    }
  );

  [GrammarEnum.formulaExpression] = this.RULE(
    GrammarEnum.formulaExpression,
    () => {
      this.CONSUME(FormulaLiteral, { LABEL: "formula" });
      this.CONSUME(LParen);
      this.SUBRULE(this.commaExpression);
      this.CONSUME(RParen);
    }
  );

  [GrammarEnum.atomicExpression] = this.RULE(
    GrammarEnum.atomicExpression,
    () => {
      this.OR([
        { ALT: () => this.SUBRULE(this.parenthesisExpression) },
        { ALT: () => this.CONSUME(NumberLiteral) },
        { ALT: () => this.SUBRULE(this.formulaExpression) },
        { ALT: () => this.SUBRULE(this.referenceExpression) },
      ]);
    }
  );

  [GrammarEnum.parenthesisExpression] = this.RULE(
    GrammarEnum.parenthesisExpression,
    () => {
      this.CONSUME(LParen);
      this.SUBRULE(this.expression);
      this.CONSUME(RParen);
    }
  );

  [GrammarEnum.commaExpression] = this.RULE(GrammarEnum.commaExpression, () => {
    this.SUBRULE(this.expression, { LABEL: "lhs" });
    this.MANY(() => {
      this.CONSUME(Comma);
      this.SUBRULE2(this.expression, { LABEL: "rhs" });
    });
  });

  [GrammarEnum.referenceExpression] = this.RULE(
    GrammarEnum.referenceExpression,
    () => {
      this.CONSUME(ReferenceLiteral);
    }
  );
}

export const formulaParser = new FormulaParser();

export const defaultRuleName = "expression";
