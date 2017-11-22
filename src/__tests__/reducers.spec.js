/* eslint-disable max-len, no-undefined, no-magic-numbers */

import * as Immutable from "immutable";

import chai, { expect } from "chai";
import chaiImmutable from "chai-immutable";

chai.use(chaiImmutable);

import {
  requestPage,
  receivePage,
  resetView,
  changeView,
} from "../actions";
import {
  params,
  pages,
  currentPages,
  items,
  currentView,
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
    const state = params(Immutable.Map({ some: "state" }), { type: "some action" });

    expect(state).
      to.equal(
        Immutable.Map({ some: "state" })
      );
  });

  // it("should initialize new params key with undefined count when requesting page", () => {
  //   const state = params(undefined, requestPageAction);
  //
  //   expect(state).
  //     to.equal({
  //       "foo=bar": unde,
  //     });
  // });

  it("should update results count corresponding to the params when receiving page", () => {
    const state = params(Immutable.Map({ "foo=bar": undefined }), receivePageAction);

    expect(state).
      to.equal(Immutable.Map({
        "foo=bar": 42,
      }));
  });

  it("should not update results count corresponding to the params when receiving page with errrors", () => {
    const state = params(Immutable.Map({
      "foo=bar": undefined,
    }), {
      ...receivePageAction,
      payload: {
        ...receivePageAction.payload,
        error: true,
      },
    });

    expect(state).
      to.equal(Immutable.Map({
        "foo=bar": undefined,
      }));
  });

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
          "?foo=bar&p=2": Immutable.Map({
            number   : 2,
            params   : "foo=bar",
            ids      : Immutable.List(),
            fetching : true,
            error    : false,
            fetched  : false,
          }),
        })
      );
  });

  it("should populate the pages map at the page url key with the item ids", () => {
    const state = pages(Immutable.Map({
      "?foo=bar&p=2": Immutable.Map({
        number   : 2,
        params   : "foo=bar",
        ids      : Immutable.List(),
        fetching : true,
      }),
    }), receivePageAction);

    expect(state).
      to.equal(Immutable.Map({
        "?foo=bar&p=2": Immutable.Map({
          number : 2,
          params : "foo=bar",
          ids    : Immutable.List([
            "baz",
            "bar",
          ]),
          fetching : false,
          fetched  : false,
          error    : false,
        }),
      }));
  });

});

describe("currentPages reducer", () => {

  it("should return the state by default", () => {
    const state = currentPages(Immutable.Map({ some: "state" }), { type: "some action" });

    expect(state).
      to.equal(Immutable.Map({ some: "state" }));
  });

  it("should update the current pages map with an entry with the paginator slice name as key and the current page url as value when requesting a page", () => {
    const state = currentPages(undefined, requestPageAction);

    expect(state).
      to.equal(Immutable.Map({
        name: "?foo=bar&p=2",
      }));
  });

});

describe("currentView reducer", () => {

  it("should return the state by default", () => {
    const state = currentView(undefined, { type: "some action" });

    expect(state).
      to.equal(Immutable.Map());
  });

  it("should reset the current view", () => {
    const
      initial = Immutable.Map({
        name1: 2,
      }),
      state = currentView(initial, resetView("name1"));

    expect(state).
      to.equal(Immutable.Map({
        name1: 1,
      }));
  });

  it("should change the current view", () => {
    const
      initial = Immutable.Map({
        name1: 2,
      }),
      state = currentView(initial, changeView("name1", 3));

    expect(state).
      to.equal(Immutable.Map({
        name1: 3,
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
