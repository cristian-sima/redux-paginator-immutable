// @flow

import type {
  ItemsState,
  PagesState,

  Action,
  ReceivePageAction,
  ChangeViewAction,
  RequestPageAction,
} from "./types";

import {
  REQUEST_PAGE,
  RECEIVE_PAGE,
  RESET_VIEW,
  CHANGE_VIEW,
} from "./actionTypes";

import * as Immutable from "immutable";

const
  requestPage = (state : PagesState, action : RequestPageAction) => {
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
  receivePage = (state : PagesState, action : ReceivePageAction) => {
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
  performChangeView = (state : PagesState, action : Action, view : number) => {
    const { payload : { token } } = action;

    const item = state.get(token);

    if (typeof item === "undefined") {
      return state;
    }

    return state.update(token, (current) => (
      current.set("view", view)
    ));
  },
  changeView = (state : PagesState, action : ChangeViewAction) => (
    performChangeView(state, action, action.payload.view)
  ),
  resetView = (state : PagesState, action : Action) => (
    performChangeView(state, action, 1)
  ),
  receivePageItems = (state : ItemsState, action : ReceivePageAction) => {
    const { payload, meta } = action;
    const { items : payloadItems } = payload;
    const { idKey, initialItem } = meta;

    const newItems = payloadItems.reduce((previous, item) => (
      previous.set(String(item[idKey]), Immutable.Map(item).merge(initialItem))
    ), Immutable.Map());

    return state.merge(newItems);
  };

export const pages = (state : PagesState = Immutable.Map(), action : Action) => {
  switch (action.type) {
    case REQUEST_PAGE:
      return requestPage(state, action);

    case RECEIVE_PAGE:
      return receivePage(state, action);

    case RESET_VIEW:
      return resetView(state, action);

    case CHANGE_VIEW:
      return changeView(state, action);

    default:
      return state;
  }
};

export const items = (state : ItemsState = Immutable.Map(), action : Action) => {
  switch (action.type) {
    case RECEIVE_PAGE:
      return receivePageItems(state, action);
    default:
      return state;
  }
};
