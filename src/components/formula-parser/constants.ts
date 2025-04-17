export const enum GrammarEnum {
  /** 基础表达式 */
  expression = "expression",
  /** 加法表达式 */
  additionExpression = "additionExpression",
  /** 乘法表达式 */
  multiplicationExpression = "multiplicationExpression",
  /** 公式表达式 */
  formulaExpression = "formulaExpression",
  /** 原子表达式 */
  atomicExpression = "atomicExpression",
  /** 括号表达式 */
  parenthesisExpression = "parenthesisExpression",
  /** 引用外部变量 */
  referenceExpression = "referenceExpression",
}

/** 所有的操作类型，需要外部提供 */
export const enum OperateType {
  Plus,
  Minus,
  Multi,
  Div,
  Max,
  Min,
  Literal,
  Ref,
}
