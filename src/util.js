// @flow
/* eslint-disable no-duplicate-imports */

type NormalizrEntity = (data : any) => any;

import type { Map as ImmutableMap } from "immutable";

import * as Immutable from "immutable";

import { createSelector } from "reselect";

type ManageDataEntity = ImmutableMap<string, *>;

const
  manageDataEntity = (
    (normalizrEntity : NormalizrEntity) => (item : any, state : any, keyID : string)
    : ManageDataEntity => {
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
  manipulateDataItems = createSelector(
    (data) => data,
    (data) => (
      data.sortBy((current) => current.getIn([
        "Data",
        "DateSort",
      ]))
    )
  );

export {
  manageDataEntity,
  manipulateDataItems,
};
