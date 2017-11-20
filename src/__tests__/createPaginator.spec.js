/* eslint-disable max-len, no-undefined, no-magic-numbers */

import expect from "expect";

import {
  requestPage,
} from "../actions";
import {
  onlyForEndpoint,
  requestPageActionCreatorForEndpoint,
  getRequestPageActionCreatorsFor,
  createPaginator,
} from "../createPaginator";


describe("onlyForEndpoint", () => {

  it("should apply the provided reducer if actions meta endpoint is the same than the provided endpoint", () => {
    const fooReducer = () => ({
      foo: "bar",
    });

    const
      endpoint = "some/endpoint/",
      fooAction = {
        type : "FOO",
        meta : {
          endpoint,
        },
      },
      state = onlyForEndpoint(endpoint, fooReducer)(undefined, fooAction);

    expect(state).
      toEqual({
        foo: "bar",
      });
  });

  it("should NOT apply the provided reducer if actions meta endpoint differs from the provided one", () => {
    const fooReducer = () => ({
      foo: "bar",
    });
    const endpoint = "some/endpoint/";
    const fooAction = {
      type : "FOO",
      meta : {
        endpoint: "some/other/endpoint/",
      },
    };
    const state = onlyForEndpoint(endpoint, fooReducer)(undefined, fooAction);
    expect(state).
      toEqual({});
  });

});

describe("requestPageActionCreatorForEndpoint", () => {

  it("should create an action creator for provided options", () => {
    const actionCreator = requestPageActionCreatorForEndpoint({
      endpoint    : "some/endpoint/",
      name        : "some name",
      pageArgName : "p",
      idKey       : "id",
      initialItem : {
        id       : undefined,
        fooField : undefined,
      },
      resultsKey : "results",
      countKey   : "count",
    });
    const action = actionCreator(2, "foo=bar");
    expect(action).
      toEqual(requestPage({
        endpoint    : "some/endpoint/",
        name        : "some name",
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
      }));
  });

});

describe("getRequestPageActionCreatorsFor", () => {

  it("should create action creators for the given endpoint, pageNameArg and names", () => {
    const actionCreators = getRequestPageActionCreatorsFor({
      endpoint : "some/api/endpoint/",
      names    : [
        "foo",
        "bar",
      ],
      pageArgName : "p",
      idKey       : "id",
      initialItem : {
        id       : undefined,
        fooField : undefined,
      },
      resultsKey : "results",
      countKey   : "count",
    });

    const actionForFoo = actionCreators.foo.requestPage(42, "foo=bar");
    const actionForBar = actionCreators.bar.requestPage(17, "bar=foo");

    expect(actionForFoo).
      toEqual(requestPage({
        endpoint    : "some/api/endpoint/",
        name        : "foo",
        initialItem : {
          id       : undefined,
          fooField : undefined,
        },
        resultsKey  : "results",
        countKey    : "count",
        pageArgName : "p",
        idKey       : "id",
        page        : 42,
        params      : "foo=bar",
      }));
    expect(actionForBar).
      toEqual(requestPage({
        endpoint    : "some/api/endpoint/",
        name        : "bar",
        initialItem : {
          id       : undefined,
          fooField : undefined,
        },
        resultsKey  : "results",
        countKey    : "count",
        pageArgName : "p",
        idKey       : "id",
        page        : 17,
        params      : "bar=foo",
      }));
  });

});

describe("createPaginator", () => {

  it("should create correct request action creator", () => {
    const paginator = createPaginator("some/api/endpoint", ["foo"], {
      initialItem: {
        id       : undefined,
        fooField : undefined,
      },
      pageArgName : "p",
      idKey       : "id_field",
      resultsKey  : "results",
      countKey    : "count",
    });
    const action = paginator.foo.requestPage(42, "foo=bar");
    expect(action).
      toEqual(requestPage({
        endpoint    : "some/api/endpoint",
        name        : "foo",
        initialItem : {
          id       : undefined,
          fooField : undefined,
        },
        resultsKey  : "results",
        countKey    : "count",
        pageArgName : "p",
        idKey       : "id_field",
        page        : 42,
        params      : "foo=bar",
      }));
  });

});
