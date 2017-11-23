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
  pages as pagesReducer,
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
    requestPage: (page : number, token : string) => requestPage({
      endpoint,
      initialItem,
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
