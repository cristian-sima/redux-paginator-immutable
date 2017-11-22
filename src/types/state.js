// @flow

export type ParamsState = any;
export type PagesState = any;
export type CurrentPagesState = any;
export type ItemsState = any;
export type CurrentViewState = any;

export type State = {
  +params: ParamsState;
  +pages: PagesState;
  +currentPages: CurrentPagesState;
  +itemsReducer: ItemsState;
  +currentView: CurrentViewState;
}
