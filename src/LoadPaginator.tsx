
import React, { useEffect, useMemo } from "react";
import * as Immutable from "immutable";
import { useDispatch, useSelector } from "react-redux";
import { LargeErrorMessage, LoadingMessage } from "x25/Messages";
import selectors from "./selectors";
import LoadingButton from "./LoadingButton";
import words from "./words";

type Settings = {
  key: string;
  rowsPerLoad: number;
  manipulateItems: (items: any) => void;
  resetView: (data: any) => void;
  changeView: (data: any) => void;
  requestPage: (page: string, token: string) => any;
};
type LoadPaginatorPropTypes = {
  token: string;
  children: React.ReactElement<any>;
  settings: Settings;
  paginator: any;
  changeView: (info: {
    token: string;
    view: number;
  }) => void;
  resetView: (token: string) => void;
  loadData: (page: number) => void;
};

type List = {
  token: string;
  settings: Settings;
  paginator: any;
  changeView: (info: {
    token: string;
    view: number;
  }) => void;
  resetView: (token: string) => void;
  loadData: (page: number) => void;
}

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
      resetView = (data : any) => dispatch(settings.resetView(data)),
      changeView = (data : any) => dispatch(settings.changeView(data)),
      loadData = (page : any) => dispatch(settings.requestPage(page, token)),

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
            token      : props.token,
            settings   : props.settings,
            paginator  : props.paginator,
            changeView : props.changeView,
            resetView  : props.resetView,
            loadData   : props.loadData,
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
