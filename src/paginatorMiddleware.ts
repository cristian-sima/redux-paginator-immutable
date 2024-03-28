/* eslint-disable no-console, max-lines-per-function */
import { REQUEST_PAGE } from "./actionTypes";
import actions from "./actions";
import { fetchPage } from "./agent";
import { Action, Dispatch } from "./types";

const
  { receivePage } = actions,

  paginatorMiddleware = ({ dispatch }: { dispatch: Dispatch;}) => (next: any) => (action: Action) => {
    if (action.type === REQUEST_PAGE) {
      const {
        meta: {
          endpoint,
          endpointCb,
          manageEntity,
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
        const
          markAsError = () => {
            dispatch2(receivePage({
              endpoint,
              endpointCb,
              manageEntity,
              pageArgName,
              idKey,
              page,
              error : true,
              token,
              items : [],
              total : 0,
            }));
          },

          rawPath = typeof endpointCb === "function" ? endpointCb(token) : endpoint,
          path = rawPath === null ? "" : rawPath;

        try {
          fetchPage({
            endpoint: path,
            pageArgName,
            page,
            token,
          }).then((res: { response: any; }) => {
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
              endpointCb,
              manageEntity,
              pageArgName,
              idKey,
              page,
              error : false,
              token,
              items : results,
              total,
            }));
          }).catch(() => {
            markAsError();
          });
        } catch (err) {
          markAsError();
        }
      });
    }

    return next(action);
  };

export default paginatorMiddleware;
