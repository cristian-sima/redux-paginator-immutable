// @flow

import React from "react";
import { ErrorMessage, LoadingMessage } from "x25/Messages";

type LoadingButtonPropTypes = {
  isFetching: bool;
  hasProblems: bool;

  onLoadMoreClick: () => void;
};

import words from "./words";

class LoadingButton extends React.Component<LoadingButtonPropTypes> {
  props: LoadingButtonPropTypes;

  shouldComponentUpdate (nextProps : LoadingButtonPropTypes) {
    const { hasProblems, isFetching } = this.props;

    return (
      hasProblems !== nextProps.hasProblems ||
      isFetching !== nextProps.isFetching
    );
  }

  render () {
    const { isFetching, hasProblems, onLoadMoreClick } = this.props;

    return (
      <div className="text-center my-2">
        {
          hasProblems ? (
            <ErrorMessage message={words.ThereWasAProblem} />
          ) : null
        }
        {
          isFetching ? (
            <LoadingMessage message={words.LoadingData} sm />
          ) : (
            <button
              className="btn btn-outline-info d-print-none"
              disabled={isFetching}
              onClick={onLoadMoreClick}
              type="button">
              {isFetching ? words.Loading : words.LoadMore}
            </button>
          )
        }
      </div>
    );
  }
}

export default LoadingButton;
