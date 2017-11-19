// @flow

import {
  RECEIVE_PAGE,
  REQUEST_PAGE,
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
  items: Array<string>;
  count: number;
  raw?: string;
  fromCache?: boolean;
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
} : RequestPageArgsTypes) => ({
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
  count,
  raw,
  fromCache = false,
} : ReceivePageArgsTypes) => ({
  type : RECEIVE_PAGE,
  meta : {
    endpoint,
    name,
    initialItem,
    pageArgName,
    idKey,
    fromCache,
  },
  payload: {
    page,
    params,
    items,
    count,
    raw,
  },
});
