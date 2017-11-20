/* eslint-disable no-use-before-define */
// @flow

export * from "./actions";
export * from "./state";

import type { State } from "./state";
import type { Action } from "./actions";

export type GetState = () => State;
export type PromiseAction = Promise<Action>;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
