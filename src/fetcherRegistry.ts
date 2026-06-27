import { Fetcher } from "./types";

// Endpoint → custom fetcher. A paginator created with a `fetcher` setting
// registers it here; paginatorMiddleware uses it instead of the built-in
// superagent HTTP call. Lets non-HTTP transports (e.g. Wails IPC) plug in
// without replacing the middleware. Endpoints without a registered fetcher
// keep the original superagent behaviour unchanged.

const registry = new Map<string, Fetcher>();

export const
  registerFetcher = (endpoint: string, fetcher: Fetcher): void => {
    registry.set(endpoint, fetcher);
  },
  getFetcher = (endpoint: string): Fetcher | undefined => registry.get(endpoint);
