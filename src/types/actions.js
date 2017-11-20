// @flow

import { REQUEST_PAGE, RECEIVE_PAGE } from "../actionTypes";

type RequestPageAction = {
  type : REQUEST_PAGE;
  meta : {
    endpoint: string;
    name: string;
    initialItem: any;
    resultsKey: string;
    countKey: string;
    pageArgName: string;
    idKey: string;
  };
  payload: {
    page: number;
    params: string;
  };
};

type ReceivePageAction = {
  type : RECEIVE_PAGE;
  meta : {
    endpoint: string;
    name: string;
    initialItem: any;
    pageArgName: string;
    idKey: string;
    fromCache?: boolean;
  };
  payload: {
    page: number;
    params: string;
    items: Array<string>;
    count: number;
    raw?: string;
  };
}

export type Action =
RequestPageAction |
ReceivePageAction;
