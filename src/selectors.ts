import * as Immutable from "immutable";
import { createSelector } from "reselect";
import { State, PagesState } from "./types";

const
  pagesSelector = (state: State) => state,
  pageSelector = createSelector(
    pagesSelector,
    (_state: State, token: string) => token,
    (pages: PagesState, token: string) => pages.get(token),
  ),
  getAllResults = createSelector(
    pageSelector,
    (_state : State, _token : string, items : any) => items,
    (page : any, items : any) => {
      if (typeof page === "undefined") {
        return Immutable.List();
      }

      return page.get("ids").map((id : number) => items.get(String(id)));
    },
  ),
  getResultsUpToPage = createSelector(
    pageSelector,
    (_state : State, _token : string, items : any) => items,
    (_state : State, _token : string, _items: any, target: any) => target,
    (_state : State, _token : string, _items : any, _target : any, perPage : number) => (
      perPage
    ),
    (page : any, items : any, target : any, perPage : any) => {
      if (typeof page === "undefined") {
        return Immutable.List();
      }

      const ids = page.get("ids").slice(0, perPage * target);

      return ids.map((id : number) => items.get(String(id)));
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
    (_state : State, _token : string, target : any) => target,
    (page : any, target : any) => {
      if (typeof page === "undefined") {
        return false;
      }

      return page.get("fetching") && target === page.get("page");
    }),
  isPageFetched = createSelector(
    pageSelector,
    (_state : State, _token : string, target : any) => target,
    (page : any, target : any) => {
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
    (list : any, entities : any) => ({
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
