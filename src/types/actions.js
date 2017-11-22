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
  };
  payload: {
    page: number;
    params: string;
    items: Array<any>;
    count: number;
    error: bool;
    raw?: string;
  };
}

type ChangeViewAction = {
  type : "@@redux-paginator-immutable/CHANGE_VIEW";
  meta : {
    name: string;
  };
  payload: {
    view: number;
  };
}

type ResetViewAction = {
  type : "@@redux-paginator-immutable/RESET_VIEW";
  meta : {
    name: string;
  };
  payload: {};
}

export type Action =
| RequestPageAction
| ReceivePageAction
| ResetViewAction
| ChangeViewAction
