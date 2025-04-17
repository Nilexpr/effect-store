import { ComponentScope, molecule } from 'bunshi';
import { ExcelState } from '../interface/excel';
import { proxy } from 'valtio/vanilla';

export const ExcelMolecule = molecule((mol, scope) => {
  scope(ComponentScope);

  const dataProxy = proxy<ExcelState>({
    rowHeaders: [],
    colHeaders: [],
    data: [],
  });

  return {
    dataProxy,
  };
});
