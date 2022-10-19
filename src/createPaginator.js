// @flow
/* eslint-disable max-lines-per-function,  */

import type { PaginatorSettings } from "./types";

type EndpointData = {
  path : string;
  cb : () => string;
};


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

type CreatePaginator = (endpoint: Endpoint, info: PaginatorSettings) => any;

type OnlyForEndpoint = (endpoint : string, reducer : any) =>
(state? : any, action : { meta: { endpoint : string }}) => any;

import {
  pages as pagesReducer,
  items as itemsReducer,
  dataItems as dataItemsReducer,
} from "./reducers";

import actions from "./actions";

import * as Immutable from "immutable";

import { rowsPerPage as defaultRowsPerLoad } from "./selectors";

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

export const createPaginator : CreatePaginator = (
  (endpointData : Endpoint, settings : PaginatorSettings) => {
    const {
      path: endpoint,
      cb: endpointCb,
    } = getEndpoint(endpointData);

    const {
      key,
      normalizeDataItem,
      dataItemURL,
      manageEntity,
      resultsKey,
      totalKey = "Total",
      pageArgName = "page",
      idKey = "ID",
      rowsPerLoad = defaultRowsPerLoad,
      manipulateItems = (items) => items,
    } = settings;

    const endpointedActions = ({
      requestPage: (page : number, token : string) => actions.requestPage({
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
        return actions.resetView(endpoint, token);
      },
      changeView ({ view, token } : { view : number; token : string; }) {
        return actions.changeView(endpoint, {
          view,
          token,
        });
      },
      clearData () {
        return actions.clearData(endpoint);
      },
    });

    return ({
      key,
      normalizeDataItem,
      dataItemURL,
      manipulateItems,
      rowsPerLoad,
      manageEntity,
      resultsKey,
      endpoint,

      pagesReducer : onlyForEndpoint(endpoint, pagesReducer),
      itemsReducer : onlyForEndpoint(endpoint, itemsReducer),

      dataItemsReducer: onlyForEndpoint(endpoint, dataItemsReducer),

      ...endpointedActions,
    });
  }
);
