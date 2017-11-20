// @flow

import type { State } from "./types";

type CreatePaginator = (endpoint: string, names: Array<string>, info: {
  initialItem: any;
  resultsKey: string;
  countKey: string;
  pageArgName: string;
  idKey : string;
}) => any;

type RequestPageActionCreatorForEndpointArgsTypes = {
  endpoint: string;
  name: string;
  pageArgName: string;
  idKey: string;
  initialItem: any;
  resultsKey: string;
  countKey: string;
}

type GetRequestPageActionCreatorsForArgsTyps = {
  endpoint: string;
  names: Array<string>;
  pageArgName: string;
  idKey: string;
  initialItem: any;
  resultsKey: string;
  countKey: string;
}

type OnlyForEndpoint = (endpoint : string, reducer : any) =>
(state? : State, action : { meta: { endpoint : string }}) => any;

import { combineReducers } from "redux";

import {
  params as paramsReducer,
  pages as pagesReducer,
  currentPages as currentPagesReducer,
  items as itemsReducer,
} from "./reducers";
import { requestPage } from "./actions";


export const onlyForEndpoint : OnlyForEndpoint = (endpoint, reducer) =>
  (state, action) => {
    if (typeof action.meta === "undefined") {
      return state;
    }

    if (action.meta.endpoint === endpoint) {
      reducer(state, action);
    }

    return state;
  };

export const requestPageActionCreatorForEndpoint = ({
  endpoint,
  name,
  pageArgName,
  idKey,
  initialItem,
  resultsKey,
  countKey,
} : RequestPageActionCreatorForEndpointArgsTypes) =>
  (page : number, params : string) => requestPage({
    endpoint,
    name,
    initialItem,
    resultsKey,
    countKey,
    pageArgName,
    idKey,
    page,
    params,
  });

export const getRequestPageActionCreatorsFor = ({
  endpoint,
  names,
  pageArgName,
  idKey,
  initialItem,
  resultsKey,
  countKey,
} : GetRequestPageActionCreatorsForArgsTyps) => {
  let actions = {};

  for (const name of names) {
    actions = {
      ...actions,
      [name]: {
        requestPage: requestPageActionCreatorForEndpoint({
          endpoint,
          name,
          pageArgName,
          idKey,
          initialItem,
          resultsKey,
          countKey,
        }),
      },
    };
  }
  return actions;
};

export const createPaginator : CreatePaginator = (endpoint, names, {
  initialItem,
  resultsKey,
  countKey = "Total",
  pageArgName = "page",
  idKey = "ID",
}) => {

  const
    params = onlyForEndpoint(endpoint, paramsReducer),
    pages = onlyForEndpoint(endpoint, pagesReducer),
    currentPages = onlyForEndpoint(endpoint, currentPagesReducer);

  const requestPageActionCreators = getRequestPageActionCreatorsFor({
    endpoint,
    names,
    pageArgName,
    idKey,
    initialItem,
    resultsKey,
    countKey,
  });

  return ({
    reducers: combineReducers({
      params,
      pages,
      currentPages,
    }),
    itemsReducer,
    ...requestPageActionCreators,
  });
};
