// @flow
/* eslint-disable no-undefined */

import type { State, PagesState } from "./types";

import * as Immutable from "immutable";
import { createSelector } from "reselect";

const pagesSelector = (state : State) => state;

export const rowsPerPage = 25;

const pageSelector = createSelector(
  pagesSelector,
  (state : State, token : string) => token,
  (pages : PagesState, token : string) => pages.get(token)
);

const getAllResults = createSelector(
  pageSelector,
  (state, token, items) => items,
  (page, items) => {
    if (typeof page === "undefined") {
      return Immutable.List();
    }

    return page.get("ids").map((id) => items.get(String(id)));
  }
);

const getResultsUpToPage = createSelector(
  pageSelector,
  (state, token, items) => items,
  (state, token, items, target) => target,
  (state, token, items, target, perPage) => perPage,
  (page, items, target, perPage) => {
    if (typeof page === "undefined") {
      return Immutable.List();
    }

    const ids = page.get("ids").slice(0, (perPage * target));

    return ids.map((id) => items.get(String(id)));
  }
);

const getCurrentTotalResultsCount = createSelector(
  pageSelector,
  (page) => {
    if (typeof page === "undefined") {
      return 0;
    }

    return page.get("total");
  }
);

const isPageFetching = createSelector(
  pageSelector,
  (state, token, target) => target,
  (page, target) => {
    if (typeof page === "undefined") {
      return false;
    }

    return (
      page.get("fetching") &&
      target === page.get("page")
    );
  }
);

const isPageFetched = createSelector(
  pageSelector,
  (state, token, target) => target,
  (page, target) => {
    if (typeof page === "undefined") {
      return false;
    }

    return (
      page.get("fetched") &&
      target <= page.get("page")
    );
  }
);

const hasPageProblems = createSelector(
  pageSelector,
  (page) => {
    if (typeof page === "undefined") {
      return false;
    }

    return page.get("error");
  }
);

const getCurrentView = createSelector(
  pageSelector,
  (page) => {
    if (typeof page === "undefined") {
      return 1;
    }

    return page.get("view");
  }
);


// these selectors are used for the entire app
const
  getPaginatorPaginations = (state : any, name : string) => state.getIn([
    "paginations",
    name,
  ]),
  getPaginatorEntities = (state : any, name : string) => state.getIn([
    "entities",
    name,
  ]),
  getPaginators = createSelector(
    getPaginatorPaginations,
    getPaginatorEntities,
    (list, entities) => ({
      list,
      entities,
    })
  );

export default {
  getAllResults,
  getCurrentTotalResultsCount,
  getResultsUpToPage,
  isPageFetching,
  isPageFetched,
  hasPageProblems,
  getCurrentView,

  // for state
  getPaginatorPaginations,
  getPaginatorEntities,
  getPaginators,
};
