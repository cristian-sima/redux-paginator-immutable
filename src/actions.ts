
import agent from "superagent";
import { EndPointCb, Action } from "./types";

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
  error: boolean;
};

const requestPage = ({
    endpoint,
    endpointCb,
    manageEntity,
    resultsKey,
    totalKey,
    pageArgName,
    idKey,
    page,
    token,
  }: RequestPageArgsTypes): Action => ({
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
  }),

  receivePage = ({
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
  }: ReceivePageArgsTypes): Action => ({
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
  }),

  resetView = (endpoint: string, token: string): Action => ({
    type : "@@redux-paginator-immutable/RESET_VIEW",
    meta : {
      endpoint,
    },
    payload: {
      token,
    },
  }),

  changeView = (endpoint: string, {
    token,
    view,
  }: {
    token: string;
    view: number;
  }): Action => ({
    type : "@@redux-paginator-immutable/CHANGE_VIEW",
    meta : {
      endpoint,
    },
    payload: {
      token,
      view,
    },
  }),

  clearData = (endpoint: string): Action => ({
    type : "@@redux-paginator-immutable/CLEAR_DATA",
    meta : {
      endpoint,
    },
  });

// data info
type FetchDataItem = {
  dataItemURL: string;
  endpoint: string;
  normalizeDataItem: any;
  id: string;
};

const fetchDataItemRequest = ({
  dataItemURL,
  normalizeDataItem,
  id,
}: FetchDataItem): Promise<any> => (
  new Promise((resolve, reject) => (
    agent.
      get(`${dataItemURL}/${id}`).
      set("Accept", "application/json").
      end(normalizeDataItem(resolve, reject))
  )) as Promise<any>
);

export const fetchItem = (things: FetchDataItem): any => ({
  type    : "@@redux-paginator-immutable/FETCH_ITEM_DATA",
  payload : fetchDataItemRequest(things),
  meta    : {
    id       : things.id,
    endpoint : things.endpoint,
  },
});

export default {
  clearData,
  requestPage,
  receivePage,
  resetView,
  changeView,
};
