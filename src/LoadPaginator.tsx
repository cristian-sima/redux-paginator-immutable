import * as Immutable from "immutable";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LargeErrorMessage, LoadingMessage } from "x25/Messages";
import { words } from "x25/utility";
import LoadingButton from "./LoadingButton";
import selectors from "./selectors";

import { ChangeView, List, LoadData, LoadPaginatorPropTypes, ResetView } from "./LoadPaginatorTypes";

const
  LoadPaginator = (props : LoadPaginatorPropTypes) => {
    const
      { token, settings } = props,

      { list, entities } = useSelector((state : never) => (
        selectors.getPaginators(state, settings.key)
      )),

      currentPage = selectors.getCurrentView(list, token),
      isFetching = selectors.isPageFetching(list, token, currentPage),
      isFetched = selectors.isPageFetched(list, token, currentPage),
      resultsUpTo = (
        selectors.getResultsUpToPage(list, token, entities, currentPage, settings.rowsPerLoad)
      ),
      items = settings.manipulateItems(resultsUpTo),
      total = selectors.getCurrentTotalResultsCount(list, token),
      hasProblems = selectors.hasPageProblems(list, token),

      paginator = Immutable.Map({
        currentPage,
        hasProblems,
        isFetched,
        isFetching,
        items,
        total,
      }),

      dispatch = useDispatch(),
      resetView : ResetView = (currentToken) => dispatch(settings.resetView(currentToken)),
      changeView : ChangeView = (data) => dispatch(settings.changeView(data)),
      loadData : LoadData = (page) => dispatch(settings.requestPage(page, token)),

      showLoading = paginator.get("total") !== items.size,

      shouldFetch = !isFetched && !isFetching && !props.preventFetching,
      handleLoadMoreClick = () => {
        if (hasProblems) {
          loadData(currentPage);
        } else {
          changeView({
            token,
            view: currentPage + 1,
          });
        }
      };

    useEffect(() => {
      if (shouldFetch) {
        loadData(currentPage);
      }
    }, [shouldFetch]);

    useEffect(() => () => resetView(token), []);

    if (props.preventAutoLoading) {
      return (
        React.cloneElement(props.children as React.ReactElement<List>, {
          token    : props.token,
          settings : props.settings,
          paginator,
          changeView,
          resetView,
          loadData,
        })
      );
    }

    if (items.size === 0 && (isFetching || !isFetched)) {
      return <LoadingMessage message={words.LoadingData} />;
    }

    if (hasProblems && currentPage === 1) {
      return (
        <LargeErrorMessage
          message={words.ThereWasAProblem}
          onRetry={handleLoadMoreClick}
        />
      );
    }

    return (
      <div className="mb-3">
        {
          React.cloneElement(props.children as React.ReactElement<List>, {
            token    : props.token,
            settings : props.settings,
            paginator,
            changeView,
            resetView,
            loadData,
          })
        }
        {
          showLoading && !props.preventAutoLoading ? (
            <LoadingButton
              fetchMore={handleLoadMoreClick}
              hasProblems={hasProblems}
              isFetching={isFetching}
            />
          ) : null
        }
      </div>
    );
  };

export default LoadPaginator;
