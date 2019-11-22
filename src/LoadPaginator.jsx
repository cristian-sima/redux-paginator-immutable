// @flow
/* eslint-disable  */

type Settings = {
  key: string;
  rowsPerLoad: number;
  manipulateItems: (items: any) => void;
  resetView: (data : any) => void;
  changeView: (data: any) => void;
  requestPage: (page: string, token : string) => any;
}

type OwnProps = {
  token: string;
  settings: Settings;
};

type LoadPaginatorPropTypes = {
  token: string;
  children: any;
  settings: Settings;
  paginator: any;
  // {
  //   currentPage,
  //   isFetching,
  //   isFetched,
  //   shouldLoadNext,
  //   items,
  //   hasProblems,
  //   total,
  // }

  changeView: (info : { token: string, view: number }) => void;
  resetView: (token : string) => void;

  loadData: (page : number) => void;
  changeFilter: (filter : string) => (event : { target : { value : string } }) => void;
};

import React, { Component } from "react";
import * as Immutable from "immutable";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import selectors from "./selectors";

import LoadingButton from "./LoadingButton";

import { LargeErrorMessage, LoadingMessage } from "x25/Messages";

const mapStateToProps = (state, { token, settings } : OwnProps) => {

    const { list, entities } = selectors.getPaginators(state, settings.key);

    const
      currentPage = selectors.getCurrentView(list, token),
      isFetching = selectors.isPageFetching(list, token, currentPage),
      isFetched = selectors.isPageFetched(list, token, currentPage),
      isNextFetching = selectors.isPageFetching(list, token, currentPage + 1),
      isNextFetched = selectors.isPageFetched(list, token, currentPage + 1),
      resultsUpTo = (
        selectors.getResultsUpToPage(list, token, entities, currentPage, settings.rowsPerLoad)
      ),
      items = settings.manipulateItems(resultsUpTo),
      total = selectors.getCurrentTotalResultsCount(list, token),
      hasProblems = selectors.hasPageProblems(list, token, currentPage);

    const shouldLoadNext = !isNextFetched && !isNextFetching;

    return {
      paginator: Immutable.Map({
        currentPage,
        hasProblems,
        isFetched,
        isFetching,
        items,
        shouldLoadNext,
        total,
      }),
    };
  },
  mapDispatchToProps = (dispatch, { token, settings } : OwnProps) => ({
    ...bindActionCreators({
      resetView  : settings.resetView,
      changeView : settings.changeView,
    }, dispatch),
    loadData (page) {
      dispatch(settings.requestPage(page, token));
    },
  });

class LoadPaginator extends Component<LoadPaginatorPropTypes> {

  handleLoadMoreClick: () => void;

  constructor (props : LoadPaginatorPropTypes) {
    super(props);

    this.handleLoadMoreClick = () => {
      const { paginator, token, changeView, loadData } = this.props;

      const
        currentPage = paginator.get("currentPage"),
        hasProblems = paginator.get("hasProblems"),
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
  }

  UNSAFE_componentWillMount () {
    const { paginator, loadData } = this.props;

    const
      isFetched = paginator.get("isFetched"),
      isFetching = paginator.get("isFetching"),
      currentPage = paginator.get("currentPage");

    const shouldFetch = !isFetched && !isFetching;

    if (shouldFetch) {
      loadData(currentPage);
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const { loadData, paginator } = nextProps;

    const
      isFetched = paginator.get("isFetched"),
      isFetching = paginator.get("isFetching"),
      currentPage = paginator.get("currentPage");

    const shouldFetch = !isFetched && !isFetching;

    if (shouldFetch) {
      loadData(currentPage);
    }
  }

  shouldComponentUpdate (nextProps : LoadPaginatorPropTypes) {
    return (
      this.props.paginator !== nextProps.paginator
    );
  }

  componentWillUnmount () {
    this.props.resetView(this.props.token);
  }

  render () {
    const { paginator } = this.props;

    const
      items = paginator.get("items"),
      hasProblems = paginator.get("hasProblems"),
      currentPage = paginator.get("currentPage"),
      isFetching = paginator.get("isFetching"),
      total = paginator.get("total");

    const
      isEmpty = items.size === 0,
      showLoading = total !== items.size;

    if (isEmpty && isFetching) {
      return (
        <LoadingMessage message="Preiau datele..." />
      );
    }

    if (hasProblems && currentPage === 1) {
      return (
        <LargeErrorMessage
          message="Nu pot prelua datele"
          onRetry={this.handleLoadMoreClick}
        />
      );
    }

    return (
      <React.Fragment>
        {React.cloneElement(this.props.children, this.props)}
        {
          showLoading ? (
            <LoadingButton
              hasProblems={hasProblems}
              isFetching={isFetching}
              onLoadMoreClick={this.handleLoadMoreClick}
            />
          ) : null
        }
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadPaginator);
