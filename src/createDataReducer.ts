import { createSelector } from "reselect";
import * as Immutable from "immutable";
import { PaginatorSettings } from "./types";

type Selector = (state : any, id : string) => any;
type ListSelector = (state : any) => any;

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
      getItem : Selector = createSelector(
        getItems,
        (_state : any, id : string) => id,
        (data : any, id : string) : any => data.get(id) || Immutable.Map(),
      ),
      getItemsList : ListSelector = createSelector(
        getItems,
        (data : any) => data.map((current : any) => current.get("Data")).toList(),
      ),
      getItemData : Selector = createSelector(
        getItems,
        (_state : any, id : string) => id,
        (data : any, id : string) : any => {
          if (typeof data === "undefined") {
            return Immutable.Map();
          }

          return data.getIn([id, "Data"]);
        },
      ),
      getItemHasError : Selector = createSelector(
        getItem,
        (data : any) : boolean => {
          if (typeof data === "undefined") {
            return false;
          }

          return data.get("error") === true;
        },
      ),
      getIsFetchingItemInfo : Selector = createSelector(
        getItem,
        (data : any) : boolean => {
          if (typeof data === "undefined") {
            return false;
          }

          return data.get("fetching");
        },
      ),
      getItemIsFetched : Selector = createSelector(
        getItem,
        (data : any) : boolean => {
          if (typeof data === "undefined") {
            return false;
          }

          return data.get("fetched");
        },
      ),
      getShouldFetchItemInfo : Selector = createSelector(
        getIsFetchingItemInfo,
        getItemIsFetched,
        getItemHasError,
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
