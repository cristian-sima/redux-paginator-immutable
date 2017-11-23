/* eslint-disable no-undefined, no-magic-numbers */
/* global describe */

import expect from "expect";
import { isFSA } from "flux-standard-action";

import {
  receivePage,
  requestPage,
  resetView,
  changeView,
} from "../actions";
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
        "foo",
        "bar",
        "baz",
      ],
      count: 42,
    });

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
    const action = requestPage({
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
      page        : 2,
      params      : "foo=bar",
    });

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

  it("should create reset view action", () => {
    const action = resetView({
      name     : "name",
      endpoint : "some/api/endpoint/",
    });

    expect(action).
      toEqual({
        type : RESET_VIEW,
        meta : {
          endpoint : "some/api/endpoint/",
          name     : "name",
        },
        payload: {
        },
      });

    expect(isFSA(action)).toEqual(true);
  });

  it("should create change view action", () => {
    const action = changeView({
      name     : "name",
      view     : 2,
      endpoint : "some/api/endpoint/",
    });

    expect(action).
      toEqual({
        type : CHANGE_VIEW,
        meta : {
          endpoint : "some/api/endpoint/",
          name     : "name",
        },
        payload: {
          view: 2,
        },
      });

    expect(isFSA(action)).toEqual(true);
  });

});
