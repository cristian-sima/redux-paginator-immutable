import { createSelector } from "reselect";
import { PaginatorSettings } from "./types";

/*
  Use to create a simple list where you do not need more information about
  the item. For instance, if you do NOT need to fetch more data or
  manipulate it
*/
const createReducer = ({ key }: PaginatorSettings) => {
  const
    getItems = (state: any) => state.getIn(["entities", key]),
    getItem : (state : any, id : string) => any = createSelector(
      getItems,
      (_state : any, id : string) => id,
      (data : any, id : string) => data.get(id),
    ),
    getItemsList = createSelector(
      getItems,
      (data : any) => data.toList(),
    );

  return {
    getItems,
    getItem,
    getItemsList,
  };
};

export default createReducer;
