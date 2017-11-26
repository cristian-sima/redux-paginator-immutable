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
// const getPageUrlFromAction = ({ meta: { pageArgName }, payload: { token, page } }) =>
//   buildSuffix(pageArgName, page, token);

const requestPage = (state : PagesState, action : Action) => {
    const { payload : { token, page } } = action;

    const elements = Immutable.Map({
      page,
      error    : false,
      fetching : true,
      fetched  : false,
    });

    if (state.has(token)) {
      return state.update(token, (current) => (
        current.merge(elements)
      ));
    }

    const init = elements.merge({
      view : 1,
      token,
      ids  : Immutable.List(),
    });

    return state.set(token, init);
  },
  receivePage = (state : PagesState, action : Action) => {
    const {
      meta: { idKey },
      payload : { token, items, total, error },
    } = action;

    if (state.has(token)) {
      const hasError = error === true;

      return state.update(token, (current) => (
        current.update((page) => (
          current.merge(
            Immutable.Map({
              ids: page.get("ids").concat(
                Immutable.List(
                  items.map((item) => String(item[idKey]))
                )
              ),
              fetching : false,
              error    : hasError,
              fetched  : true,
              total    : hasError ? page.get("total") : total,
            })
          )
        ))
      ));
    }

    return state;
  },
  changeView = (state : PagesState, action : Action, view : number) => {
    const { payload : { token } } = action;

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
