// @flow

export type PagesState = any;
export type ItemsState = any;

export type State = {
  +pages: PagesState;
  +itemsReducer: ItemsState;
}
