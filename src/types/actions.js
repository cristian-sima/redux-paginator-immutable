// @flow

type RequestPageAction = {
  type : "@@redux-paginator-immutable/REQUEST_PAGE";
  meta : {
    endpoint: string;
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

type ReceivePageAction = {
  type : "@@redux-paginator-immutable/RECEIVE_PAGE";
  meta : {
    endpoint: string;
    initialItem: any;
    pageArgName: string;
    idKey: string;
  };
  payload: {
    page: number;
    token: string;
    items: Array<any>;
    count: number;
    error: bool;
    raw?: string;
  };
}

type ChangeViewAction = {
  type : "@@redux-paginator-immutable/CHANGE_VIEW";
  meta : {
    endpoint: string;
  };
  payload: {
    view: number;
    token: string;
  };
}

type ResetViewAction = {
  type : "@@redux-paginator-immutable/RESET_VIEW";
  meta : {
    endpoint: string;
  };
  payload: {
    token: string;
  };
}

export type Action =
| RequestPageAction
| ReceivePageAction
| ResetViewAction
| ChangeViewAction
