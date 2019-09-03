// @flow

type FetchItemDataFulFilledProps = {
  payload: {
    Data: any;
  };
  meta: {
    id: string;
  };
};

import * as Immutable from "immutable";

const defaultOptions = Immutable.Map({
  fetching : true,
  fetched  : false,
  error    : false,
});

const
  fetchItemDataPending = (state : any, { meta : { id } } : { meta : { id : string }}) => (
    state.update(id, (current) => {
      if (typeof current === "undefined") {
        return defaultOptions;
      }

      return current.mergeDeep(defaultOptions);
    })
  ),
  fetchItemDataRejected = (state : any, { meta : { id } } : { meta : { id : string }}) => (
    state.update((id), (current) => {
      if (typeof current === "undefined") {
        return current;
      }

      return current.mergeDeep(Immutable.Map({
        fetching : false,
        fetched  : false,
        error    : true,
      }));
    })
  ),
  fetchItemDataFulFilled = (state : any,
    { payload : { Data }, meta : { id } } : FetchItemDataFulFilledProps
  ) => (
    state.update((id), (current) => {
      if (typeof current === "undefined") {
        return current;
      }

      return current.mergeDeep(Immutable.Map({
        Data,
        fetching : false,
        fetched  : true,
        error    : false,
      }));
    })
  );

export {
  fetchItemDataPending,
  fetchItemDataRejected,
  fetchItemDataFulFilled,
};
