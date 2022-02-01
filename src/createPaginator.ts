/* eslint-disable max-lines-per-function,  */

import { rowsPerLoad as defaultRowsPerLoad } from "x25/utility/others";
import * as Immutable from "immutable";
import { pages as pagesReducer, items as itemsReducer, dataItems as dataItemsReducer } from "./reducers";
import actions from "./actions";

import type { PaginatorSettings } from "./types";

type EndpointData = {
  path: string;
  cb: () => string;
};

type Endpoint = EndpointData | string;
type CreatePaginator = (endpoint: Endpoint, info: PaginatorSettings) => any;
type OnlyForEndpoint = (endpoint: string, reducer: any) => (state: any, action: {
  meta: {
    endpoint: string;
  };
}) => any;


const getEndpoint = (data: Endpoint) => {
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

export const
  onlyForEndpoint: OnlyForEndpoint = (endpoint, reducer) => (state = Immutable.Map(), action) => {
    if (typeof action.meta === "undefined" || action.meta.endpoint !== endpoint) {
      return state;
    }

    return reducer(state, action);
  },
  createPaginator: CreatePaginator = (endpointData: Endpoint, settings: PaginatorSettings) => {
    const
      {
        path: endpoint,
        cb: endpointCb,
      } = getEndpoint(endpointData),
      {
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
      } = settings,
      endpointedActions = {
        requestPage: (page: number, token: string) => actions.requestPage({
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

        resetView (token : any) {
          return actions.resetView(endpoint, token);
        },

        changeView ({ view, token }: { view: number; token: string; }) {
          return actions.changeView(endpoint, {
            view,
            token,
          });
        },

        clearData () {
          return actions.clearData(endpoint);
        },
      };

    return {
      key,
      normalizeDataItem,
      dataItemURL,
      manipulateItems,
      rowsPerLoad,
      manageEntity,
      resultsKey,
      endpoint,
      pagesReducer     : onlyForEndpoint(endpoint, pagesReducer),
      itemsReducer     : onlyForEndpoint(endpoint, itemsReducer),
      dataItemsReducer : onlyForEndpoint(endpoint, dataItemsReducer),
      ...endpointedActions,
    };
  };
