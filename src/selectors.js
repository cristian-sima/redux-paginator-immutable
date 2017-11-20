// @flow

import type { State } from "./types";

import pick from "lodash.pick";

export const getCurrentPageNumber = (pagination : State, name : string) => {
  const currentPage = pagination.pages[pagination.currentPages[name]];

  return typeof currentPage === "undefined" ? 1 : currentPage.number;
};

export const getCurrentPageResults = (items, pagination, name) => {
  const currentPage = pagination.pages[pagination.currentPages[name]];

  if (typeof currentPage === "undefined") {
    return [];
  }

  return (
    Object.values(pick(items || [], currentPage.ids))
  );
};

export const getAllResults = (items, pagination : State, name : string) => {
  const currentPage = pagination.pages[pagination.currentPages[name]];

  if (typeof currentPage === "undefined") {
    return [];
  }

  const allPagesKeys = Object.keys(pagination.pages);
  let allPagesIds = [];

  for (const key of allPagesKeys) {
    if (pagination.pages[key].params === currentPage.params) {
      allPagesIds = allPagesIds.concat(pagination.pages[key].ids);
    }
  }

  return Object.values(pick(items || [], allPagesIds));
};

export const getCurrentTotalResultsCount = (pagination : State, name : string) => {
  const currentPageUrl = pagination.currentPages[name];

  if (typeof currentPageUrl === "undefined") {
    return 0;
  }

  const currentPage = pagination.pages[currentPageUrl];

  return pagination.params[currentPage.params];
};

export const isCurrentPageFetching = (pagination : State, name : string) => (
  (pagination.pages[pagination.currentPages[name]] || { fetching: true }).fetching
);
