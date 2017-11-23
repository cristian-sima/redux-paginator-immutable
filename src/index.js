// @flow

import { createPaginator, onlyForEndpoint } from "./createPaginator";
import paginatorMiddleware from "./paginatorMiddleware";

import {
  getAllResults,
  getCurrentTotalResultsCount,
  getResultsUpToPage,
  isPageFetching,
  isPageFetched,
  hasPageProblems,
  getCurrentView,
} from "./selectors";

export {
  createPaginator,
  onlyForEndpoint,

  paginatorMiddleware,

  getAllResults,
  getCurrentTotalResultsCount,
  getResultsUpToPage,
  isPageFetching,
  isPageFetched,
  hasPageProblems,
  getCurrentView,
};
