import { formulaLexer } from "./lexer";
import { defaultRuleName, formulaParser } from "./parser";
import { FormulaInterpreter } from "./visitor";

const formulaInterpreter = new FormulaInterpreter();

export const parseFormula = <D, R>(
  formula: string
): ((data: D, deps: Record<string, Readonly<[D, R?]>>) => R) => {
  const lexResult = formulaLexer.tokenize(formula);

  formulaParser.reset();
  formulaParser.input = lexResult.tokens;
  const parseResult = formulaParser[defaultRuleName]();

  if (formulaParser.errors) {
    console.log(`parse error on ${formula}`);
  }

  return (data, deps) => {
    formulaInterpreter.init({ data, deps });

    console.log("create evaluate", data, deps);
    return null as R;
  };
};
