// @flow

type RequestPageAction = {
  type : "@@redux-paginator-immutable/REQUEST_PAGE";
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
  type : "@@redux-paginator-immutable/RECEIVE_PAGE";
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
    items: Array<any>;
    count: number;
    raw?: string;
  };
}

export type Action =
RequestPageAction |
ReceivePageAction;
