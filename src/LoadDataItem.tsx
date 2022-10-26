import * as React from "react";

type LoadDataItemPropTypes = {
  isFetching: boolean;
  fetched: boolean;
  id: string;
  hasError: boolean;
  data: any;
  children: React.ReactNode;
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
  };
};
import { connect } from "react-redux";
import { LargeErrorMessage, LoadingMessage } from "x25/Messages";
import { words } from "x25/utility";
import { fetchItem as fetchItemAction } from "./actions";

const
  mapStateToProps = (state: any, {
    settings: {
      selectors,
    },
    id,
  }: OwnProps) => ({
    data        : selectors.getItem(state, id),
    hasError    : selectors.getItemHasError(state, id),
    fetched     : selectors.getItemIsFetched(state, id),
    isFetching  : selectors.getIsFetchingItemInfo(state, id),
    shouldFetch : selectors.getShouldFetchItemInfo(state, id),
  }),
  mapDispatchToProps = (dispatch: any, {
    id,
    settings,
  }: OwnProps) => ({
    fetchItem () {
      dispatch(fetchItemAction({
        ...settings,
        id,
      }));
    },
  }),

  LoadDataItem = (props: LoadDataItemPropTypes) : any => {
    const {
      children,
      data,
      isFetching,
      shouldFetch,
      hasError,
      fetchItem,
    } = props;

    React.useEffect(() => {
      if (shouldFetch) {
        fetchItem();
      }
    }, [shouldFetch, isFetching, hasError]);

    if (isFetching) {
      return <LoadingMessage message={words.LoadingData} />;
    }

    if (hasError) {
      return <LargeErrorMessage message={words.ThereWasAProblem} onRetry={fetchItem} />;
    }

    if (data.size === 0) {
      return null;
    }

    return children;
  };

export default connect(mapStateToProps, mapDispatchToProps)(LoadDataItem);
