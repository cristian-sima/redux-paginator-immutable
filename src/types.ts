export type PagesState = any;
export type ItemsState = any;
export type State = {
  readonly pages: PagesState;
  readonly itemsReducer: ItemsState;
};


type GetState = () => State;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type EndPointCb = ((token?: string) => string) | null;

export type Fetcher = (token: string, page: number, cursor?: string) => Promise<any>;


export type PaginatorSettings = {
  key: string;
  manageEntity: any;
  resultsKey: string;
  fetcher?: Fetcher;
  rowsPerLoad?: number;
  manipulateItems?: (items: any) => any;
  totalKey?: string;
  pageArgName?: string;
  idKey?: string;
  cursorKey?: string;
  cursorArgName?: string;

  dataItemURL?: string;
  normalizeDataItem?: any;
};


// actions

export type RequestPageAction = {
  type: "@@redux-paginator-immutable/REQUEST_PAGE";
  meta: {
    key: string;
    endpoint: string;
    endpointCb: EndPointCb;
    manageEntity: any;
    resultsKey: string;
    totalKey: string;
    pageArgName: string;
    idKey: string;
    cursorKey?: string;
    cursorArgName: string;
  };
  payload: {
    page: number;
    token: string;
  };
};
export type ReceivePageAction = {
  type: "@@redux-paginator-immutable/RECEIVE_PAGE";
  meta: {
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
    error: boolean;
    cursor?: string;
    raw?: string;
  };
};
export type ChangeViewAction = {
  type: "@@redux-paginator-immutable/CHANGE_VIEW";
  meta: {
    endpoint: string;
  };
  payload: {
    view: number;
    token: string;
  };
};
type ResetViewAction = {
  type: "@@redux-paginator-immutable/RESET_VIEW";
  meta: {
    endpoint: string;
  };
  payload: {
    token: string;
  };
};
type ClearDataAction = {
  type: "@@redux-paginator-immutable/CLEAR_DATA";
  meta: {
    endpoint: string;
  };
};
type FetchCurrentCompanyInfoPending = {
  type: "FETCH_CURRENT_COMPANY_INFO_PENDING";
};
type FetchItemDataPending = {
  type: "@@redux-paginator-immutable/FETCH_ITEM_DATA_PENDING";
  meta: {
    id: string;
  };
};
type FetchItemDataRejected = {
  type: "@@redux-paginator-immutable/FETCH_ITEM_DATA_REJECTED";
  meta: {
    id: string;
  };
};
type FetchItemDataFulFilled = {
  type: "@@redux-paginator-immutable/FETCH_ITEM_DATA_FULFILLED";
  payload: {
    Data: any;
  };
  meta: {
    id: string;
  };
};
export type Action =
RequestPageAction |
ReceivePageAction |
ResetViewAction |
ChangeViewAction |
ClearDataAction |
FetchCurrentCompanyInfoPending |
FetchItemDataPending |
FetchItemDataRejected |
FetchItemDataFulFilled;
