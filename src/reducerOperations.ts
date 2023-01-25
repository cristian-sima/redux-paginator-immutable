import * as Immutable from "immutable";
import { Action } from "redux";
import { PagesState, RequestPageAction, ReceivePageAction, ChangeViewAction, ItemsState } from "./types";

const requestPage = (state: PagesState, action: RequestPageAction) => {
    const
      { payload: { token, page } } = action,
      // it is the type any because ts apparently has a problem
      elements : any = Immutable.Map({
        page,
        error    : false,
        fetching : true,
        fetched  : false,
      });

    if (state.has(token)) {
      return state.update(token, (current : any) => current.merge(elements));
    }

    const init = elements.merge({
      view : 1,
      token,
      ids  : Immutable.List(),
    });

    return state.set(token, init);
  },
  receivePage = (state: PagesState, action: ReceivePageAction) => {
    const {
      meta: {
        idKey,
      },
      payload: {
        token,
        items,
        total,
        error,
      },
    } = action;

    if (state.has(token)) {
      const hasError = error === true;

      return state.update(token, (
        (current : any) => current.update((page : any) => current.merge(Immutable.Map({
          ids      : page.get("ids").concat(Immutable.List(items.map((item) => String(item[idKey])))),
          fetching : false,
          error    : hasError,
          fetched  : true,
          total    : hasError ? page.get("total") : total,
        })))
      ));
    }

    return state;
  },
  performChangeView = (state: PagesState, action: any, view: number) => {
    const {
        payload: {
          token,
        },
      } = action,
      item = state.get(token);

    if (typeof item === "undefined") {
      return state;
    }

    return state.update(token, (current : any) => current.set("view", view));
  },
  changeView = (state: PagesState, action: ChangeViewAction) => (
    performChangeView(state, action, action.payload.view)
  ),
  resetView = (state: PagesState, action: Action) => performChangeView(state, action, 1),
  receivePageItems = (state: ItemsState, action: ReceivePageAction) => {
    const
      { payload, meta } = action,
      { items: payloadItems } = payload,
      { idKey, manageEntity } = meta,
      manage = typeof manageEntity === "function" ? manageEntity : (
        (item : any) => Immutable.Map(item)
      ),
      newItems = payloadItems.reduce(
        (previous, item) => (
          previous.set(String(item[idKey]), manage(item, state, idKey))
        ), Immutable.Map(),
      );

    return state.merge(newItems);
  };

export { requestPage, receivePage, performChangeView, changeView, resetView, receivePageItems };
