// @flow
/* eslint-disable no-undefined */

import type { State } from "./types";

import * as Immutable from "immutable";
import { createSelector } from "reselect";

// export const getCurrentPageNumber = (state : State, name : string) => {
//   const currentPage = state.pages.get(state.currentPages.get(name));
//
//   return typeof currentPage === "undefined" ? 1 : currentPage.get("number");
// };
//
// export const getCurrentPageResults = (items : any, state : State, name : string) => {
//   const currentPage = state.pages.get(state.currentPages.get(name));
//
//   if (typeof currentPage === "undefined") {
//     return Immutable.List();
//   }
//
//   return currentPage.get("ids").map((id) => items.get(String(id)));
// };

const pagesSelector = (state : State) => state.pages;
const currentPagesSelector = (state : State) => state.currentPages;
const paramsSelector = (state : State) => state.params;
const currentViewSelector = (state : State) => state.currentView;

const getCurrentPage = createSelector(
  pagesSelector,
  currentPagesSelector,
  (state, name) => name,
  (pages, currentPages, name) => pages.get(currentPages.get(name))
);

export const getPage = createSelector(
  pagesSelector,
  currentPagesSelector,
  (state, name) => name,
  (state, name, target) => target,
  (pages, currentPages, name, target) => {
    const currentPage = currentPages.get(name);

    if (typeof currentPage === "undefined") {
      return undefined;
    }

    const params = pages.getIn([
      currentPage,
      "params",
    ]);

    return (
      pages.find((current) => (
        current.get("params") === params &&
        current.get("number") === target
      ))
    );
  }
);

export const getAllResults = createSelector(
  pagesSelector,
  getCurrentPage,
  (state, name, items) => items,
  (pages, currentPage, items) => {
    if (typeof currentPage === "undefined") {
      return Immutable.List();
    }

    const ids = pages.reduce((previous, current) => {
      const shouldConcat = current.get("params") === currentPage.get("params");

      if (shouldConcat) {
        return previous.concat(current.get("ids"));
      }

      return previous;
    }, Immutable.List());

    return ids.map((id) => items.get(String(id)));
  }
);

export const getResultsUpToPage = createSelector(
  pagesSelector,
  getCurrentPage,
  (state, name, items) => items,
  (state, name, items, target) => target,
  (pages, currentPage, items, target) => {
    if (typeof currentPage === "undefined") {
      return Immutable.List();
    }

    const ids = pages.reduce((previous, current) => {
      const shouldConcat = (
        current.get("params") === currentPage.get("params") &&
        current.get("number") <= target
      );

      if (shouldConcat) {
        return previous.concat(current.get("ids"));
      }

      return previous;
    }, Immutable.List());

    return ids.map((id) => items.get(String(id)));
  }
);

export const getCurrentTotalResultsCount = createSelector(
  getCurrentPage,
  paramsSelector,
  (page, params) => {

    if (typeof page === "undefined") {
      return 0;
    }

    return params.get(page.get("params"));
  }
);

export const isCurrentPageFetching = createSelector(
  getCurrentPage,
  (page) => {

    if (typeof page === "undefined") {
      return false;
    }

    return page.get("fetching");
  }
);

export const isCurrentPageFetched = createSelector(
  getCurrentPage,
  (page) => {

    if (typeof page === "undefined") {
      return false;
    }

    return page.get("fetched");
  }
);

export const isPageFetching = createSelector(
  getPage,
  (page) => {

    if (typeof page === "undefined") {
      return false;
    }

    return page.get("fetching");
  }
);

export const isPageFetched = createSelector(
  getPage,
  (page) => {

    if (typeof page === "undefined") {
      return false;
    }

    return page.get("fetched");
  }
);

export const hasPageProblems = createSelector(
  getPage,
  (page) => {

    if (typeof page === "undefined") {
      return false;
    }

    return page.get("error");
  }
);

export const getCurrentView = createSelector(
  currentViewSelector,
  (state, name) => name,
  (currentView, name) => {
    const value = currentView.get(name);

    if (typeof value === "undefined") {
      return 1;
    }

    return value;
  }
);
