/* eslint-disable max-len, no-undefined, max-lines-per-function */

import * as Immutable from "immutable";

import chai, { expect } from "chai";
import chaiImmutable from "chai-immutable";

chai.use(chaiImmutable);

import actions from "../actions";

const {
  requestPage,
  receivePage,
} = actions;

import {
  pages,
  items,
} from "../reducers";

const requestPageAction = requestPage({
  endpoint    : "some/api/endpoint",
  resultsKey  : "results",
  totalKey    : "total",
  pageArgName : "p",
  idKey       : "id",
  page        : 2,
  token       : "foo=bar",
});

const receivePageAction = receivePage({
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
});

describe("pages reducer", () => {

  it("should return the state by default", () => {
    const state = pages(Immutable.Map({
      some: "state",
    }), { type: "some action" });

    expect(state).
      to.equal(Immutable.Map({
        some: "state",
      }));
  });

  it("should initialize the pages map with a new page entry when requesting new page", () => {
    const state = pages(undefined, requestPageAction);

    expect(state).
      to.equal(
        Immutable.Map({
          "foo=bar": Immutable.Map({
            page     : 2,
            token    : "foo=bar",
            ids      : Immutable.List(),
            fetching : true,
            error    : false,
            view     : 1,
            fetched  : false,
          }),
        })
      );
  });

  it("should populate the pages map at the page url key with the item ids", () => {
    const state = pages(Immutable.Map({
      "foo=bar": Immutable.Map({
        page     : 2,
        token    : "foo=bar",
        ids      : Immutable.List(),
        fetching : true,
        fetched  : false,
      }),
    }), receivePageAction);

    expect(state).
      to.equal(Immutable.Map({
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

  it("should populate the items map with item received", () => {
    const state = items(undefined, receivePageAction);

    expect(state).
      to.equal(Immutable.Map({
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
