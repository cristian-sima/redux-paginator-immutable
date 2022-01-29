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

import { connect } from "react-redux";

// import {
//   useLocation,
//   useNavigate,
//   useParams,
// } from "react-router-dom";

// const withRouter = (Component) => {
//   const ComponentWithRouterProp = (props) => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const params = useParams();

//     return (
//       <Component
//         {...props}
//         router={{
//           location,
//           navigate,
//           params,
//         }}
//       />
//     );
//   };

//   return ComponentWithRouterProp;
// };

import { fetchItem as fetchItemAction } from "./actions";

import { LargeErrorMessage, LoadingMessage } from "x25/Messages";
import words from "./words";

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
      <LoadingMessage message={words.LoadingData} />
    );
  }

  if (hasError) {
    return (
      <LargeErrorMessage
        message={words.ThereWasAProblem}
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

export default connect(mapStateToProps, mapDispatchToProps)(LoadDataItem);
