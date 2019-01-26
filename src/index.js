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

  // for state
  getPaginatorPaginations,
  getPaginatorEntities,
  getPaginators,
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

  getPaginatorPaginations,
  getPaginatorEntities,
  getPaginators,
};
