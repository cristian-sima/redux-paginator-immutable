import React from "react";
import { ErrorMessage, LoadingMessage } from "x25/Messages";

type LoadingButtonPropTypes = {
  isFetching: boolean;
  hasProblems: boolean;
  onLoadMoreClick: () => void;
};
import { words } from "x25/utility";

const LoadingButton = (props : LoadingButtonPropTypes) => {
  const { isFetching, hasProblems, onLoadMoreClick } = props;

  return (
    <div className="text-center my-2">
      {hasProblems ? <ErrorMessage message={words.ThereWasAProblem} /> : null}
      {isFetching ? <LoadingMessage message={words.LoadingData} sm /> : (
        <button
          className="btn btn-outline-info d-print-none"
          disabled={isFetching}
          onClick={onLoadMoreClick}
          type="button">
          {isFetching ? words.LoadingData : words.LoadMore}
        </button>
      )}
    </div>
  );
};

export default LoadingButton;
