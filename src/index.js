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
};
