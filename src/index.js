// @flow

import { resetView, changeView } from "./actions";
import { createPaginator } from "./createPaginator";
import paginatorMiddleware from "./paginatorMiddleware";

import {
  getCurrentPageNumber,
  getCurrentPageResults,
  getAllResults,
  getCurrentTotalResultsCount,
  isCurrentPageFetching,
  isCurrentPageFetched,
  getResultsUpToPage,
  isPageFetching,
  isPageFetched,
  hasPageProblems,
  getCurrentView,
} from "./selectors";

export {
  resetView,
  changeView,

  createPaginator,

  paginatorMiddleware,

  getCurrentPageNumber,
  getCurrentPageResults,
  getAllResults,
  getCurrentTotalResultsCount,
  isCurrentPageFetching,
  isCurrentPageFetched,
  getResultsUpToPage,
  isPageFetching,
  isPageFetched,
  hasPageProblems,
  getCurrentView,
};
