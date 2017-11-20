// @flow
/* eslint-disable no-console */

import type { Dispatch, Action } from "./types";

import { REQUEST_PAGE } from "./actionTypes";
import { receivePage } from "./actions";
import {
  fetchPage,
  FROM_CACHE_FLAG,
} from "./agent";


const paginatorMiddleware = ({ dispatch } : { dispatch : Dispatch}) =>
  (next : any) => (action : Action) => {
    if (action.type === REQUEST_PAGE) {
      const {
        meta: {
          endpoint,
          name,
          initialItem,
          resultsKey,
          countKey,
          pageArgName,
          idKey,
        },
        payload: {
          page,
          params,
        },
      } = action;

      dispatch((dispatch2) => {
        try {
          fetchPage(endpoint, pageArgName, page, params).
            then((res) => {
              const { response, [FROM_CACHE_FLAG]: fromCache } = res;
              let
                results = [],
                count = 0;

              if (typeof resultsKey === "undefined") {
                results = response;
              } else {
                results = response[resultsKey];
                count = response[countKey];
              }
              dispatch2(receivePage({
                endpoint,
                name,
                initialItem,
                pageArgName,
                idKey,
                page,
                params,
                items     : results,
                count,
                raw       : res,
                fromCache : !(typeof fromCache === "undefined"),
              }));
            });
        } catch (err) {
          console.log("err", err);
        }
      });
    }
    return next(action);
  };

export default paginatorMiddleware;
