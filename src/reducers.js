// @flow

import type {
  ParamsState,
  ItemsState,
  CurrentPagesState,
  PagesState,
  CurrentViewState,

  Action,
} from "./types";

import {
  REQUEST_PAGE,
  RECEIVE_PAGE,
  RESET_VIEW,
  CHANGE_VIEW,
} from "./actionTypes";

import * as Immutable from "immutable";
import { buildSuffix } from "./agent";

const getPageUrlFromAction = ({ meta: { pageArgName }, payload: { params, page } }) =>
  buildSuffix(pageArgName, page, params);

export const params = (state : ParamsState = Immutable.Map(), action : Action) => {
  const { type, payload } = action;

  switch (type) {
    case RECEIVE_PAGE:
      if (payload.error === true) {
        return state;
      }

      return (
        state.set(payload.params, payload.count)
      );
    default:
      return state;
  }
};

export const pages = (state : PagesState = Immutable.Map(), action : Action) => {
  const { type, meta, payload } = action;
  let pageUrl = "";

  switch (type) {
    case REQUEST_PAGE:
      pageUrl = getPageUrlFromAction(action);

      return state.update(pageUrl, (current) => {
        const elements = Immutable.Map({
          ids      : Immutable.List(),
          params   : payload.params,
          number   : payload.page,
          error    : false,
          fetching : true,
          fetched  : false,
        });

        if (typeof current === "undefined") {
          return elements;
        }

        return current.merge(elements);
      });

    case RECEIVE_PAGE:
      pageUrl = getPageUrlFromAction(action);

      return state.update(pageUrl, (current) => {
        const elements = Immutable.Map({
          ids: Immutable.List(
            payload.items.map((item) => String(item[meta.idKey]))
          ),
          fetching : false,
          error    : payload.error === true,
          fetched  : true,
        });

        if (typeof current === "undefined") {
          return elements;
        }

        return current.merge(elements);
      });

    default:
      return state;
  }
};

export const currentPages = (state : CurrentPagesState = Immutable.Map(), action : Action) => {
  const { type, meta } = action;

  switch (type) {
    case REQUEST_PAGE:
      return state.set(meta.name, getPageUrlFromAction(action));
    default:
      return state;
  }
};

export const currentView = (state : CurrentViewState = Immutable.Map(), action : Action) => {
  const { type, meta, payload } = action;

  switch (type) {
    case RESET_VIEW:
      return state.set(meta.name, 1);
    case CHANGE_VIEW:
      return state.set(meta.name, payload.view);
    default:
      return state;
  }
};

export const items = (state : ItemsState = Immutable.Map(), action : Action) => {
  const { type, payload, meta } = action;

  switch (type) {
    case RECEIVE_PAGE: {
      const newItems = payload.items.reduce((previous, item) => (
        previous.set(String(item[meta.idKey]), Immutable.Map(item))
      ), Immutable.Map());

      return state.merge(newItems);
    }
    default:
      return state;
  }
};
