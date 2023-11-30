/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
import React from "react";
import { useInView } from "react-intersection-observer";
import { ErrorMessage, LoadingMessage } from "x25/Messages";
import { words } from "x25/utility";

type LoadingButtonPropTypes = {
  readonly isFetching: boolean;
  readonly hasProblems: boolean;
  readonly fetchMore: () => void;
};

const
  LoadingButton = (props: LoadingButtonPropTypes) => {
    const
      { isFetching, hasProblems, fetchMore } = props,
      [ref, inView] = useInView({ });

    React.useEffect(() => {
      if (!isFetching && !hasProblems && inView) {
        fetchMore();
      }

    }, [isFetching, hasProblems, inView]);

    return (
      <button
        className="btn btn-link d-print-none"
        disabled={isFetching}
        onClick={fetchMore}
        ref={ref}
        type="button" >
        {isFetching ? words.LoadingData : words.LoadMore}
      </button>
    );
  },
  LoadingWrapper = (props: LoadingButtonPropTypes) => {
    const { isFetching, hasProblems } = props;

    return (
      <div className="text-center my-2">
        {hasProblems ? (
          <ErrorMessage message={words.ThereWasAProblem} />
        ) : null}
        {isFetching ? (
          <LoadingMessage message={words.LoadingData} sm />
        ) : (
          <LoadingButton {...props} />
        )}
      </div>
    );
  };

export default LoadingWrapper;
