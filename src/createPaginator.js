// @flow

type CreatePaginator = (endpoint: string, info: {
  initialItem: any;
  resultsKey: string;
  totalKey: string;
  pageArgName: string;
  idKey : string;
}) => any;

type OnlyForEndpoint = (endpoint : string, reducer : any) =>
(state? : any, action : { meta: { endpoint : string }}) => any;

import {
  params as paramsReducer,
  pages as pagesReducer,
  currentView as currentViewReducer,
  currentPages as currentPagesReducer,
  items as itemsReducer,
} from "./reducers";

import { requestPage, resetView, changeView } from "./actions";

import * as Immutable from "immutable";

export const onlyForEndpoint : OnlyForEndpoint = (endpoint, reducer) =>
  (state = Immutable.Map(), action) => {
    if (typeof action.meta === "undefined" || action.meta.endpoint !== endpoint) {
      return state;
    }

    return reducer(state, action);
  };

export const createPaginator : CreatePaginator = (endpoint, {
  initialItem,
  resultsKey,
  totalKey = "Total",
  pageArgName = "page",
  idKey = "ID",
}) => {

  const actions = ({
    requestPage: (page : number, params : string) => requestPage({
      endpoint,
      initialItem,
      resultsKey,
      totalKey,
      pageArgName,
      idKey,
      page,
      params,
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
    reducers: {
      params       : onlyForEndpoint(endpoint, paramsReducer),
      pages        : onlyForEndpoint(endpoint, pagesReducer),
      currentPages : onlyForEndpoint(endpoint, currentPagesReducer),
      currentView  : onlyForEndpoint(endpoint, currentViewReducer),
    },
    itemsReducer: onlyForEndpoint(endpoint, itemsReducer),
    ...actions,
  });
};
