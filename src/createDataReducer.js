// @flow
/* eslint-disable max-lines-per-function,  */

import type { PaginatorSettings } from "./types";

import { createSelector } from "reselect";
import * as Immutable from "immutable";

/*
  Use to create a complex list where you need more information about
  the item. For instance, if you DO need to fetch more data or to
  manipulate it
*/
const createDataReducer = ({ key } : PaginatorSettings) => {
  const
    getItems = (state : any) => state.getIn([
      "entities",
      key,
    ]),
    getItem = createSelector(
      getItems,
      (state, id) => id,
      (data, id) => data.get(id) || Immutable.Map()
    ),
    getItemsList = createSelector(
      getItems,
      (data) => data.map((current) => current.get("Data")).toList()
    ),
    getItemData = createSelector(
      getItems,
      (state, id) => id,
      (data, id) => {
        if (typeof data === "undefined") {
          return Immutable.Map();
        }

        return data.getIn([
          id,
          "Data",
        ]);
      }
    ),
    getItemHasError = createSelector(
      getItem,
      (data) => {
        if (typeof data === "undefined") {
          return false;
        }

        return data.get("error") === true;
      }
    ),
    getIsFetchingItemInfo = createSelector(
      getItem,
      (data) => {
        if (typeof data === "undefined") {
          return false;
        }

        return data.get("fetching");
      }
    ),
    getItemIsFetched = createSelector(
      getItem,
      (data) => {
        if (typeof data === "undefined") {
          return false;
        }

        return data.get("fetched");
      }
    ),
    getShouldFetchItemInfo = createSelector(
      getIsFetchingItemInfo,
      getItemIsFetched,
      getItemHasError,
      (isFetching, isFetched, hasError) => (
        !isFetched && !isFetching && !hasError
      )
    );

  return {
    getItems,
    getItem,
    getItemsList,
    getItemData,
    getItemHasError,
    getIsFetchingItemInfo,
    getItemIsFetched,
    getShouldFetchItemInfo,
  };
};

export default createDataReducer;
