import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ErrorMessage, LargeErrorMessage, LoadingMessage } from "x25/Messages";
import { words } from "x25/utility";
import { fetchItem as fetchItemAction } from "./actions";

type LoadDataItemPropTypes = {
  readonly sm?: boolean;
  readonly id: string;
  readonly children: React.ReactNode;
  readonly settings: {
    selectors: any;
    dataItemURL: string;
    endpoint: string;
    manageEntity: any;
    normalizeDataItem: any;
  };
};

const 
  LoadDataItem = (props: LoadDataItemPropTypes) : any => {
    const 
      { settings, id } = props,
      { selectors } = settings,
      data        = useSelector((state) => selectors.getItem(state, id)),
      hasError    = useSelector((state) => selectors.getItemHasError(state, id)),
      isFetched     = useSelector((state) => selectors.getItemIsFetched(state, id)),
      isFetching  = useSelector((state) => selectors.getIsFetchingItemInfo(state, id)),
      shouldFetch = useSelector((state) => selectors.getShouldFetchItemInfo(state, id)),
      isLoading = (
        isFetching || 
        data.size === 0 ||
        !isFetched
      ),
      dispatch = useDispatch(),
      fetchItem = () => {
        dispatch(fetchItemAction({
          ...settings,
          id,
        // eslint-disable-next-line no-empty-function
        })).catch(() => {});
      };

    React.useEffect(() => {
      if (shouldFetch) {
        fetchItem();
      }
    }, [shouldFetch]);

    if (hasError) {
      if (props.sm) {
        return (
          <ErrorMessage message={(
            <i className="fa fa fa-exclamation-triangle text-warning" />
          ) as unknown as any} />
        );
      }

      return <LargeErrorMessage message={words.ThereWasAProblem} onRetry={fetchItem} />;
    }

    if (isLoading) {
      if (props.sm) {
        return <LoadingMessage sm />;
      }

      return (
        <div className="text-center">
          <LoadingMessage message={words.LoadingData} />
        </div>
      );
    }


    return props.children;
  };

export default LoadDataItem;
