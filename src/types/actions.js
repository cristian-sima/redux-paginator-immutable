// @flow

import type { EndPointCb } from "./index";

export type RequestPageAction = {
  type : "@@redux-paginator-immutable/REQUEST_PAGE";
  meta : {
    endpoint: string;
    endpointCb: EndPointCb;
    manageEntity: any;
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
    manageEntity: any;
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

export type ClearDataAction = {
  type : "@@redux-paginator-immutable/CLEAR_DATA";
  meta : {
    endpoint: string;
  };
};

export type FetchCurrentCompanyInfoPending = {
  type : "FETCH_CURRENT_COMPANY_INFO_PENDING";
};

export type FetchItemDataPending = {
  type : "@@redux-paginator-immutable/FETCH_ITEM_DATA_PENDING";
  meta: {
    id: string;
  }
};

export type FetchItemDataRejected = {
  type : "@@redux-paginator-immutable/FETCH_ITEM_DATA_REJECTED";
  meta: {
    id: string;
  }
};

export type FetchItemDataFulFilled = {
  type : "@@redux-paginator-immutable/FETCH_ITEM_DATA_FULFILLED";
  payload: {
    Data: any;
  };
  meta: {
    id: string;
  };
};

export type Action = RequestPageAction
| ReceivePageAction
| ResetViewAction
| ChangeViewAction
| ClearDataAction

| FetchCurrentCompanyInfoPending

|FetchItemDataPending
|FetchItemDataRejected
|FetchItemDataFulFilled;
