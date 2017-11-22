// @flow
/* eslint-disable no-undefined */

import type { State } from "./types";

import * as Immutable from "immutable";

export const getCurrentPageNumber = (state : State, name : string) => {
  const currentPage = state.pages.get(state.currentPages.get(name));

  return typeof currentPage === "undefined" ? 1 : currentPage.get("number");
};

export const getCurrentPageResults = (items : any, state : State, name : string) => {
  const currentPage = state.pages.get(state.currentPages.get(name));

  if (typeof currentPage === "undefined") {
    return Immutable.List();
  }

  return currentPage.get("ids").map((id) => items.get(String(id)));
};

export const getAllResults = (items : any, state : State, name : string) => {
  const currentPage = state.pages.get(state.currentPages.get(name));

  if (typeof currentPage === "undefined") {
    return Immutable.List();
  }

  const ids = state.pages.reduce((previous, current) => {
    const shouldConcat = current.get("params") === currentPage.get("params");

    if (shouldConcat) {
      return previous.concat(current.get("ids"));
    }

    return previous;
  }, Immutable.List());

  return ids.map((id) => items.get(String(id)));
};

export const getResultsUpToPage = (items : any, state : State, name : string, target : number) => {
  const currentPage = state.pages.get(state.currentPages.get(name));

  if (typeof currentPage === "undefined") {
    return Immutable.List();
  }

  const ids = state.pages.reduce((previous, current) => {
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
};

export const getCurrentTotalResultsCount = (state : State, name : string) => {
  const currentPageUrl = state.currentPages.get(name);

  if (typeof currentPageUrl === "undefined") {
    return 0;
  }

  const currentPage = state.pages.get(currentPageUrl);

  return state.params.get(currentPage.get("params"));
};

export const isCurrentPageFetching = (state : State, name : string) => {
  const value = state.pages.get(state.currentPages.get(name));

  if (typeof value === "undefined") {
    return true;
  }

  return value.get("fetching");
};

export const isCurrentPageFetched = (state : State, name : string) => {
  const value = state.pages.get(state.currentPages.get(name));

  if (typeof value === "undefined") {
    return false;
  }

  return value.get("fetched");
};

export const getPage = (state : State, name : string, target : number) => {
  const value = state.pages.get(state.currentPages.get(name));

  if (typeof value === "undefined") {
    return undefined;
  }

  const params = value.get("params");

  return (
    state.pages.find((current) => (
      current.get("params") === params &&
      current.get("number") === target
    ))
  );
};

export const isPageFetching = (state : State, name : string, target : number) => {

  const page = getPage(state, name, target);

  if (typeof page === "undefined") {
    return true;
  }

  return page.get("fetching");
};

export const isPageFetched = (state : State, name : string, target : number) => {

  const page = getPage(state, name, target);

  if (typeof page === "undefined") {
    return false;
  }

  return page.get("fetched");
};

export const hasPageProblems = (state : State, name : string, target : number) => {

  const page = getPage(state, name, target);

  if (typeof page === "undefined") {
    return false;
  }

  return page.get("error");
};

export const getCurrentView = (state : State, name : string) => {
  const value = state.currentView.get(name);

  if (typeof value === "undefined") {
    return 1;
  }

  return value;
};
