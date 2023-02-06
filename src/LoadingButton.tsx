/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
import React from "react";
import { useInView } from "react-intersection-observer";
import { ErrorMessage, LoadingMessage } from "x25/Messages";
import { words } from "x25/utility";

type LoadingButtonPropTypes = {
  isFetching: boolean;
  hasProblems: boolean;
  fetchMore: () => void;
};

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
  LoadingButton = (props: LoadingButtonPropTypes) => {
    const
      { isFetching, hasProblems, fetchMore } = props,
      [ref, inView] = useInView({}),
      [fetchMoreCalled, setFetchMoreCalled] = React.useState(false);

    React.useEffect(() => {
      if (!isFetching && !hasProblems && inView && !fetchMoreCalled) {
        fetchMore();
        setFetchMoreCalled(true);
      }
    }, [isFetching, hasProblems, inView, fetchMoreCalled, fetchMore]);

    return (
      <div className="text-center my-2">
        {hasProblems ? (
          <ErrorMessage message={words.ThereWasAProblem} />
        ) : null}
        {isFetching ? (
          <LoadingMessage message={words.LoadingData} sm />
        ) : (
          <button
            className="btn btn-link d-print-none"
            disabled={isFetching}
            onClick={fetchMore}
            ref={ref}
            type="button" >
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
