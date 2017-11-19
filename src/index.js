import { createPaginator } from "./createPaginator";
import paginatorMiddleware from "./paginatorMiddleware";

import {
  getCurrentPageNumber,
  getCurrentPageResults,
  getAllResults,
  getCurrentTotalResultsCount,
  isCurrentPageFetching,
} from "./selectors";

export {
  createPaginator,
  paginatorMiddleware,
  getCurrentPageNumber,
  getCurrentPageResults,
  getAllResults,
  getCurrentTotalResultsCount,
  isCurrentPageFetching,
};
