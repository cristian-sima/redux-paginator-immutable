import React from "react";
import { ErrorMessage, LoadingMessage } from "x25/Messages";
import { useInView } from "react-intersection-observer";

type LoadingButtonPropTypes = {
  isFetching: boolean;
  hasProblems: boolean;
  onLoadMoreClick: () => void;
};
import { words } from "x25/utility";

const LoadingButton = (props : LoadingButtonPropTypes) => {
  const
    { isFetching, hasProblems, onLoadMoreClick } = props,
    [ref, inView] = useInView({
    // /* Optional options */
    // triggerOnce: true,
    // rootMargin: '0px 0px',
    });

  React.useEffect(() => {
    if (!isFetching && !hasProblems && inView) {
      onLoadMoreClick();
    }
  }, [isFetching, hasProblems, inView]);

  return (
    <div className="text-center my-2">
      {hasProblems ? <ErrorMessage message={words.ThereWasAProblem} /> : null}
      {isFetching ? <LoadingMessage message={words.LoadingData} sm /> : (
        <button
          className="btn btn-outline-info d-print-none"
          disabled={isFetching}
          onClick={onLoadMoreClick}
          ref={ref}
          type="button">
          {isFetching ? words.LoadingData : words.LoadMore}
        </button>
      )}
    </div>
  );
};

export default LoadingButton;
