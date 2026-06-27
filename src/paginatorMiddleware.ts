/* eslint-disable no-console, max-lines-per-function */
import { CLEAR_DATA, REQUEST_PAGE } from "./actionTypes";
import actions from "./actions";
import { fetchPage } from "./agent";
import { getFetcher } from "./fetcherRegistry";
import { Action, Dispatch } from "./types";

const
  { receivePage } = actions,

  // (endpoint|page|token) of fetches currently in flight. Guards against a
  // remount / fast-nav race firing the same fetch twice (the pages reducer
  // concats ids on RECEIVE_PAGE → duplicate rows). Transparent on the happy
  // path: a single REQUEST_PAGE adds then removes its own key.
  inFlight = new Set<string>(),

  // Per-endpoint generation. CLEAR_DATA bumps it; a fetch started before the
  // clear is discarded on resolve, so a stale response cannot refill a list
  // the caller just cleared (and the post-clear refetch is free to run).
  epochs = new Map<string, number>(),

  epochOf = (endpoint: string) => epochs.get(endpoint) || 0,

  clearEndpoint = (endpoint: string) => {
    epochs.set(endpoint, epochOf(endpoint) + 1);
    Array.from(inFlight).forEach((key) => {
      if (key.startsWith(`${endpoint}|`)) {
        inFlight.delete(key);
      }
    });
  },

  paginatorMiddleware = ({ dispatch }: { dispatch: Dispatch;}) => (next: any) => (action: Action) => {
    if (action.type === CLEAR_DATA) {
      if (action.meta && typeof action.meta.endpoint === "string") {
        clearEndpoint(action.meta.endpoint);
      }

      return next(action);
    }

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
        } = action,

        dedupeKey = `${endpoint}|${page}|${token}`;

      if (!inFlight.has(dedupeKey)) {
        inFlight.add(dedupeKey);

        const requestEpoch = epochOf(endpoint);

        dispatch((dispatch2) => {
          const
            isStale = () => epochOf(endpoint) !== requestEpoch,

            markAsError = () => {
              if (isStale()) {
                return;
              }

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

            onResponse = (response: any) => {
              if (isStale()) {
                return;
              }

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
            },

            settle = () => {
              inFlight.delete(dedupeKey);
            },

            fetcher = getFetcher(endpoint),

            rawPath = typeof endpointCb === "function" ? endpointCb(token) : endpoint,
            path = rawPath === null ? "" : rawPath;

          try {
            const run = typeof fetcher === "function"
              ? fetcher(token, page)
              : fetchPage({
                endpoint: path,
                pageArgName,
                page,
                token,
              }).then((res: { response: any; }) => res.response);

            run.
              then(onResponse).
              catch(markAsError).
              finally(settle);
          } catch (err) {
            settle();
            markAsError();
          }
        });
      }
    }

    return next(action);
  };

export default paginatorMiddleware;
