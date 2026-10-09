import * as Immutable from "immutable";
import { describe, expect, it, vi } from "vitest";

const { superagentGet } = vi.hoisted(() => ({ superagentGet: vi.fn() }));

vi.mock("superagent", () => ({
  default: { get: superagentGet },
}));

import { createPaginator } from "./createPaginator";
import paginatorMiddleware from "./paginatorMiddleware";

type RunOptions = {
  readonly action : any;
  readonly storeState : Immutable.Map<string, any>;
};

const
  token = "level=1",
  buildStoreState = (key : string) => Immutable.fromJS({
    paginations: {
      [key]: {
        [token]: { cursor: "c1", page: 1, view: 1 },
      },
    },
  }) as Immutable.Map<string, any>,
  runMiddleware = (options : RunOptions) : Promise<any> => new Promise((resolve) => {
    const
      dispatch = (next : any) : any => {
        if (typeof next === "function") {
          return next(dispatch);
        }

        if (next.type === "@@redux-paginator-immutable/RECEIVE_PAGE") {
          resolve(next);
        }

        return next;
      },
      getState = () => options.storeState;

    paginatorMiddleware({ dispatch, getState })(() => null)(options.action);
  });

describe("paginatorMiddleware with a custom fetcher", () => {
  it("hands the stored cursor to the fetcher and forwards the next cursor", async () => {
    const
      fetcher = vi.fn(() => Promise.resolve({ Data: [{ id: "d" }], Total: 10, Cursor: "c2" })),
      paginator = createPaginator("socket://logs-fetcher", {
        key          : "logs",
        manageEntity : (log : any) => log,
        resultsKey   : "Data",
        cursorKey    : "Cursor",
        fetcher,
      }),
      received = await runMiddleware({
        action     : paginator.requestPage(2, token),
        storeState : buildStoreState("logs"),
      });

    expect(fetcher).toHaveBeenCalledWith(token, 2, "c1");
    expect(received.payload.cursor).toBe("c2");
  });

  it("reads the cursor when the store root is a plain object", async () => {
    const
      fetcher = vi.fn(() => Promise.resolve({ Data: [], Total: 0, Cursor: "c2" })),
      paginator = createPaginator("socket://logs-plain-root", {
        key          : "logs",
        manageEntity : (log : any) => log,
        resultsKey   : "Data",
        cursorKey    : "Cursor",
        fetcher,
      }),
      plainRoot : any = {
        paginations: {
          logs: Immutable.fromJS({ [token]: { cursor: "c1" } }),
        },
      };

    await runMiddleware({
      action     : paginator.requestPage(2, token),
      storeState : plainRoot,
    });

    expect(fetcher).toHaveBeenCalledWith(token, 2, "c1");
  });

  it("sends no cursor for the first page", async () => {
    const
      fetcher : any = vi.fn(() => Promise.resolve({ Data: [], Total: 0, Cursor: "c2" })),
      paginator = createPaginator("socket://logs-first", {
        key          : "logs",
        manageEntity : (log : any) => log,
        resultsKey   : "Data",
        cursorKey    : "Cursor",
        fetcher,
      });

    await runMiddleware({
      action     : paginator.requestPage(1, token),
      storeState : buildStoreState("logs"),
    });

    expect(fetcher.mock.calls[0][1]).toBe(1);
    expect(fetcher.mock.calls[0][2]).toBeUndefined();
  });
});

describe("paginatorMiddleware over HTTP", () => {
  it("appends the cursor to the query and forwards the next cursor", async () => {
    superagentGet.mockImplementation(() => ({
      end: (callback : any) => callback(null, { body: { Data: [], Total: 0, Cursor: "c2" } }),
    }));

    const
      paginator = createPaginator("/api/logs", {
        key          : "http-logs",
        manageEntity : (log : any) => log,
        resultsKey   : "Data",
        cursorKey    : "Cursor",
      }),
      received = await runMiddleware({
        action     : paginator.requestPage(2, token),
        storeState : buildStoreState("http-logs"),
      }),
      requestedURL = superagentGet.mock.calls[0][0] as string;

    expect(requestedURL).toContain("cursor=c1");
    expect(requestedURL).toContain("page=2");
    expect(received.payload.cursor).toBe("c2");
  });
});
