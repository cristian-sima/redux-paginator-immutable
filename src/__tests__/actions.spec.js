/* eslint-disable no-undefined, max-lines-per-function, no-magic-numbers */

import expect from "expect";
import { isFSA } from "flux-standard-action";

import actions from "../actions";

const {
  receivePage,
  requestPage,
  resetView,
  changeView,
} = actions;

import {
  RECEIVE_PAGE,
  REQUEST_PAGE,
  RESET_VIEW,
  CHANGE_VIEW,
} from "../actionTypes";

describe("actions", () => {

  it("should create receive page action", () => {
    const action = receivePage({
      endpoint    : "some/api/endpoint/",
      pageArgName : "p",
      idKey       : "id",
      page        : 2,
      token       : "foo=bar",
      items       : [
        "foo",
        "bar",
        "baz",
      ],
      total: 42,
    });

    expect(action).
      toEqual({
        type : RECEIVE_PAGE,
        meta : {
          endpoint    : "some/api/endpoint/",
          pageArgName : "p",
          idKey       : "id",
        },
        payload: {
          token : "foo=bar",
          page  : 2,
          items : [
            "foo",
            "bar",
            "baz",
          ],
          total: 42,
        },
      });

    expect(isFSA(action)).toEqual(true);
  });

  it("should create request page action", () => {
    const action = requestPage({
      endpoint    : "some/api/endpoint/",
      resultsKey  : "results",
      totalKey    : "total",
      pageArgName : "p",
      idKey       : "id",
      page        : 2,
      token       : "foo=bar",
    });

    expect(action).
      toEqual({
        type : REQUEST_PAGE,
        meta : {
          endpoint    : "some/api/endpoint/",
          resultsKey  : "results",
          totalKey    : "total",
          pageArgName : "p",
          idKey       : "id",
        },
        payload: {
          token : "foo=bar",
          page  : 2,
        },
      });

    expect(isFSA(action)).toEqual(true);
  });

  it("should create reset view action", () => {
    const action = resetView("some/api/endpoint/", "name");

    expect(action).
      toEqual({
        type : RESET_VIEW,
        meta : {
          endpoint: "some/api/endpoint/",
        },
        payload: {
          token: "name",
        },
      });

    expect(isFSA(action)).toEqual(true);
  });

  it("should create change view action", () => {
    const action = changeView("some/api/endpoint/", {
      token : "name",
      view  : 2,
    });

    expect(action).
      toEqual({
        type : CHANGE_VIEW,
        meta : {
          endpoint: "some/api/endpoint/",
        },
        payload: {
          view  : 2,
          token : "name",
        },
      });

    expect(isFSA(action)).toEqual(true);
  });

});
