// @flow
/* eslint-disable no-console */

import type { Dispatch, Action } from "./types";

import { REQUEST_PAGE } from "./actionTypes";
import { receivePage } from "./actions";
import { fetchPage } from "./agent";

const paginatorMiddleware = ({ dispatch } : { dispatch : Dispatch}) => (
  (next : any) => (action : Action) => {
    if (action.type === REQUEST_PAGE) {
      const {
        meta: {
          endpoint,
          initialItem,
          resultsKey,
          totalKey,
          pageArgName,
          idKey,
        },
        payload: {
          page,
          token,
        },
      } = action;

      dispatch((dispatch2) => {
        const markAsError = () => {
          dispatch2(receivePage({
            endpoint,
            initialItem,
            pageArgName,
            idKey,
            page,
            error : true,
            token,
            items : [],
            total : 0,
          }));
        };

        try {
          fetchPage({
            endpoint,
            pageArgName,
            page,
            token,
          }).
            then((res) => {
              const { response } = res;
              let
                results = [],
                total = 0;

              if (typeof resultsKey === "undefined") {
                results = response;
              } else {
                results = response[resultsKey];
                total = response[totalKey];
              }
              dispatch2(receivePage({
                endpoint,
                initialItem,
                pageArgName,
                idKey,
                page,
                error : false,
                token,
                items : results,
                total,
                raw   : res,
              }));
            }).
            catch(() => {
              markAsError();
            });
        } catch (err) {
          markAsError();
        }
      });
    }
    return next(action);
  }
);

export default paginatorMiddleware;
