/* eslint-disable no-console */

import { REQUEST_PAGE } from "./actionTypes";
import { receivePage } from "./actions";
import {
  fetchPage,
  FROM_CACHE_FLAG,
} from "./agent";


const paginatorMiddleware = ({ dispatch }) => (next) => (action) => {
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
            let results, count;

            if (typeof resultsKey === "undefined") {
              results = response;
            } else {
              results = response[resultsKey];
              count = response[countKey];
            }
            dispatch2(receivePage(
              endpoint,
              name,
              initialItem,
              pageArgName,
              idKey,
              page,
              params,
              results,
              count,
              res,
              !(typeof fromCache === "undefined")
            ));
          });
      } catch (err) {
        console.log("err", err);
      }
    });
  }
  return next(action);
};

export default paginatorMiddleware;
