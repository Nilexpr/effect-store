import i18n from "@/i18n";
import { createColumnHelper } from "@tanstack/react-table";
import { ExcelProps, ExcelState } from "../../interface/excel";
import { useMemo } from "react";
import {
  calIndexInRecursively,
  getCellByIndexRecursively,
} from "../../utils/calIndexRecursively";
import clsx from "clsx";

const columnHelper = createColumnHelper<ExcelState["data"][number]>();

export const useColColumns = ({
  colHeaders,
  rowHeaders,
  overallHeaderCell,
  renderCell,
  updater,
}: Omit<ExcelProps, "data"> & {
  updater: () => void;
}) => {
  const colColumns = useMemo(() => {
    return [
      columnHelper.display({
        id: "rowHeader",
        header: (props) => {
          // const handler = props.table.toggleAllRowsExpanded();
          return (
            <div className="flex flex-row gap-1 text-left text-[12px] font-normal leading-4 tracking-[0.5px] text-[#626265]">
              <div>{overallHeaderCell}</div>
              <button
                onClick={(e) => {
                  props.table.getToggleAllRowsExpandedHandler()?.(e);
                  updater?.();
                }}
                style={{
                  color: "rgb(22,165,175)",
                }}
              >
                {props.table.getIsAllRowsExpanded()
                  ? (i18n.t(
                      "bigdataoverseafront_useColColumns_columns.useColColumns.904853-0" /* 折叠 */
                    ) as string)
                  : (i18n.t(
                      "bigdataoverseafront_useColColumns_columns.useColColumns.907972-0" /* 展开 */
                    ) as string)}
              </button>
            </div>
          );
        },
        cell: ({ row }) => {
          // 待优化，和 id 其实只需要一个能定位就够了
          const rowIndex = row.index - 1;

          const rowDef = getCellByIndexRecursively(rowHeaders, rowIndex).target;

          const canExpand = row.getCanExpand();

          return (
            <div
              style={{
                paddingLeft: `${row.depth * 12}px`,
                fontWeight: canExpand ? "800" : "500",
                color:
                  rowDef?.depth === 1 ? "rgb(32, 32, 35)" : "rgb(98,98,101)",
                textAlign:
                  rowDef?.depth === 1 ? "left" : (rowDef.main as any)?.align,
              }}
              onClick={() => {
                row.getToggleExpandedHandler()?.();
                updater?.();
                console.log({
                  rowDef,
                });
              }}
              className={clsx(
                " cursor-pointer text-left text-[12px] font-medium leading-[16px] tracking-[0.5px] text-[#626265]",
                {
                  "text-[#202023]": canExpand,
                }
              )}
            >
              {/* <div>{JSON.stringify(rowDef)}</div> */}
              <div>{rowDef?.main.label}</div>
            </div>
          );
        },
      }),
      ...colHeaders.map((header, colIndex) => {
        if (header.children) {
          return columnHelper.group({
            id: `${header.main.label}__${colIndex}`,
            header: () => (
              <div className="text-center text-[12px] font-medium leading-4 tracking-[0.5px]">
                {header.main.label}
              </div>
            ),
            columns: header.children.map((subHeader) => {
              return columnHelper.accessor(
                (info) => {
                  const colIndex = calIndexInRecursively(
                    colHeaders,
                    subHeader.main
                  ).resIndex!;

                  return info[colIndex];
                },
                {
                  id: `${subHeader.main.label}__${colIndex}`,
                  header: () => {
                    return (
                      <div className="text-left text-[12px] font-normal leading-4 tracking-[0.5px]">
                        {subHeader.main.label}
                      </div>
                    );
                  },
                  cell: (info) => {
                    const cellValue = info.getValue();

                    if (!cellValue) {
                      // TODO
                      return <div>???</div>;
                    }

                    return <>{renderCell(cellValue)}</>;
                  },
                }
              );
            }),
          });
        }
        return columnHelper.accessor((info) => info[colIndex], {
          id: `${header.main.label}__${colIndex}`,
          header: () => {
            return <>{header.main.label}</>;
          },
          cell: (info) => {
            const cellValue = info.getValue();

            if (!cellValue) {
              // TODO
              return <div>???</div>;
            }

            return <>{renderCell(cellValue)}</>;
          },
        });
      }),
    ];
  }, [colHeaders, rowHeaders]);

  return colColumns;
};
