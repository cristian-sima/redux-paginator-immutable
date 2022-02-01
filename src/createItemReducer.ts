import { createSelector } from "reselect";
import type { PaginatorSettings } from "./types";

/*
  Use to create a simple list where you do not need more information about
  the item. For instance, if you do NOT need to fetch more data or
  manipulate it
*/
const createReducer = ({ key }: PaginatorSettings) => {
  const
    getItems = (state: any) => state.getIn(["entities", key]),
    getItem = createSelector(
      getItems,
      (_state : any, id : any) => id,
      (data : any, id : any) => data.get(id),
    ),
    getItemsList = createSelector(
      getItems,
      (data) => data.toList(),
    );

  return {
    getItems,
    getItem,
    getItemsList,
  };
};

export default createReducer;
