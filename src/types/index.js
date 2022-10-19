// @flow
/* eslint-disable no-use-before-define */

export * from "./actions";
export * from "./state";

import type { State } from "./state";
import type { Action } from "./actions";

export type GetState = () => State;
export type PromiseAction = Promise<Action>;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;

export type EndPointCb = ((token? : string) => string) | null;

export type PaginatorSettings = {
  key: string;
  manageEntity: any;
  resultsKey: string;
  dataItemURL: string;
  normalizeDataItem: any;

  // by default 25
  rowsPerLoad?: number;

  // by default "(items) => items"
  manipulateItems?: (items: any) => any;

  // by default "Total"
  totalKey?: string;

   // by default "page"
  pageArgName?: string;

  // default "ID"
  idKey?: string;
}
