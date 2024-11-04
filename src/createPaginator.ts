const defaultRowsPerLoad = 25;

import * as Immutable from "immutable";
import actions from "./actions";
import { dataItems as dataItemsReducer, items as itemsReducer, pages as pagesReducer } from "./reducers";
import { PaginatorSettings } from "./types";

type EndpointData = {
  path: string;
  cb: () => string;
};

type Endpoint = EndpointData | string;

type Action = {
  meta?: {
    endpoint: string;
  }
}

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
  },
  onlyForEndpoint = (endpoint : string, reducer : any) => (state = Immutable.Map(), action : Action) => {
    if (typeof action.meta === "undefined" || action.meta.endpoint !== endpoint) {
      return state;
    }

    return reducer(state, action);
  };

export const
  createPaginator = (endpointData: Endpoint, settings: PaginatorSettings) => {
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
