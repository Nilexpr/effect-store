import {
  ExpandedState,
  getExpandedRowModel,
  TableOptions,
} from "@tanstack/react-table";
import { useMolecule } from "bunshi/react";
import { ExcelMolecule } from "../data";
import { ExcelProps, ExcelState } from "../interface/excel";
import { useSnapshot } from "valtio";
import { useColColumns } from "./columns/useColColumns";
import { useGetSubRows } from "./useGetSubRows";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { getCoreRowModel } from "../utils/getCoreRowModel";
import { parseFormula } from "../formula";
import Big from "big.js";
import { Empty } from "../interface/tool";
import { FormulaLexer } from "../formula/lexer";
import { getIndexes } from "../formula/utils";
import { CellState } from "../interface/cell";

export const useTableConfig = (
  props: ExcelProps,
  setIsEdited: Dispatch<SetStateAction<boolean>>,
  setRefresh: () => void,
  updater: () => void
): TableOptions<ExcelState["data"][number]> => {
  const { dataProxy } = useMolecule(ExcelMolecule);
  const data = useSnapshot(dataProxy).data;
  const dataRef = useRef(data);
  dataRef.current = data;

  const colColumns = useColColumns({ ...props, updater });

  useEffect(() => {
    dataProxy.colHeaders = props.colHeaders;
    // setRefresh();
  }, [props.colHeaders]);

  useEffect(() => {
    dataProxy.rowHeaders = props.rowHeaders;
    // setRefresh();
  }, [props.rowHeaders]);

  useEffect(() => {
    dataProxy.data = [
      ...props.data.map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
          const { value, ...rest } = cell ?? ({} as any);
          const cellValue = value !== "-" ? { value: Big(value) } : {};
          return {
            ...cellValue,
            ...rest,
            getFactorValue: () => {
              // TODO 性能优化
              const parser = parseFormula(dataProxy.data);
              const target = dataProxy.data[rowIndex][colIndex];
              if (target.type === "state") {
                const target = dataRef.current?.[rowIndex][colIndex];
                return { value: target.value ? target.value : ("-" as Empty) };
              }

              const tokens = FormulaLexer.tokenize(target.formula);
              const deps = tokens.tokens
                .filter((token) => {
                  return token.tokenType.name === "ReferenceLiteral";
                })
                .map((token) => {
                  return {
                    ...getIndexes(token.image),
                    reference: token.image,
                  };
                });
              const circleDeps = deps.some((dep) => {
                if (dep.ColIndex === colIndex && dep.RowIndex === rowIndex) {
                  return true;
                }
              });

              if (circleDeps) {
                console.error("circle deps detect", target.formula, {
                  rowIndex,
                  colIndex,
                });
                return {
                  value: "-" as Empty,
                };
              }

              const res = parser(target.formula, true) as ReturnType<
                CellState["getFactorValue"]
              >;
              return res;
            },
            getDeps: () => {
              if (cell.type === "state") {
                return {
                  deps: [],
                  targets: [],
                };
              }

              const tokens = FormulaLexer.tokenize(cell.formula);
              const deps = tokens.tokens
                .filter((token) => {
                  return token.tokenType.name === "ReferenceLiteral";
                })
                .map((token) => {
                  return {
                    ...getIndexes(token.image),
                    reference: token.image,
                  };
                });

              const targets = deps.map((dep) => {
                return dataRef.current?.[dep.RowIndex][dep.ColIndex];
              });

              return {
                deps,
                targets,
              };
            },
            setFactorValue: async (value: Big.Big) => {
              if (cell.type !== "state") {
                console.error("Set Value on Non State var");
                return;
              }
              setIsEdited(true);
              const target = dataProxy.data[rowIndex][colIndex];
              target.value = value;
            },
            setFormula: async (value: string) => {
              if (cell.type !== "computed") {
                console.error("setFormula on Non Formula var", {
                  rowIndex,
                  colIndex,
                });
                return;
              }
              console.log({
                rowIndex,
                colIndex,
              });
              setIsEdited(true);
              const target = dataProxy.data[rowIndex][colIndex];
              (target as any).formula = value;
              console.log(target);

              if (colIndex === 1 && rowIndex === 6) {
                const factor = /\b\d+(\.\d+)?\b/.exec(value)?.[0];
                const target = dataProxy?.data?.[6]?.[4];
                const formula = (target as any)?.formula;
                if (!factor || !formula) {
                  return;
                }
                console.log({
                  res: formula.replace(/\b\d+(\.\d+)?\b/, factor),
                  factor,
                });
                (target as any).formula = formula.replace(
                  /\b\d+(\.\d+)?\b/,
                  factor
                );
              }
              if (colIndex === 1 && rowIndex === 7) {
                const factor = /\b\d+(\.\d+)?\b/.exec(value)?.[0];
                const target = dataProxy?.data?.[7]?.[4];
                const formula = (target as any)?.formula;
                if (!factor || !formula) {
                  return;
                }
                console.log({
                  res: formula.replace(/\b\d+(\.\d+)?\b/, factor),
                  factor,
                });
                (target as any).formula = formula.replace(
                  /\b\d+(\.\d+)?\b/,
                  factor
                );
              }
            },
            getOriginCell: () => {
              return cell;
            },
            setAttr: (key: string, value: any) => {
              const target = dataProxy.data[rowIndex][colIndex];
              target[key] = value;
            },
            rowIndex,
            colIndex,
          };
        });
      }),
    ];
    // setRefresh();
  }, [props.data]);

  const getSubRows = useGetSubRows({
    data,
    rowHeaders: props.rowHeaders,
  });

  const [expanded, setExpanded] = useState<ExpandedState>({});

  return {
    data,
    columns: colColumns,
    getSubRows,
    getCoreRowModel: getCoreRowModel(props.rowHeaders),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId(originalRow, index) {
      return `${index}`;
    },
    // debugTable: true,
    state: {
      expanded,
    },
    getIsRowExpanded: (row) => {
      if (row.parentId || !row.originalSubRows) return true;
      return expanded === true || expanded?.[row.id];
    },
    onExpandedChange: setExpanded,
  };
};
