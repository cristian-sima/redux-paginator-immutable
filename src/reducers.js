// @flow

import type {
  ParamsState,
  ItemsState,
  CurrentPagesState,
  PagesState,

  Action,
} from "./types";

import {
  REQUEST_PAGE,
  RECEIVE_PAGE,
} from "./actionTypes";

import { buildSuffix } from "./agent";

const getPageUrlFromAction = ({ meta: { pageArgName }, payload: { params, page } }) =>
  buildSuffix(pageArgName, page, params);

export const params = (state : ParamsState = {}, action : Action) => {
  const { type, payload } = action;

  switch (type) {
    case REQUEST_PAGE:
      return {
        ...state,
        [payload.params]: null,
      };
    case RECEIVE_PAGE:
      return {
        ...state,
        [payload.params]: payload.count,
      };
    default:
      return state;
  }
};

export const pages = (state : PagesState = {}, action : Action) => {
  const { type, meta, payload } = action;
  let pageUrl = "";

  switch (type) {
    case REQUEST_PAGE:
      pageUrl = getPageUrlFromAction(action);
      return {
        ...state,
        [pageUrl]: {
          ...state[pageUrl],
          ids      : [],
          params   : payload.params,
          number   : payload.page,
          error    : false,
          fetching : true,
          fetched  : false,
        },
      };
    case RECEIVE_PAGE:
      pageUrl = getPageUrlFromAction(action);
      return {
        ...state,
        [pageUrl]: {
          ...state[pageUrl],
          ids      : payload.items.map((current) => current[meta.idKey]),
          fetching : false,
          error    : payload.error === true,
          fetched  : false,
        },
      };
    default:
      return state;
  }
};

export const currentPages = (state : CurrentPagesState = {}, action : Action) => {
  const { type, meta } = action;
  let pageUrl = "";

  switch (type) {
    case REQUEST_PAGE:
      pageUrl = getPageUrlFromAction(action);
      return {
        ...state,
        [meta.name]: pageUrl,
      };
    default:
      return state;
  }
};

export const items = (state : ItemsState, action : Action) => {
  const { type, payload, meta } = action;

  switch (type) {
    case RECEIVE_PAGE: {
      const _items = {};

      if (meta.fromCache === false) {
        for (const item of payload.items) {
          _items[item[meta.idKey]] = {
            ...meta.initialItem,
            ...item,
          };
        }
      }

      return {
        ...state,
        ..._items,
      };
    }
    default:
      return state;
  }
};
