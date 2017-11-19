/* eslint-disable no-undefined, no-magic-numbers */

import expect from "expect";
import { isFSA } from "flux-standard-action";

import {
  receivePage,
  requestPage,
} from "../actions";
import {
  RECEIVE_PAGE,
  REQUEST_PAGE,
} from "../actionTypes";

describe("actions", () => {

  it("should create receive page action", () => {
    const action = receivePage("some/api/endpoint/", "name", { id       : undefined,
      fooField : undefined }, "p", "id", 2, "foo=bar", [
      "foo",
      "bar",
      "baz",
    ], 42);

    expect(action).
      toEqual({
        type : RECEIVE_PAGE,
        meta : {
          endpoint    : "some/api/endpoint/",
          name        : "name",
          initialItem : {
            id       : undefined,
            fooField : undefined,
          },
          pageArgName : "p",
          idKey       : "id",
          fromCache   : false,
        },
        payload: {
          params : "foo=bar",
          page   : 2,
          items  : [
            "foo",
            "bar",
            "baz",
          ],
          count : 42,
          raw   : undefined,
        },
      });

    expect(isFSA(action)).toEqual(true);
  });

  it("should create request page action", () => {
    const action = requestPage("some/api/endpoint/", "name", { id       : undefined,
      fooField : undefined }, "results", "count", "p", "id", 2, "foo=bar");
    expect(action).
      toEqual({
        type : REQUEST_PAGE,
        meta : {
          endpoint    : "some/api/endpoint/",
          name        : "name",
          initialItem : {
            id       : undefined,
            fooField : undefined,
          },
          resultsKey  : "results",
          countKey    : "count",
          pageArgName : "p",
          idKey       : "id",
        },
        payload: {
          params : "foo=bar",
          page   : 2,
        },
      });

    expect(isFSA(action)).toEqual(true);
  });

});
