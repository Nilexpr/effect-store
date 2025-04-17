import { uniqueId } from "lodash";
import {
  ColHeader,
  RowHeader,
} from "../components/pivot-table/interfaces/header";

export const rowHeader: RowHeader = [
  {
    main: {
      label: "1",
      key: uniqueId(),
    },
  },
  {
    main: {
      label: "2",
      key: uniqueId(),
    },
  },
  {
    main: {
      label: "3",
      key: uniqueId(),
    },
  },
];

export const colHeader: ColHeader = [
  {
    main: {
      label: "1",
      key: uniqueId(),
    },
  },
  {
    main: {
      label: "2",
      key: uniqueId(),
    },
  },
  {
    main: {
      label: "3",
      key: uniqueId(),
    },
  },
];
