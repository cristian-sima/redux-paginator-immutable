// @flow
/* eslint-disable max-lines-per-function,  */

import type { PaginatorSettings } from "./types";

import { createSelector } from "reselect";

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
      (data, id) => data.get(id)
    ),
    getItemsList = createSelector(
      getItems,
      (data) => data.map((current) => current.get("Data")).toList()
    ),
    getItemData = createSelector(
      getItems,
      (state, id) => id,
      (data, id) => (
        data.getIn([
          id,
          "Data",
        ])
      )
    ),
    getItemHasError = createSelector(
      getItem,
      (data) => {
        if (typeof data === "undefined") {
          return false;
        }

        return data.get("errorFetchingInfo") === true;
      }
    ),
    getIsFetchingItemInfo = createSelector(
      getItem,
      (data) => {
        if (typeof data === "undefined") {
          return false;
        }

        return data.get("fetchingInfo");
      }
    ),
    getItemIsFetched = createSelector(
      getItem,
      (data) => {
        if (typeof data === "undefined") {
          return false;
        }

        return data.get("fetchedInfo");
      }
    ),
    getShouldFetchItemInfo = createSelector(
      getIsFetchingItemInfo,
      getItemIsFetched,
      (isFetching, isFetched) => (
        !isFetched && !isFetching
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
