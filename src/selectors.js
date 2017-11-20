// @flow

import type { State } from "./types";

import pick from "lodash.pick";

export const getCurrentPageNumber = (state : State, name : string) => {
  const currentPage = state.pages[state.currentPages[name]];

  return typeof currentPage === "undefined" ? 1 : currentPage.number;
};

export const getCurrentPageResults = (items : Array<any>, state : State, name : string) => {
  const currentPage = state.pages[state.currentPages[name]];

  if (typeof currentPage === "undefined") {
    return [];
  }

  return (
    Object.values(pick(items || [], currentPage.ids))
  );
};

export const getAllResults = (items : Array<any>, state : State, name : string) => {
  const currentPage = state.pages[state.currentPages[name]];

  if (typeof currentPage === "undefined") {
    return [];
  }

  const allPagesKeys = Object.keys(state.pages);
  let allPagesIds = [];

  for (const key of allPagesKeys) {
    if (state.pages[key].params === currentPage.params) {
      allPagesIds = allPagesIds.concat(state.pages[key].ids);
    }
  }

  return Object.values(pick(items || [], allPagesIds));
};

export const getResultsUpToPage =
(items : Array<any>, state : State, name : string, target : number) => {
  const currentPage = state.pages[state.currentPages[name]];

  if (typeof currentPage === "undefined") {
    return [];
  }

  const allPagesKeys = Object.keys(state.pages);
  let allPagesIds = [];

  for (const key of allPagesKeys) {
    const shouldInclude = (
      state.pages[key].params === currentPage.params &&
      state.pages[key].number <= target
    );

    if (shouldInclude) {
      allPagesIds = allPagesIds.concat(state.pages[key].ids);
    }
  }

  return Object.values(pick(items || [], allPagesIds));
};

export const getCurrentTotalResultsCount = (state : State, name : string) => {
  const currentPageUrl = state.currentPages[name];

  if (typeof currentPageUrl === "undefined") {
    return 0;
  }

  const currentPage = state.pages[currentPageUrl];

  return state.params[currentPage.params];
};

export const isCurrentPageFetching = (state : State, name : string) => {
  const value = state.pages[state.currentPages[name]];

  if (typeof value === "undefined") {
    return true;
  }

  return value.fetching;
};

export const isCurrentPageFetched = (state : State, name : string) => {
  const value = state.pages[state.currentPages[name]];

  if (typeof value === "undefined") {
    return false;
  }

  return value.fetched;
};

const getPage = (state : State, name : string, target : number) => {
  const allPagesKeys = Object.keys(state.pages);

  for (const key of allPagesKeys) {
    const current = state.pages[key];

    if (current.number === target) {
      return current;
    }
  }

  return null;
};

export const isPageFetching = (state : State, name : string, target : number) => {

  const targetPage = getPage(state, name, target);

  if (targetPage === null) {
    return true;
  }

  return targetPage.fetching;
};

export const isPageFetched = (state : State, name : string, target : number) => {

  const targetPage = getPage(state, name, target);

  if (targetPage === null) {
    return false;
  }

  return targetPage.fetched;
};

export const hasPageProblems = (state : State, name : string, target : number) => {

  const targetPage = getPage(state, name, target);

  if (targetPage === null) {
    return false;
  }

  return targetPage.error;
};
