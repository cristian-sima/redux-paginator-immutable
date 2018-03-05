// @flow

import type { Action, EndPointCb } from "./types";

type RequestPageArgsTypes = {
  endpoint: string;
  endpointCb: EndPointCb;
  manageEntity: any;
  resultsKey: string;
  totalKey: string;
  pageArgName: string;
  idKey: string;
  page: number;
  token: string;
};

type ReceivePageArgsTypes = {
  endpoint: string;
  endpointCb: EndPointCb;
  manageEntity: any;
  pageArgName: string;
  idKey: string;
  page: number;
  token: string;
  items: Array<any>;
  total: number;
  error: bool;
}

export const requestPage = ({
  endpoint,
  endpointCb,
  manageEntity,
  resultsKey,
  totalKey,
  pageArgName,
  idKey,
  page,
  token,
} : RequestPageArgsTypes) : Action => ({
  type : "@@redux-paginator-immutable/REQUEST_PAGE",
  meta : {
    endpoint,
    endpointCb,
    manageEntity,
    resultsKey,
    totalKey,
    pageArgName,
    idKey,
  },
  payload: {
    page,
    token,
  },
});

export const receivePage = ({
  endpoint,
  endpointCb,
  manageEntity,
  pageArgName,
  idKey,
  page,
  token,
  items,
  error,
  total,
} : ReceivePageArgsTypes) : Action => ({
  type : "@@redux-paginator-immutable/RECEIVE_PAGE",
  meta : {
    endpoint,
    endpointCb,
    manageEntity,
    pageArgName,
    idKey,
  },
  payload: {
    page,
    token,
    items,
    error,
    total,
  },
});

export const resetView = (endpoint : string, token : string) : Action => ({
  type : "@@redux-paginator-immutable/RESET_VIEW",
  meta : {
    endpoint,
  },
  payload: {
    token,
  },
});

export const changeView = (endpoint : string, {
  token,
  view,
} : { token : string, view : number }) : Action => ({
  type : "@@redux-paginator-immutable/CHANGE_VIEW",
  meta : {
    endpoint,
  },
  payload: {
    token,
    view,
  },
});
