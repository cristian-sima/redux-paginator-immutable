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

class LoadDataItem extends React.Component<LoadDataItemPropTypes> {
  props: LoadDataItemPropTypes;

  componentWillMount () {
    const { shouldFetch, fetchItem } = this.props;

    if (shouldFetch) {
      fetchItem();
    }
  }

  shouldComponentUpdate (nextProps : LoadDataItemPropTypes) {
    return (
      this.props.data !== nextProps.data ||
      this.props.hasError !== nextProps.hasError ||
      this.props.fetched !== nextProps.fetched ||
      this.props.isFetching !== nextProps.isFetching ||
      this.props.shouldFetch !== nextProps.shouldFetch ||
      this.props.id !== nextProps.id
    );
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
