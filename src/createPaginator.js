// @flow

type EndpointData = {
  path : string;
  cb : () => string;
};

type Settings = {
  key: string;
  manageEntity: any;
  resultsKey: string;

  // by default "{rowsPerLoad} from x25/utility"
  rowsPerLoad?: number;

  // by default "(items) => items"
  manipulateItems?: (items: any) => any;

  // by default "Total"
  totalKey?: string;

   // by default "page"
  pageArgName?: string;

  // default "ID"
  idKey?: string;
}

/*
if (typeof Endpoint === "object") {
  return {
    path : Endpoint.path,
    cb   : Endpoint.cb,
  };
}

return {
  path : Endpoint,
};
*/
type Endpoint = EndpointData | string;

type CreatePaginator = (endpoint: Endpoint, info: Settings) => any;

type OnlyForEndpoint = (endpoint : string, reducer : any) =>
(state? : any, action : { meta: { endpoint : string }}) => any;

import {
  pages as pagesReducer,
  items as itemsReducer,
} from "./reducers";

import { requestPage, resetView, changeView } from "./actions";

import * as Immutable from "immutable";

import { rowsPerLoad as defaultRowsPerLoad } from "x25/utility";

export const onlyForEndpoint : OnlyForEndpoint = (endpoint, reducer) => (
  (state = Immutable.Map(), action) => {
    if (typeof action.meta === "undefined" || action.meta.endpoint !== endpoint) {
      return state;
    }

    return reducer(state, action);
  }
);

const getEndpoint = (data : Endpoint) => {
  if (typeof data === "object") {
    return {
      path : data.path,
      cb   : data.cb,
    };
  }

  return {
    path : data,
    cb   : null,
  };
};

export const createPaginator : CreatePaginator = (endpointData : Endpoint, settings : Settings) => {
  const {
    path: endpoint,
    cb: endpointCb,
  } = getEndpoint(endpointData);

  const {
    key,
    manageEntity,
    resultsKey,
    totalKey = "Total",
    pageArgName = "page",
    idKey = "ID",
    rowsPerLoad = defaultRowsPerLoad,
    manipulateItems = (items) => items,
  } = settings;

  const actions = ({
    requestPage: (page : number, token : string) => requestPage({
      endpoint,
      endpointCb,
      manageEntity,
      resultsKey,
      totalKey,
      pageArgName,
      idKey,
      page,
      token,
    }),
    resetView (token) {
      return resetView(endpoint, token);
    },
    changeView ({ view, token } : { view : number; token : string; }) {
      return changeView(endpoint, {
        view,
        token,
      });
    },
  });

  return ({
    key,
    manipulateItems,
    rowsPerLoad,
    ...actions,
    pages        : onlyForEndpoint(endpoint, pagesReducer),
    itemsReducer : onlyForEndpoint(endpoint, itemsReducer),
  });
};
