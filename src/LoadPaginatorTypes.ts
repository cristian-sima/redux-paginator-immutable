type Settings = {
  key: string;
  rowsPerLoad: number;
  manipulateItems: (items: any) => any;
  resetView: (data: any) => any;
  changeView: (data: any) => any;
  requestPage: (page: number, token: string) => any;
};
export type LoadPaginatorPropTypes = {
  token: string;
  settings: Settings;
  children: JSX.Element;
};

export type ChangeView = (info: {
  token: string;
  view: number;
}) => any;

export type ResetView = (token: string) => any;

export type LoadData = (page: number) => any;

export type List = {
  token: string;
  settings: Settings;
  paginator: any;
  changeView: ChangeView;
  resetView: ResetView;
  loadData: LoadData;
}
