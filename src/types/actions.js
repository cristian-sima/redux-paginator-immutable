// @flow

import type { EndPointCb } from "./index";

export type RequestPageAction = {
  type : "@@redux-paginator-immutable/REQUEST_PAGE";
  meta : {
    endpoint: string;
    endpointCb: EndPointCb;
    initialItem: any;
    resultsKey: string;
    totalKey: string;
    pageArgName: string;
    idKey: string;
  };
  payload: {
    page: number;
    token: string;
  };
};

export type ReceivePageAction = {
  type : "@@redux-paginator-immutable/RECEIVE_PAGE";
  meta : {
    endpoint: string;
    endpointCb: EndPointCb;
    initialItem: any;
    pageArgName: string;
    idKey: string;
  };
  payload: {
    page: number;
    token: string;
    items: Array<any>;
    total: number;
    error: bool;
    raw?: string;
  };
};

export type ChangeViewAction = {
  type : "@@redux-paginator-immutable/CHANGE_VIEW";
  meta : {
    endpoint: string;
  };
  payload: {
    view: number;
    token: string;
  };
};

export type ResetViewAction = {
  type : "@@redux-paginator-immutable/RESET_VIEW";
  meta : {
    endpoint: string;
  };
  payload: {
    token: string;
  };
};

export type Action = RequestPageAction
| ReceivePageAction
| ResetViewAction
| ChangeViewAction;
