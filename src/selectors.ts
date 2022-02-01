import * as Immutable from "immutable";
import { createSelector } from "reselect";
import type { State, PagesState } from "./types";

const
  pagesSelector = (state: State) => state,

  rowsPerPage = 50,
  pageSelector = createSelector(
    pagesSelector,
    (state: State, token: string) => token,
    (pages: PagesState, token: string) => pages.get(token),
  ),
  getAllResults = createSelector(
    pageSelector,
    (state : State, token : string, items : any) => items,
    (page : any, items : any) => {
      if (typeof page === "undefined") {
        return Immutable.List();
      }

      return page.get("ids").map((id) => items.get(String(id)));
    },
  ),
  getResultsUpToPage = createSelector(
    pageSelector,
    (state : State, token : string, items : any) => items,
    (state : State, token : string, items, target) => target,
    (state : State, token : string, items, target, perPage) => perPage || rowsPerPage,
    (page : any, items, target, perPage) => {
      if (typeof page === "undefined") {
        return Immutable.List();
      }

      const ids = page.get("ids").slice(0, perPage * target);

      return ids.map((id) => items.get(String(id)));
    }),
  getCurrentTotalResultsCount = createSelector(
    pageSelector,
    (page : any) => {
      if (typeof page === "undefined") {
        return 0;
      }

      return page.get("total");
    }),
  isPageFetching = createSelector(
    pageSelector,
    (state : State, token : string, target) => target,
    (page : any, target) => {
      if (typeof page === "undefined") {
        return false;
      }

      return page.get("fetching") && target === page.get("page");
    }),
  isPageFetched = createSelector(
    pageSelector,
    (state : State, token : string, target) => target,
    (page : any, target) => {
      if (typeof page === "undefined") {
        return false;
      }

      return page.get("fetched") && target <= page.get("page");
    }),
  hasPageProblems = createSelector(
    pageSelector,
    (page : any) => {
      if (typeof page === "undefined") {
        return false;
      }

      return page.get("error");
    }),
  getCurrentView = createSelector(
    pageSelector,
    (page : any) => {
      if (typeof page === "undefined") {
        return 1;
      }

      return page.get("view");
    }),

  // these selectors are used for the entire app
  getPaginatorPaginations = (state: any, name: string) => state.getIn(["paginations", name]),
  getPaginatorEntities = (state: any, name: string) => state.getIn(["entities", name]),
  getPaginators = createSelector(
    getPaginatorPaginations,
    getPaginatorEntities,
    (list, entities) => ({
      list,
      entities,
    }),
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
