/* eslint-disable no-duplicate-imports */
type NormalizrEntity = (data: any) => any;

import type { Map as ImmutableMap } from "immutable";
import * as Immutable from "immutable";
import { createSelector } from "reselect";

type ManageDataEntity = ImmutableMap<string, any>;

// simple item
const
  manageEntity = (normalizrEntity: NormalizrEntity) => (
    (item: any, state: any, keyID: string): ManageDataEntity => {
      // prevent rewrite
      const old = state.get(String(item[keyID]));

      if (typeof old === "undefined") {
        return Immutable.Map(normalizrEntity(item));
      }

      return old;
    }
  ),
  manipulateItems = (sortKey = "ID") => createSelector(
    (data : any) => data,
    (data : any) => data.sortBy((current : any) => -current.get(sortKey)),
  ),

  // data item
  manageDataEntity = (normalizrEntity: NormalizrEntity) => (
    (item: any, state: any, keyID: string): ManageDataEntity => {
      // prevent rewrite
      const old = state.get(String(item[keyID]));

      if (typeof old === "undefined") {
        return Immutable.Map({
          Data: normalizrEntity(item),
        });
      }

      return old;
    }
  ),
  manipulateDataItems = (sortKey = "ID") => (
    createSelector(
      (data : any) => data,
      (data : any) => data.sortBy((current : any) => -current.getIn(["Data", sortKey])),
    )
  );

export { manageDataEntity, manipulateDataItems, manipulateItems, manageEntity };
