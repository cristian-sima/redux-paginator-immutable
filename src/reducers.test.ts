/* eslint-disable max-len, no-undefined, max-lines-per-function */

import * as Immutable from "immutable";
import { describe, expect, test } from "vitest";
import actions from "./actions";
import { items, pages } from "./reducers";

const
  { requestPage, receivePage } = actions,
  requestPageAction = requestPage({
    endpoint    : "some/api/endpoint",
    resultsKey  : "results",
    totalKey    : "total",
    pageArgName : "p",
    idKey       : "id",
    page        : 2,
    token       : "foo=bar",
  } as any),

  receivePageAction = receivePage({
    endpoint    : "some/api/endpoint/",
    pageArgName : "p",
    idKey       : "id",
    page        : 2,
    token       : "foo=bar",
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
    total: 2,
  } as any);

describe("pages reducer", () => {

  test("should return the state by default", () => {
    const
      theState = Immutable.Map({
        some: "state",
      }),
      theAction = { type: "some action" } as any,
      result = pages(theState, theAction),
      expectedState = Immutable.Map({
        some: "state",
      });

    expect(result).toEqual(expectedState);
  });

  test("should initialize the pages map with a new page entry when requesting new page", () => {
    const state = pages(undefined, requestPageAction);

    expect(state).toEqual(
      Immutable.Map({
        "foo=bar": Immutable.Map({
          page     : 2,
          error    : false,
          fetching : true,
          fetched  : false,
          view     : 1,
          token    : "foo=bar",
          ids      : Immutable.List(),
        }),
      }),
    );
  });

  test("should populate the pages map at the page url key with the item ids", () => {
    const state = pages(Immutable.Map({
      "foo=bar": Immutable.Map({
        page     : 2,
        token    : "foo=bar",
        ids      : Immutable.List(),
        fetching : true,
        fetched  : false,
      }),
    }), receivePageAction);

    expect(state).toEqual(Immutable.Map({
      "foo=bar": Immutable.Map({
        page  : 2,
        token : "foo=bar",
        ids   : Immutable.List([
          "baz",
          "bar",
        ]),
        fetching : false,
        fetched  : true,
        error    : false,
        total    : 2,
      }),
    }));
  });

});

describe("items reducer", () => {

  test("should populate the items map with item received", () => {
    const state = items(undefined, receivePageAction);

    expect(state).toEqual(Immutable.Map({
      "baz": Immutable.Map({
        id       : "baz",
        fooField : "bazValue",
      }),
      "bar": Immutable.Map({
        id       : "bar",
        fooField : "barValue",
      }),
    }));
  });

});
