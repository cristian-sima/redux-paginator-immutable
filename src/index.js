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

import Info from "./Info";
import LoadingButton from "./LoadingButton";

export {
  Info,
  LoadingButton,

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
