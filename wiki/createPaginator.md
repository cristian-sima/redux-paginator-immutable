It creates a new paginator.

```jsx
type PaginatorSettings = {
  key: string;
  manageEntity: any;
  resultsKey: string;

  // by default "{rowsPerLoad} from x25/utility/others"
  rowsPerLoad?: number;

  // by default "(items) => items"
  manipulateItems?: (items: any) => any;

  // by default "Total"
  totalKey?: string;

   // by default "page"
  pageArgName?: string;

  // default "ID"
  idKey?: string;
}


type EndpointData = {
  path : string;
  cb : () => string;
};


/*
if (typeof Endpoint === "object") {
  return {
    path : Endpoint.path,
    cb   : Endpoint.cb,
  };
}

return {
  path : Endpoint,
};
*/
type Endpoint = EndpointData | string;

type PaginatorReturns = {
  key: string;
  rowsPerLoad: number;
  
  manipulateItems: (items : any) => any;
  pagesReducer: PagesReducer;
  itemsReducer: ItemsReducer;

  requestPage: (page : number, token : string) => Action;
  resetView: (token : string) => Action;
  changeView: ({ view : number; token : string; })  => Action;
  clearData: () => Action;
}

type CreatePaginator = (endpoint: Endpoint, info: PaginatorSettings) => PaginatorReturns;

type OnlyForEndpoint = (endpoint : string, reducer : any) =>
(state? : any, action : { meta: { endpoint : string }}) => any;
```

## Structure 

```jsx
const createPaginator : CreatePaginator = (endpointData : Endpoint, settings : PaginatorSettings) 
```

The function returns an object with this form: 

```jsx
type PaginatorReturns = {
  key: string;
  rowsPerLoad: number;
  
  // utils
  manipulateItems: (items : any) => any;

  // reducers
  pagesReducer: PagesReducer;
  itemsReducer: ItemsReducer;

  // actions
  requestPage: (page : number, token : string) => Action;
  resetView: (token : string) => Action;
  changeView: ({ view : number; token : string; })  => Action;
  clearData: () => Action;
}

```

## Example for static API and items without data

We start with the file for paginator:
```jsx
// @flow

import { createPaginator, manageEntity, manipulateItems } from "redux-paginator-immutable";

import { normalizrAccount } from "./request";

export const accountsPaginator = createPaginator("/api/settings/accounts", {
  key             : "accounts",
  resultsKey      : "Accounts",
  manageEntity    : manageEntity(normalizrAccount),
  manipulateItems : manipulateItems(),
});
```

the `entities.js` file where we have the itemsReducer
```jsx

// @flow

import type { Action } from "Settings/types";

import * as Immutable from "immutable";

const
  setAccount = (state : any, { payload : { Account } }) => (
    state.setIn([String(Account.get("ID"))], Account)
  ),
  toggleAccountState = (state : any, { payload: { id } }) => (
    state.updateIn([id],
      (account) => account.set("IsActive", !account.get("IsActive")))
  );

const reducer = (state : any = Immutable.Map(), action : Action) => {
  switch (action.type) {
    case "MODIFY_ACCOUNT":
    case "REVOKE_DELETE_ACCOUNT":
    case "DELETE_ACCOUNT":
      return setAccount(state, action);

    case "TOGGLE_ACCOUNT_STATE":
      return toggleAccountState(state, action);

    default:
      return accountsPaginator.itemsReducer(state, action);
  }
};

export default reducer;

```

the `pagination.js` file with the page reducer

```jsx 
// @flow

import type { Action } from "Settings/types";

import * as Immutable from "immutable";

const customPages = (state : any = Immutable.Map(), action : Action) => {
  switch (action.type) {
    case "MODIFY_ACCOUNT":
      return state.clear();

    default:
      return accountsPaginator.pagesReducer(state, action);
  }
};


export default customPages;
```

then we combine them:

```jsx
// @flow

import entities from "./entities";
import pagination from "./pagination";

import { createItemReducer } from "redux-paginator-immutable";

const selectors = createItemReducer(accountsPaginator);

const paginators = {
  key          : accountsPaginator.key,
  itemsReducer : entities,
  pagesReducer : pagination,
};

export {
  selectors,
  paginators,
};


```

In case you need to manipulate or load more data, use the `Data` functions