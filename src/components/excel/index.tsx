import { ExcelProps, ExcelRef, ExcelState } from './interface/excel';
import { useTableConfig } from './hooks/useTableConfig';
import { flexRender, useReactTable } from '@tanstack/react-table';
import { useMethods } from './hooks/useMethods';
import clsx from 'clsx';
import './style.scss';
import { fixedForwardRef } from './interface/forwardRef';
import { ForwardedRef, Fragment, useEffect, useState } from 'react';
import { Spin } from 'antd';
import { getUUID } from '@/utils';
import { useFilterContext } from '@react/pages/competitive-profit-calculation/hooks/context';
import { useUpdate } from 'ahooks';

const isDebug = localStorage.getItem('isDebug');

const Excel = <S extends object, C extends object, T extends object>(
  props: ExcelProps<S, C, T>,
  ref: ForwardedRef<ExcelRef<S, C, T>>,
) => {
  const [isEdited, setIsEdited] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (refresh) {
      setRefresh(false);
    }
  }, [refresh]);

  // 这里只是为了拿到所有卡片的刷新信息
  const filterCtx = useFilterContext();

  const config = useTableConfig(props, setIsEdited, () => setRefresh(true), filterCtx.updater);
  const table = useReactTable<ExcelState<S, C, T>['data'][number]>(config);

  const { loading } = useMethods(ref, { props, table, data: config.data, isEdited, setIsEdited });

  return (
    <Spin spinning={loading}>
      {isDebug && (
        <div
          onClick={() => {
            console.log(config);
            console.log('HeaderGroup', table.getHeaderGroups());
            console.log('data', config.data);
          }}
        >
          表头信息
        </div>
      )}
      {/* <div>EDITED?: {JSON.stringify(isEdited)}</div> */}
      <table className={clsx('custom-excel--table', 'border-collapse')}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                      )}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell, colIndex) => {
                  if (colIndex === 0) {
                    return (
                      <th key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </th>
                    );
                  }

                  return (
                    <Fragment key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Fragment>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Spin>
  );
};

export const ForwardExcel = fixedForwardRef(Excel);
