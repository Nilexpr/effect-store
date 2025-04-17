import { createToken, Lexer } from "chevrotain";

export const AdditionOperator = createToken({
  name: "AdditionOperator",
  pattern: Lexer.NA,
});
export const Plus = createToken({
  name: "Plus",
  pattern: /\+/,
  categories: AdditionOperator,
});
export const Minus = createToken({
  name: "Minus",
  pattern: /-/,
  categories: AdditionOperator,
});

export const MultiplicationOperator = createToken({
  name: "MultiplicationOperator",
  pattern: Lexer.NA,
});
export const Multi = createToken({
  name: "Multi",
  pattern: /\*/,
  categories: MultiplicationOperator,
});
export const Div = createToken({
  name: "Div",
  pattern: /\//,
  categories: MultiplicationOperator,
});

export const LParen = createToken({ name: "LParen", pattern: /\(/ });
export const RParen = createToken({ name: "RParen", pattern: /\)/ });

export const NumberLiteral = createToken({
  name: "NumberLiteral",
  pattern: /(0|[1-9]\d*)(\.\d+)?/,
});

export const ReferenceLiteral = createToken({
  name: "ReferenceLiteral",
  pattern: /[a-z][a-z0-9_]*/,
});

export const FormulaLiteral = createToken({
  name: "FormulaLiteral",
  pattern: Lexer.NA,
});
export const Max = createToken({
  name: "Max",
  pattern: /MAX/i,
  categories: FormulaLiteral,
});
export const Min = createToken({
  name: "Min",
  pattern: /MIN/i,
  categories: FormulaLiteral,
});

export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const Comma = createToken({
  name: "Comma",
  pattern: /,/,
});

export const allTokens = [
  WhiteSpace,
  Plus,
  Minus,
  Multi,
  Div,
  LParen,
  RParen,
  Max,
  Min,
  NumberLiteral,
  Comma,
  AdditionOperator,
  MultiplicationOperator,
  FormulaLiteral,
  ReferenceLiteral,
];

export const formulaLexer = new Lexer(allTokens);
