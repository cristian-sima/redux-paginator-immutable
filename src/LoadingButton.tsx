/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
import React from "react";
import { ErrorMessage, LoadingMessage } from "x25/Messages";
import { useInView } from "react-intersection-observer";

type LoadingButtonPropTypes = {
  isFetching: boolean;
  hasProblems: boolean;
  fetchMore: () => void;
};
import { words } from "x25/utility";

class ErrorBoundary extends React.Component {
  constructor (props : any) {
    super(props);
  }

  componentDidCatch () {
  }

  static getDerivedStateFromError () {
    return { hasError: true };
  }

  render () {
    return this.props.children;
  }
}

const
  LoadingButton = (props : LoadingButtonPropTypes) => {
    const
      { isFetching, hasProblems, fetchMore } = props,
      [ref, inView] = useInView({ });

    React.useEffect(() => {
      if (!isFetching && !hasProblems && inView) {
        fetchMore();
      }
    }, [isFetching, hasProblems, inView]);

    return (
      <div className="text-center my-2">
        {hasProblems ? <ErrorMessage message={words.ThereWasAProblem} /> : null}
        {isFetching ? <LoadingMessage message={words.LoadingData} sm /> : (
          <button
            className="btn btn-link d-print-none"
            disabled={isFetching}
            onClick={fetchMore}
            ref={ref}
            type="button">
            {isFetching ? words.LoadingData : words.LoadMore}
          </button>
        )}
      </div>
    );
  },
  Loading = (props : LoadingButtonPropTypes) => (
    <ErrorBoundary>
      <LoadingButton {...props} />
    </ErrorBoundary>
  );

export default Loading;
