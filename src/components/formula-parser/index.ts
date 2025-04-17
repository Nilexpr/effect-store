import { Calculate, CalculateHelper } from "./calculator";
import { OperateType } from "./constants";
import { formulaLexer } from "./lexer";
import { defaultRuleName, formulaParser } from "./parser";
import { getVisitorClass } from "./visitor";

export const parseFormula = <D, R>(
  formula: string,
  commonImplementations: Record<OperateType, Calculate<D, R>>
): ((
  data: D,
  deps: Record<string, Readonly<[D, R]>>,
  customImplementations?: Partial<Record<OperateType, Calculate<D, R>>>
) => R) => {
  const calculateHelper = new CalculateHelper(commonImplementations);

  const FormulaVisitor = getVisitorClass<D, R>();

  const lexResult = formulaLexer.tokenize(formula);

  formulaParser.reset();
  formulaParser.input = lexResult.tokens;

  const parseResult = formulaParser[defaultRuleName]();

  if (formulaParser.errors.length) {
    console.log(`parse error on ${formula}`, formulaParser.errors);
  }

  return (data, deps, customImplementations) => {
    calculateHelper.registerMethods(customImplementations ?? {});

    const visitor = new FormulaVisitor();
    const result = visitor.visit(parseResult, [data, deps, calculateHelper]);

    calculateHelper.clearMethods();

    return result?.[1];
  };
};

const calculateMethods: Record<OperateType, Calculate<number, number>> = {
  [OperateType.Plus]: (a, b) => {
    return a[1] + b[1];
  },
  [OperateType.Minus]: (a, b) => {
    return a[1] - b[1];
  },
  [OperateType.Multi]: (a, b) => {
    return a[1] * b[1];
  },
  [OperateType.Div]: (a, b) => {
    return a[1] / b[1];
  },
  [OperateType.Max]: (a, b) => {
    return a[1] > b[1] ? a[1] : b[1];
  },
  [OperateType.Min]: (a, b) => {
    return a[1] < b[1] ? a[1] : b[1];
  },
  [OperateType.Literal]: (a) => {
    if (typeof a[1] === "string") {
      return Number(a[1]);
    }
    return a[1];
  },
  [OperateType.Ref]: (a) => {
    return a[1];
  },
};

const parser = parseFormula<number, number>(
  "MIN(1 , a / b /b)",
  calculateMethods
);

const res = parser(1, {
  a: [1, 2],
  b: [3, 4],
});

console.log({ res });
