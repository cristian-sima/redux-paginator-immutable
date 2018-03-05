/* eslint-disable max-len, no-undefined, no-magic-numbers */

import expect from "expect";

import {
  requestPage,
} from "../actions";
import {
  // onlyForEndpoint,
  createPaginator,
} from "../createPaginator";

describe("createPaginator", () => {

  it("should create correct request action creator", () => {
    const paginator = createPaginator("some/api/endpoint", {
      pageArgName : "p",
      idKey       : "id_field",
      resultsKey  : "results",
      totalKey    : "count",
    });
    const action = paginator.requestPage(42, "foo=bar");

    expect(action).
      toEqual(requestPage({
        endpoint    : "some/api/endpoint",
        endpointCb  : null,
        resultsKey  : "results",
        totalKey    : "count",
        pageArgName : "p",
        idKey       : "id_field",
        page        : 42,
        token       : "foo=bar",
      }));
  });

});
