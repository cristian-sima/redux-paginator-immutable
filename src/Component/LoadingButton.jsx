// @flow

import React from "react";

type LoadingButtonPropTypes = {
  isFetching: bool;
  hasProblems: bool;

  onLoadMoreClick: () => void;
};

import { ErrorMessage, LoadingMessage } from "x25/Messages";

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
            <ErrorMessage message="Nu am putut prelua. Încearcă încă o dată..." />
          ) : null
        }
        {
          isFetching ? (
            <LoadingMessage message="Preiau date..." sm />
          ) : (
            <button
              className="btn btn-outline-info d-print-none"
              disabled={isFetching}
              onClick={onLoadMoreClick}
              type="button">
              {isFetching ? "Încarc..." : "Încarcă mai mule"}
            </button>
          )
        }
      </div>
    );
  }
}

export default LoadingButton;
