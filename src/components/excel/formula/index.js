import { FormulaLexer } from './lexer';
import { FormulaInterpreter } from './visitor';
import { defaultRuleName, formulaParser } from './parser';
import Big from 'big.js';

// export const parseFormula = (dataRef: Readonly<CellState[][]>) => {
export const parseFormula = (dataRef) => {
  const visitor = new FormulaInterpreter(dataRef);

  // const evaluate = (formula: string, isFactor = false): ReturnType<CellState['getFactorValue']> => {
  const evaluate = (formula, isFactor = false) => {
    const empty = '-';
    const lexResult = FormulaLexer.tokenize(formula);
    // console.log(formula, { lexResult });
    const factor = lexResult.tokens.find((value) => value.tokenType.name === 'NumberLiteral');
    // console.log({ factor });
    formulaParser.reset();
    formulaParser.input = lexResult.tokens;
    const value = formulaParser[defaultRuleName]();
    // if (formula === 'min(max(G5*0.05,33.56),202.77)') {
    //   debugger;
    // }
    if (formulaParser.errors.length > 0) {
      console.log('parse error', formulaParser.errors, lexResult, { formula });
      return { value: empty };
    }
    const result = visitor.visit(value, isFactor);
    const test = result?.toString?.();

    return { value: result, factor: factor && Big(factor?.image) };
  };

  return evaluate;
};
