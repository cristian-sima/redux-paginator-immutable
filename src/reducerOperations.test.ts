import * as Immutable from "immutable";
import { describe, expect, it } from "vitest";
import reducerOperations from "./reducerOperations";

type ReceiveOptions = {
  readonly state : any;
  readonly page : number;
  readonly logs : any[];
  readonly cursor? : string;
  readonly error? : boolean;
};

const
  token = "level=1",
  buildRequest = (page : number) : any => ({
    type    : "@@redux-paginator-immutable/REQUEST_PAGE",
    meta    : { endpoint: "socket://logs" },
    payload : { page, token },
  }),
  buildReceive = (options : ReceiveOptions) : any => ({
    type    : "@@redux-paginator-immutable/RECEIVE_PAGE",
    meta    : { endpoint: "socket://logs", idKey: "id" },
    payload : {
      page   : options.page,
      token,
      items  : options.logs,
      total  : 10,
      error  : options.error === true,
      cursor : options.cursor,
    },
  }),
  receive = (options : ReceiveOptions) => (
    reducerOperations.receivePage(
      reducerOperations.requestPage(options.state, buildRequest(options.page)),
      buildReceive(options),
    )
  );

describe("receivePage", () => {
  it("keeps every id once when a later page repeats rows", () => {
    const
      afterFirst = receive({ state: Immutable.Map(), page: 1, logs: [{ id: "a" }, { id: "b" }, { id: "c" }] }),
      afterSecond = receive({ state: afterFirst, page: 2, logs: [{ id: "b" }, { id: "c" }, { id: "d" }] });

    expect(afterSecond.getIn([token, "ids"]).toArray()).toEqual(["a", "b", "c", "d"]);
  });

  it("stores the cursor sent with the page", () => {
    const state = receive({ state: Immutable.Map(), page: 1, logs: [{ id: "a" }], cursor: "2026-10-09T10:07:00Z|a" });

    expect(state.getIn([token, "cursor"])).toBe("2026-10-09T10:07:00Z|a");
  });

  it("keeps the previous cursor when the page fails", () => {
    const
      afterFirst = receive({ state: Immutable.Map(), page: 1, logs: [{ id: "a" }], cursor: "c1" }),
      afterFailure = receive({ state: afterFirst, page: 2, logs: [], error: true });

    expect(afterFailure.getIn([token, "cursor"])).toBe("c1");
  });
});
