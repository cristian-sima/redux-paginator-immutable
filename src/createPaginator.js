// @flow

type EndpointData = {
  path : string;
  cb : () => string;
};

type Endpoint = EndpointData | string;

type CreatePaginator = (endpoint: Endpoint, info: {
  manageEntity: any;
  resultsKey: string;
  totalKey: string;
  pageArgName: string;
  idKey : string;
}) => any;

type OnlyForEndpoint = (endpoint : string, reducer : any) =>
(state? : any, action : { meta: { endpoint : string }}) => any;

import {
  pages as pagesReducer,
  items as itemsReducer,
} from "./reducers";

import { requestPage, resetView, changeView } from "./actions";

import * as Immutable from "immutable";

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

export const createPaginator : CreatePaginator = (endpointData : Endpoint, {
  manageEntity,
  resultsKey,
  totalKey = "Total",
  pageArgName = "page",
  idKey = "ID",
}) => {

  const {
    path: endpoint,
    cb: endpointCb,
  } = getEndpoint(endpointData);

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
    pages        : onlyForEndpoint(endpoint, pagesReducer),
    itemsReducer : onlyForEndpoint(endpoint, itemsReducer),
    ...actions,
  });
};
