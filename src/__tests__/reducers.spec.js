/* eslint-disable max-len, no-undefined, no-magic-numbers */

import expect from "expect";

import {
  requestPage,
  receivePage,
} from "../actions";
import {
  params,
  pages,
  currentPages,
  items,
} from "../reducers";

const requestPageAction = requestPage({
  endpoint    : "some/api/endpoint",
  name        : "name",
  initialItem : {
    id       : undefined,
    fooField : undefined,
  },
  resultsKey  : "results",
  countKey    : "count",
  pageArgName : "p",
  idKey       : "id",
  page        : 2,
  params      : "foo=bar",
});

const receivePageAction = receivePage({
  endpoint    : "some/api/endpoint/",
  name        : "name",
  initialItem : {
    id       : undefined,
    fooField : undefined,
  },
  pageArgName : "p",
  idKey       : "id",
  page        : 2,
  params      : "foo=bar",
  items       : [
    {
      id       : "baz",
      fooField : "bazValue",
    },
    {
      id       : "bar",
      fooField : "barValue",
    },
  ],
  count: 42,
});

describe("params reducer", () => {

  it("should return the state by default", () => {
    const state = params({ some: "state" }, { type: "some action" });
    expect(state).
      toEqual({ some: "state" });
  });

  it("should initialize new params key with undefined count when requesting page", () => {
    const state = params(undefined, requestPageAction);
    expect(state).
      toEqual({
        "foo=bar": null,
      });
  });

  it("should update results count corresponding to the params when receiving page", () => {
    const state = params({ "foo=bar": undefined }, receivePageAction);
    expect(state).
      toEqual({
        "foo=bar": 42,
      });
  });

});

describe("pages reducer", () => {

  it("should return the state by default", () => {
    const state = pages({ some: "state" }, { type: "some action" });
    expect(state).
      toEqual({ some: "state" });
  });

  it("should initialize the pages map with a new page entry when requesting new page", () => {
    const state = pages(undefined, requestPageAction);
    expect(state).
      toEqual({
        "?foo=bar&p=2": {
          number   : 2,
          params   : "foo=bar",
          ids      : [],
          fetching : true,
        },
      });
  });

  it("should populate the pages map at the page url key with the item ids", () => {
    const state = pages({
      "?foo=bar&p=2": {
        number   : 2,
        params   : "foo=bar",
        ids      : [],
        fetching : true,
      },
    }, receivePageAction);
    expect(state).
      toEqual({
        "?foo=bar&p=2": {
          number : 2,
          params : "foo=bar",
          ids    : [
            "baz",
            "bar",
          ],
          fetching: false,
        },
      });
  });

});

describe("currentPages reducer", () => {

  it("should return the state by default", () => {
    const state = currentPages({ some: "state" }, { type: "some action" });
    expect(state).
      toEqual({ some: "state" });
  });

  it("should update the current pages map with an entry with the paginator slice name as key and the current page url as value when requesting a page", () => {
    const state = currentPages(undefined, requestPageAction);
    expect(state).
      toEqual({
        name: "?foo=bar&p=2",
      });
  });

});

describe("items reducer", () => {

  it("should populate the items map with item received", () => {
    const state = items(undefined, receivePageAction);
    expect(state).
      toEqual({
        "baz": {
          id       : "baz",
          fooField : "bazValue",
        },
        "bar": {
          id       : "bar",
          fooField : "barValue",
        },
      });
  });

  it("should NOT populate the items map with item received if the item is received from cache data", () => {
    const state = items(undefined, receivePage({
      endpoint    : "some/api/endpoint/",
      name        : "name",
      initialItem : {
        id       : undefined,
        fooField : undefined,
      },
      pageArgName : "p",
      idKey       : "id",
      page        : 2,
      params      : "foo=bar",
      items       : [
        {
          id       : "baz",
          fooField : "bazValue",
        },
        {
          id       : "bar",
          fooField : "barValue",
        },
      ],
      count     : 42,
      raw       : {},
      fromCache : true,
    }));
    expect(state).
      toEqual({});
  });

});
