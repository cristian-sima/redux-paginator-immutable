
import React, { useEffect, useMemo } from "react";
import * as Immutable from "immutable";
import { useDispatch, useSelector } from "react-redux";
import { LargeErrorMessage, LoadingMessage } from "x25/Messages";
import selectors from "./selectors";
import LoadingButton from "./LoadingButton";
import words from "./words";

import { ChangeView, List, LoadData, LoadPaginatorPropTypes, ResetView } from "./LoadPaginatorTypes";

const
  LoadPaginator = (props : LoadPaginatorPropTypes) => {
    const
      { token, settings } = props,

      { list, entities } = useSelector((state : never) => (
        selectors.getPaginators(state, settings.key)
      )),

      paginator = useMemo(() => {
        const
          currentPage = selectors.getCurrentView(list, token),
          isFetching = selectors.isPageFetching(list, token, currentPage),
          isFetched = selectors.isPageFetched(list, token, currentPage),
          isNextFetching = selectors.isPageFetching(list, token, currentPage + 1),
          isNextFetched = selectors.isPageFetched(list, token, currentPage + 1),
          // eslint-disable-next-line max-len
          resultsUpTo = selectors.getResultsUpToPage(list, token, entities, currentPage, settings.rowsPerLoad),
          items = settings.manipulateItems(resultsUpTo),
          total = selectors.getCurrentTotalResultsCount(list, token),
          // currentPage was previously given to the following function
          hasProblems = selectors.hasPageProblems(list, token),
          shouldLoadNext = !isNextFetched && !isNextFetching;

        return Immutable.Map({
          currentPage,
          hasProblems,
          isFetched,
          isFetching,
          items,
          shouldLoadNext,
          total,
        });
      }, [list, entities]),

      dispatch = useDispatch(),
      resetView : ResetView = (currentToken) => dispatch(settings.resetView(currentToken)),
      changeView : ChangeView = (data) => dispatch(settings.changeView(data)),
      loadData : LoadData = (page) => dispatch(settings.requestPage(String(page), token)),

      items = paginator.get("items"),
      hasProblems = paginator.get("hasProblems"),
      currentPage = paginator.get("currentPage"),
      isFetching = paginator.get("isFetching"),
      showLoading = paginator.get("total") !== items.size,

      isFetched = paginator.get("isFetched"),
      shouldFetch = !isFetched && !isFetching,
      handleLoadMoreClick = () => {
        const
          shouldLoadNext = paginator.get("shouldLoadNext");

        if (hasProblems) {
          loadData(currentPage);
        } else {
          changeView({
            token,
            view: currentPage + 1,
          });

          if (shouldLoadNext) {
            loadData(currentPage + 1);
          }
        }
      };

    // eslint-disable-next-line no-console
    console.log("paginator", paginator);
    // eslint-disable-next-line no-console
    console.log("paginator ? paginator.toJS() : null", paginator ? paginator.toJS() : null);

    useEffect(() => {
      if (shouldFetch) {
        loadData(currentPage);
      }

      return () => resetView(token);
    }, [shouldFetch, paginator]);

    if (items.size === 0 && isFetching) {
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
      <>
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
          showLoading ? (
            <LoadingButton
              hasProblems={hasProblems}
              isFetching={isFetching}
              onLoadMoreClick={handleLoadMoreClick}
            />
          ) : null
        }
      </>
    );
  };

export default LoadPaginator;
