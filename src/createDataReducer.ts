/* eslint-disable max-lines-per-function,  */
import { createSelector } from "reselect";
import * as Immutable from "immutable";
import type { PaginatorSettings } from "./types";

/*
  Use to create a complex list where you need more information about
  the item. For instance, if you DO need to fetch more data or to
  manipulate it
*/
const
  createDataReducer = ({ key }: PaginatorSettings) => {
    const
      getItems = (state: any) : any => (
        state.getIn(["entities", key])
      ),
      getItem = createSelector(
        getItems,
        (_state : any, id : string) => id,
        (data : any, id : string) : any => data.get(id) || Immutable.Map(),
      ),
      getItemsList = createSelector(
        getItems,
        (data : any) => data.map((current : any) => current.get("Data")).toList(),
      ),
      getItemData = createSelector(
        getItems,
        (_state : any, id : string) => id,
        (data : any, id : string) : any => {
          if (typeof data === "undefined") {
            return Immutable.Map();
          }

          return data.getIn([id, "Data"]);
        },
      ),
      getItemHasError = createSelector(
        getItem,
        (data : any) : boolean => {
          if (typeof data === "undefined") {
            return false;
          }

          return data.get("error") === true;
        },
      ),
      getIsFetchingItemInfo = createSelector(
        getItem,
        (data : any) : boolean => {
          if (typeof data === "undefined") {
            return false;
          }

          return data.get("fetching");
        },
      ),
      getItemIsFetched = createSelector(
        getItem,
        (data : any) : boolean => {
          if (typeof data === "undefined") {
            return false;
          }

          return data.get("fetched");
        },
      ),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      getShouldFetchItemInfo = createSelector(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getIsFetchingItemInfo,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getItemIsFetched,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getItemHasError,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (isFetching : boolean, isFetched : boolean, hasError : boolean) : boolean => (
          !isFetched && !isFetching && !hasError
        ),
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
