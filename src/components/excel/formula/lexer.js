import { createToken, Lexer } from 'chevrotain';

// actual Tokens that can appear in the text
export const AdditionOperator = createToken({
  name: 'AdditionOperator',
  pattern: Lexer.NA,
});
export const Plus = createToken({
  name: 'Plus',
  pattern: /\+/,
  categories: AdditionOperator,
});
export const Minus = createToken({
  name: 'Minus',
  pattern: /-/,
  categories: AdditionOperator,
});

export const MultiplicationOperator = createToken({
  name: 'MultiplicationOperator',
  pattern: Lexer.NA,
});
export const Multi = createToken({
  name: 'Multi',
  pattern: /\*/,
  categories: MultiplicationOperator,
});
export const Div = createToken({
  name: 'Div',
  pattern: /\//,
  categories: MultiplicationOperator,
});

export const LParen = createToken({ name: 'LParen', pattern: /\(/ });
export const RParen = createToken({ name: 'RParen', pattern: /\)/ });

export const NumberLiteral = createToken({
  name: 'NumberLiteral',
  pattern: /(0|[1-9]\d*)(\.\d+)?/,
});

export const ReferenceLiteral = createToken({
  name: 'ReferenceLiteral',
  pattern: /[A-Za-z]+[0-9]\d*/,
});

export const RowIndex = createToken({
  name: 'RowIndex',
  pattern: /[A-Za-z]/,
});

export const ColIndex = createToken({
  name: 'ColIndex',
  pattern: /0|[1-9]\d*/,
});

export const FormulaLiteral = createToken({
  name: 'FormulaLiteral',
  pattern: Lexer.NA,
});
export const Sum = createToken({
  name: 'Sum',
  pattern: /SUM/i,
  categories: FormulaLiteral,
});
export const Avg = createToken({
  name: 'Avg',
  pattern: /AVG/i,
  categories: FormulaLiteral,
});
export const Max = createToken({
  name: 'Max',
  pattern: /MAX/i,
  categories: FormulaLiteral,
});
export const Min = createToken({
  name: 'Min',
  pattern: /MIN/i,
  categories: FormulaLiteral,
});

export const NotNull = createToken({
  name: 'NotNull',
  pattern: /NotNull/i,
  categories: FormulaLiteral,
});

// marking WhiteSpace as 'SKIPPED' makes the lexer skip it.
export const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const Comma = createToken({
  name: 'Comma',
  pattern: /,/,
});

export const allTokens = [
  WhiteSpace, // whitespace is normally very common so it should be placed first to speed up the lexer's performance
  Plus,
  Minus,
  Multi,
  Div,
  LParen,
  RParen,
  Sum,
  Avg,
  Max,
  Min,
  NotNull,
  // RowIndex,
  // ColIndex,
  NumberLiteral,
  Comma,
  AdditionOperator,
  MultiplicationOperator,
  FormulaLiteral,
  ReferenceLiteral,
];

export const FormulaLexer = new Lexer(allTokens);
