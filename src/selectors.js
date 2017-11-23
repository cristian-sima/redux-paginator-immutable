// @flow
/* eslint-disable no-undefined */

import type { State } from "./types";

import * as Immutable from "immutable";
import { createSelector } from "reselect";

const pagesSelector = (state : State) => state;

const rowsPerPage = 50;

const pageSelector = createSelector(
  pagesSelector,
  (state, token) => token,
  (pages, token) => pages.get(token)
);

export const getAllResults = createSelector(
  pageSelector,
  (state, token, items) => items,
  (page, items) => {
    if (typeof page === "undefined") {
      return Immutable.List();
    }

    return page.get("ids").map((id) => items.get(String(id)));
  }
);

export const getResultsUpToPage = createSelector(
  pageSelector,
  (state, token, items) => items,
  (state, token, items, target) => target,
  (state, token, items, target, perPage) => perPage || rowsPerPage,
  (page, items, target, perPage) => {
    if (typeof page === "undefined") {
      return Immutable.List();
    }

    const ids = page.get("ids").slice(0, (perPage * target));

    return ids.map((id) => items.get(String(id)));
  }
);

export const getCurrentTotalResultsCount = createSelector(
  pageSelector,
  (page) => {
    if (typeof page === "undefined") {
      return 0;
    }

    return page.get("total");
  }
);

export const isPageFetching = createSelector(
  pageSelector,
  (page) => {
    if (typeof page === "undefined") {
      return false;
    }

    return page.get("fetching");
  }
);

export const isPageFetched = createSelector(
  pageSelector,
  (page) => {
    if (typeof page === "undefined") {
      return false;
    }

    return page.get("fetched");
  }
);

export const hasPageProblems = createSelector(
  pageSelector,
  (page) => {
    if (typeof page === "undefined") {
      return false;
    }

    return page.get("error");
  }
);

export const getCurrentView = createSelector(
  pageSelector,
  (page) => {
    if (typeof page === "undefined") {
      return 1;
    }

    return page.get("view");
  }
);
