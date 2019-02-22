/* eslint-disable max-len, no-undefined, max-lines-per-function, no-magic-numbers */

import chai, { expect } from "chai";
import chaiImmutable from "chai-immutable";

chai.use(chaiImmutable);

import selectors from "../selectors";

const {
  getCurrentTotalResultsCount,
  getAllResults,
  getResultsUpToPage,
  isPageFetched,
  isPageFetching,
  getCurrentView,
} = selectors;

import * as Immutable from "immutable";

const paginator = Immutable.Map({
  "foo=bar": Immutable.Map({
    page  : 3,
    token : "foo=bar",
    ids   : Immutable.List([
      1,
      2,
      3,
      7,
      8,
      9,
    ]),
    total    : 42,
    view     : 2,
    fetching : false,
    fetched  : true,
  }),
  "foo=baz": Immutable.Map({
    page  : 1,
    token : "foo=baz",
    ids   : Immutable.List([
      1,
      4,
      6,
    ]),
    fetching : false,
    fetched  : true,
    total    : 17,
    view     : 1,
  }),
});

const items = Immutable.Map({
  "1": Immutable.Map({
    data : "foo1",
    id   : 1,
  }),
  "2": Immutable.Map({
    data : "foo2",
    id   : 2,
  }),
  "3": Immutable.Map({
    data : "foo3",
    id   : 3,
  }),
  "4": Immutable.Map({
    data : "foo4",
    id   : 4,
  }),
  "5": Immutable.Map({
    data : "foo5",
    id   : 5,
  }),
  "6": Immutable.Map({
    data : "foo6",
    id   : 6,
  }),
  "7": Immutable.Map({
    data : "foo7",
    id   : 7,
  }),
  "8": Immutable.Map({
    data : "foo8",
    id   : 8,
  }),
  "9": Immutable.Map({
    data : "foo9",
    id   : 9,
  }),
});

describe("selectors", () => {

  it("getAllResults shoud select all the items ids for pages with same params than the current page", () => {
    expect(getAllResults(paginator, "foo=bar", items)).
      to.equal(Immutable.List([
        Immutable.Map({
          data : "foo1",
          id   : 1,
        }),
        Immutable.Map({
          data : "foo2",
          id   : 2,
        }),
        Immutable.Map({
          data : "foo3",
          id   : 3,
        }),
        Immutable.Map({
          data : "foo7",
          id   : 7,
        }),
        Immutable.Map({
          data : "foo8",
          id   : 8,
        }),
        Immutable.Map({
          data : "foo9",
          id   : 9,
        }),
      ]));
  });

  it("getResultsUpToPage shoud select all the items ids for pages with same params than the current page", () => {
    expect(getResultsUpToPage(paginator, "foo=bar", items, 2, 2)).
      to.equal(Immutable.List([
        Immutable.Map({
          data : "foo1",
          id   : 1,
        }),
        Immutable.Map({
          data : "foo2",
          id   : 2,
        }),
        Immutable.Map({
          data : "foo3",
          id   : 3,
        }),
        Immutable.Map({
          data : "foo7",
          id   : 7,
        }),
      ]));
  });

  it("getCurrentTotalResultsCount should return the total count for the current params of the provided name", () => {
    expect(getCurrentTotalResultsCount(paginator, "foo=bar")).
      to.equal(42);
  });

  it("getCurrentTotalResultsCount should return 0 if current page url is undefined for the provided name", () => {
    expect(getCurrentTotalResultsCount(paginator, "name3")).
      to.equal(0);
  });

  it("isPageFetching should return whether the current page is fetching or not for the provided name", () => {
    expect(isPageFetching(paginator, "foo=bar", 1)).
      to.equal(false);
  });

  it("isPageFetched should return whether the current page is fetched or not for the provided name", () => {
    expect(isPageFetched(paginator, "foo=bar", 1)).
      to.equal(true);
  });

  it("isPageFetched should return whether the current page is fetched or not for the provided name", () => {
    expect(isPageFetched(paginator, "foo=bar", 4)).
      to.equal(false);
  });

  it("getCurrentView should return 1 if there is no view point", () => {
    expect(getCurrentView(paginator, "foo=bat")).
      to.equal(1);
  });

  it("getCurrentView should return the value if it exists", () => {
    expect(getCurrentView(paginator, "foo=bar")).
      to.equal(2);
  });

});
