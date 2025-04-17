import Schema, { Rules } from 'async-validator';
import { CellState } from '../interface/cell';

const cellDescriptor: Rules = {
  value: {
    type: 'any',
    asyncValidator: (rule, value: CellState['value']) => {
      // console.log('asyncValidator', value);
      return new Promise((resolve, reject) => {
        if (typeof value === 'string') {
          resolve();
        }
        if (typeof value === 'number') {
          if (value < 18) {
            reject('too young');
          } else {
            resolve();
          }
        }
      });
    },
  },
};

const cellValidator = new Schema(cellDescriptor);

export { cellValidator };
