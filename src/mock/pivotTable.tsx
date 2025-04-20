import { uniqueId } from "lodash";
import {
  ColHeaders,
  RowHeaders,
} from "../components/pivot-table/interfaces/header";

export const rowHeader: RowHeaders = [
  {
    main: {
      label: <th>1</th>,
      key: uniqueId(),
    },
  },
  {
    main: {
      label: <th>2</th>,
      key: uniqueId(),
    },
  },
  {
    main: {
      label: <th>3</th>,
      key: uniqueId(),
    },
    children: [
      {
        main: {
          label: <th>3-1</th>,
          key: uniqueId(),
        },
      },
      {
        main: {
          label: <th>3-2</th>,
          key: uniqueId(),
        },
      },
    ],
  },
];

export const colHeader: ColHeaders = [
  {
    main: {
      label: <th>1</th>,
      key: uniqueId(),
    },
  },
  {
    main: {
      label: <th>2</th>,
      key: uniqueId(),
    },
  },
  {
    main: {
      label: <th>3</th>,
      key: uniqueId(),
    },
    children: [
      {
        main: {
          label: <th>3-1</th>,
          key: uniqueId(),
        },
      },
      {
        main: {
          label: <th>3-2</th>,
          key: uniqueId(),
        },
      },
    ],
  },
];
