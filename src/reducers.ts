import * as Immutable from "immutable";
import { Action, ItemsState, PagesState } from "./types";

import {
  CHANGE_VIEW,
  CLEAR_DATA,
  FETCH_CURRENT_COMPANY_INFO_PENDING,
  FETCH_ITEM_DATA_FULFILLED,
  FETCH_ITEM_DATA_PENDING,
  FETCH_ITEM_DATA_REJECTED,
  RECEIVE_PAGE,
  REQUEST_PAGE,
  RESET_VIEW,
} from "./actionTypes";

import * as reducerItemData from "./reducerItemData";
import { default as reducerOperations } from "./reducerOperations";


export const
  pages = (state: PagesState = Immutable.Map(), action: Action) => {
    switch (action.type) {
      case REQUEST_PAGE:
        return reducerOperations.requestPage(state, action);

      case RECEIVE_PAGE:
        return reducerOperations.receivePage(state, action);

      case RESET_VIEW:
        return reducerOperations.resetView(state, action);

      case CHANGE_VIEW:
        return reducerOperations.changeView(state, action);

      case FETCH_CURRENT_COMPANY_INFO_PENDING:
      case CLEAR_DATA:
        return state.clear();

      default:
        return state;
    }
  },
  items = (state: ItemsState = Immutable.Map(), action: Action) => {
    switch (action.type) {
      case RECEIVE_PAGE:
        return reducerOperations.receivePageItems(state, action);

      case FETCH_CURRENT_COMPANY_INFO_PENDING:
      case CLEAR_DATA:
        return state.clear();

      default:
        return state;
    }
  },
  dataItems = (state: ItemsState = Immutable.Map(), action: Action) => {
    switch (action.type) {
      case RECEIVE_PAGE:
        return reducerOperations.receivePageItems(state, action);

      case FETCH_ITEM_DATA_PENDING:
        return reducerItemData.fetchItemDataPending(state, action);

      case FETCH_ITEM_DATA_REJECTED:
        return reducerItemData.fetchItemDataRejected(state, action);

      case FETCH_ITEM_DATA_FULFILLED:
        return reducerItemData.fetchItemDataFulFilled(state, action);

      case FETCH_CURRENT_COMPANY_INFO_PENDING:
      case CLEAR_DATA:
        return state.clear();

      default:
        return state;
    }
  };
