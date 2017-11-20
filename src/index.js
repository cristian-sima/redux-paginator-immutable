// @flow

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
} from "./selectors";

export {
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
};
