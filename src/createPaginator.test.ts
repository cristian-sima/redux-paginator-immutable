import { describe, expect, it } from "vitest";
import { createPaginator } from "./createPaginator";

describe("createPaginator requestPage", () => {
  it("carries the paginator key and the cursor keys", () => {
    const
      paginator = createPaginator("socket://logs", {
        key          : "logs",
        manageEntity : (log : any) => log,
        resultsKey   : "Data",
        cursorKey    : "Cursor",
      }),
      action : any = paginator.requestPage(2, "level=1");

    expect(action.meta.key).toBe("logs");
    expect(action.meta.cursorKey).toBe("Cursor");
    expect(action.meta.cursorArgName).toBe("cursor");
  });

  it("leaves the cursor key empty when not configured", () => {
    const
      paginator = createPaginator("/api/things", {
        key          : "things",
        manageEntity : (thing : any) => thing,
        resultsKey   : "Data",
      }),
      action : any = paginator.requestPage(1, "");

    expect(action.meta.cursorKey).toBeUndefined();
  });
});
