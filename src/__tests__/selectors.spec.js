/* eslint-disable max-len, no-undefined, no-magic-numbers */

import chai, { expect } from "chai";
import chaiImmutable from "chai-immutable";

chai.use(chaiImmutable);

import {
  getCurrentPageNumber,
  getCurrentPageResults,
  getCurrentTotalResultsCount,
  getAllResults,
  isCurrentPageFetching,
  isCurrentPageFetched,
  getResultsUpToPage,
  isPageFetched,
  isPageFetching,
  getCurrentView,
  getPage,
} from "../selectors";

import * as Immutable from "immutable";

const paginator = {
  params: Immutable.Map({
    "foo=bar" : 42,
    "foo=baz" : 17,
  }),
  pages: Immutable.Map({
    "foo=bar?page=1": Immutable.Map({
      number : 1,
      params : "foo=bar",
      ids    : Immutable.List([
        1,
        2,
        3,
      ]),
      fetching : false,
      fetched  : true,
    }),
    "foo=bar?page=2": Immutable.Map({
      number   : 2,
      params   : "foo=bar",
      ids      : Immutable.List(),
      fetching : true,
      fetched  : false,
    }),
    "foo=bar?page=3": Immutable.Map({
      number : 3,
      params : "foo=bar",
      ids    : Immutable.List([
        7,
        8,
        9,
      ]),
    }),
    "foo=baz?page=1": Immutable.Map({
      number : 1,
      params : "foo=baz",
      ids    : Immutable.List([
        1,
        4,
        6,
      ]),
      fetching : false,
      fetched  : true,
    }),
  }),
  currentPages: Immutable.Map({
    name1 : "foo=bar?page=2",
    name2 : "foo=baz?page=1",
  }),
  currentView: Immutable.Map({
    name2: 2,
  }),
};

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

  it("getCurrentPageNumber should select the current page number from pagination slice of state", () => {
    expect(getCurrentPageNumber(paginator, "name1")).
      to.equal(2);
  });

  it("getCurrentPageNumber should return 1 if the current page is not defined", () => {
    expect(getCurrentPageNumber(paginator, "name3")).
      to.equal(1);
  });

  it("getCurrentPageResults should select the items from the given items param corresponding to the current page for the provided name", () => {
    expect(getCurrentPageResults(items, paginator, "name2")).
      to.equal(Immutable.List([
        Immutable.Map({
          data : "foo1",
          id   : 1,
        }),
        Immutable.Map({
          data : "foo4",
          id   : 4,
        }),
        Immutable.Map({
          data : "foo6",
          id   : 6,
        }),
      ]));
  });

  it("getCurrentPageResults should return an empty array if current page for the provided name is undefined", () => {
    expect(getCurrentPageResults(items, paginator, "name3")).
      to.equal(Immutable.List([]));
  });

  it("getAllResults shoud select all the items ids for pages with same params than the current page", () => {
    expect(getAllResults(items, paginator, "name1")).
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
    expect(getResultsUpToPage(items, paginator, "name1", 2)).
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
      ]));
  });

  it("getCurrentTotalResultsCount should return the total count for the current params of the provided name", () => {
    expect(getCurrentTotalResultsCount(paginator, "name2")).
      to.equal(17);
  });

  it("getCurrentTotalResultsCount should return 0 if current page url is undefined for the provided name", () => {
    expect(getCurrentTotalResultsCount(paginator, "name3")).
      to.equal(0);
  });

  it("isCurrentPageFetching should return whether the current page is fetching or not for the provided name", () => {
    expect(isCurrentPageFetching(paginator, "name1")).
      to.equal(true);
  });

  it("isCurrentPageFetched should return whether the current page is fetched or not for the provided name", () => {
    expect(isCurrentPageFetched(paginator, "name1")).
      to.equal(false);
  });

  it("isPageFetching should return whether the current page is fetching or not for the provided name", () => {
    expect(isPageFetching(paginator, "name1", 1)).
      to.equal(false);
  });

  it("isPageFetched should return whether the current page is fetched or not for the provided name", () => {
    expect(isPageFetched(paginator, "name1", 1)).
      to.equal(true);
  });

  it("getCurrentView should return 1 if there is no view point", () => {
    expect(getCurrentView(paginator, "name1")).
      to.equal(1);
  });

  it("getCurrentView should return the value if it exists", () => {
    expect(getCurrentView(paginator, "name2")).
      to.equal(2);
  });

  it("getPage gets the page if it has", () => {
    expect(getPage(paginator, "name1", 1)).
      to.equal(Immutable.Map({
        number : 1,
        params : "foo=bar",
        ids    : Immutable.List([
          1,
          2,
          3,
        ]),
        fetching : false,
        fetched  : true,
      }));
  });

  it("getPage returns undefined if it does not have the name", () => {
    expect(getPage(paginator, "name3", 1)).
      to.equal(undefined);
  });

  it("getPage returns undefined if it does not have a current page", () => {
    expect(getPage(paginator, "name2", 2)).
      to.equal(undefined);
  });
});
