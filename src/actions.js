// @flow

import type { Action } from "./types";

type RequestPageArgsTypes = {
  endpoint: string;
  initialItem: any;
  resultsKey: string;
  totalKey: string;
  pageArgName: string;
  idKey: string;
  page: number;
  token: string;
};

type ReceivePageArgsTypes = {
  endpoint: string;
  initialItem: any;
  pageArgName: string;
  idKey: string;
  page: number;
  token: string;
  items: Array<any>;
  total: number;
  raw?: string;
  error: bool;
}

export const requestPage = ({
  endpoint,
  initialItem,
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
    initialItem,
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
  initialItem,
  pageArgName,
  idKey,
  page,
  token,
  items,
  error,
  total,
  raw,
} : ReceivePageArgsTypes) : Action => ({
  type : "@@redux-paginator-immutable/RECEIVE_PAGE",
  meta : {
    endpoint,
    initialItem,
    pageArgName,
    idKey,
  },
  payload: {
    page,
    token,
    items,
    error,
    total,
    raw,
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
