// @flow

import * as React from "react";

type LoadDataItemPropTypes = {
  isFetching: bool;
  fetched: bool;
  id: string;
  hasError: bool;
  data: any;
  children: React.Node;
  shouldFetch: any;

  fetchItem: () => void;
};

type OwnProps = {
  id: string;
  settings: {
    selectors: any;
    dataItemURL: string;
    endpoint: string;
    manageEntity: any;
    normalizeDataItem: any;
  }
};

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { fetchItem as fetchItemAction } from "./actions";

import { LargeErrorMessage, LoadingMessage } from "x25/Messages";

const
  mapStateToProps = (state : any, { settings : { selectors }, id } : OwnProps) => ({
    data        : selectors.getItem(state, id),
    hasError    : selectors.getItemHasError(state, id),
    fetched     : selectors.getItemIsFetched(state, id),
    isFetching  : selectors.getIsFetchingItemInfo(state, id),
    shouldFetch : selectors.getShouldFetchItemInfo(state, id),
  }),
  mapDispatchToProps = (dispatch : any, { id, settings } : OwnProps) => ({
    fetchItem () {
      dispatch(fetchItemAction({
        ...settings,
        id,
      }));
    },
  });

const LoadDataItem = (props : LoadDataItemPropTypes) => {
  const { children, data, isFetching, shouldFetch, hasError, fetchItem } = props;

  React.useEffect(() => {
    if (shouldFetch) {
      fetchItem();
    }
  }, [
    shouldFetch,
    isFetching,
    hasError,
  ]);

  if (isFetching) {
    return (
      <LoadingMessage message="Preiau datele..." />
    );
  }

  if (hasError) {
    return (
      <LargeErrorMessage
        message="Nu am putut stabili conexiunea cu server-ul"
        onRetry={fetchItem}
      />
    );
  }

  if (data.size === 0) {
    return null;
  }

  return (
    children
  );
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoadDataItem));
