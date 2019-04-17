// @flow

import * as React from "react";

type LoadDataItemPropTypes = {
  isFetching: bool;
  hasError: bool;
  data: any;
  children: React.Node;
  shouldFetch: any;

  fetchItem: () => void;
};

type OwnProps = {
  id: string;
  paginator: {
    selectors: any;
    dataItemURL: string;
    manageEntity: any;
  }
};

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { fetchItem as fetchItemAction } from "./actions";

import { LargeErrorMessage, LoadingMessage } from "x25/Messages";

const
  mapStateToProps = (state : any, { paginator : { selectors }, id } : OwnProps) => ({
    data        : selectors.getItem(state, id),
    hasError    : selectors.getItemHasError(state, id),
    fetched     : selectors.getItemIsFetched(state, id),
    isFetching  : selectors.getIsFetchingItemInfo(state, id),
    shouldFetch : selectors.getShouldFetchItemInfo(state, id),
  }),
  mapDispatchToProps = (dispatch : any, { id, paginator } : OwnProps) => ({
    fetchItem () {
      dispatch(fetchItemAction({
        ...paginator,
        id,
      }));
    },
  });

class LoadDataItem extends React.Component<LoadDataItemPropTypes> {
  props: LoadDataItemPropTypes;

  componentWillMount () {
    const { shouldFetch, fetchItem } = this.props;

    if (shouldFetch) {
      fetchItem();
    }
  }

  componentWillReceiveProps (nextProps) {
    const { shouldFetch, fetchItem } = nextProps;

    if (shouldFetch) {
      fetchItem();
    }
  }

  render () {
    const { children, data, isFetching, hasError, fetchItem } = this.props;

    if (isFetching) {
      return (
        <LoadingMessage message="Preiau datele..." />
      );
    }

    if (hasError) {
      return (
        <LargeErrorMessage
          message="Ceva nu a mers bine"
          onRetry={fetchItem}
        />
      );
    }

    if (data.size === 0) {
      return null;
    }

    return (
      <React.Fragment>
        {children}
      </React.Fragment>
    );
  }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoadDataItem));
