// @flow

import type {
  ItemsState,
  PagesState,

  Action,
} from "./types";

import {
  REQUEST_PAGE,
  RECEIVE_PAGE,
  RESET_VIEW,
  CHANGE_VIEW,
} from "./actionTypes";

import * as Immutable from "immutable";
//
// const getPageUrlFromAction = ({ meta: { pageArgName }, payload: { params, page } }) =>
//   buildSuffix(pageArgName, page, params);

const requestPage = (state : PagesState, action : Action) => {
    const { payload : { token, page } } = action;

    return state.update(token, (current) => {
      const elements = Immutable.Map({
        ids      : Immutable.List(),
        token,
        number   : page,
        error    : false,
        fetching : true,
        fetched  : false,
      });

      if (typeof current === "undefined") {
        return elements;
      }

      return current.merge(elements);
    });
  },
  receivePage = (state : PagesState, action : Action) => {
    const {
      meta: { idKey },
      payload : { token, items, total, error },
    } = action;

    return state.update(token, (current) => {
      const elements = Immutable.Map({
        ids: Immutable.List(
          items.map((item) => String(item[idKey]))
        ),
        fetching : false,
        error    : error === true,
        fetched  : true,
        total,
      });

      if (typeof current === "undefined") {
        return elements;
      }

      return current.merge(elements);
    });
  },
  changeView = (state : PagesState, action : Action, view : number) => {
    const { payload : { token } } = state;

    const item = state.get(token);

    if (typeof item === "undefined") {
      return state;
    }

    return state.update(token, (current) => (
      current.set("view", view)
    ));
  };

export const pages = (state : PagesState = Immutable.Map(), action : Action) => {
  const { type, payload } = action;

  switch (type) {
    case REQUEST_PAGE:
      return requestPage(state, action);

    case RECEIVE_PAGE:
      return receivePage(state, action);

    case RESET_VIEW:
      return changeView(state, action, 1);

    case CHANGE_VIEW:
      return changeView(state, action, payload.view);

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
