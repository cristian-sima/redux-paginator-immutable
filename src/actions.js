// @flow

import type { Action } from "./types";

type ChangeView = {
  name : string;
  view : number;
  endpoint: string;
}

type ResetView = {
  name : string;
  endpoint: string;
}

import {
  RECEIVE_PAGE,
  REQUEST_PAGE,

  RESET_VIEW,
  CHANGE_VIEW,
} from "./actionTypes";

type RequestPageArgsTypes = {
  endpoint: string;
  name: string;
  initialItem: any;
  resultsKey: string;
  countKey: string;
  pageArgName: string;
  idKey: string;
  page: number;
  params: string;
};

type ReceivePageArgsTypes = {
  endpoint: string;
  name: string;
  initialItem: any;
  pageArgName: string;
  idKey: string;
  page: number;
  params: string;
  items: Array<any>;
  count: number;
  raw?: string;
  error: bool;
}

export const requestPage = ({
  endpoint,
  name,
  initialItem,
  resultsKey,
  countKey,
  pageArgName,
  idKey,
  page,
  params,
} : RequestPageArgsTypes) : Action => ({
  type : REQUEST_PAGE,
  meta : {
    endpoint,
    name,
    initialItem,
    resultsKey,
    countKey,
    pageArgName,
    idKey,
  },
  payload: {
    page,
    params,
  },
});

export const receivePage = ({
  endpoint,
  name,
  initialItem,
  pageArgName,
  idKey,
  page,
  params,
  items,
  error,
  count,
  raw,
} : ReceivePageArgsTypes) : Action => ({
  type : RECEIVE_PAGE,
  meta : {
    endpoint,
    name,
    initialItem,
    pageArgName,
    idKey,
  },
  payload: {
    page,
    params,
    items,
    error,
    count,
    raw,
  },
});

export const resetView = ({ endpoint, name } : ResetView) : Action => ({
  type : RESET_VIEW,
  meta : {
    endpoint,
    name,
  },
  payload: {},
});

export const changeView = ({ endpoint, name, view } : ChangeView) : Action => ({
  type : CHANGE_VIEW,
  meta : {
    endpoint,
    name,
  },
  payload: {
    view,
  },
});
