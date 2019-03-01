The main component to use to show the paginator

```jsx
type Settings = {
  key: string;
  rowsPerLoad: number;
  manipulateItems: (items: any) => void;
  resetView: (data : any) => void;
  changeView: (data: any) => void;
  requestPage: (page: string, token : string) => any;
}

type OwnProps = {
  token: string;
  settings: Settings;
};

type LoadPaginatorPropTypes = {
  token: string;
  children: any;
  settings: Settings;
  paginator: any;
  // The paginator is: Immutable.Map{
  //   currentPage,
  //   isFetching,
  //   isFetched,
  //   shouldLoadNext,
  //   items,
  //   hasProblems,
  //   total,
  // }

  changeView: (info : { token: string, view: number }) => void;
  resetView: (token : string) => void;

  loadData: (page : number) => void;
  changeFilter: (filter : string) => (event : { target : { value : string } }) => void;
};

# Example:

```jsx
<LoadPaginator
  customProp="bla bla bla"
  settings={journalsPaginator}
  token={token}>
  <List />
</LoadPaginator>
```

where the render method of `List` is:

```jsx
<React.Fragment>
  <Info
    all="rows"
    one="row"
    shown={items.size}
    total={total}
  />
  <span>{this.props.customProp}</span>
  <div>
    <table>
      <thead>
        <tr>
          <th rowSpan="2">{"#"}</th>
          <th rowSpan="2">{"ID"}</th>
          <th rowSpan="2">{"Name"}</th>
        </tr>
      </thead>
      <tbody>
        {
          this.props.items.map((entitiy, index) => (
            <Row
              data={entitiy}
              index={index}
              key={entitiy.get("ID")}
            />
          ))
        }
      </tbody>
    </table>
  </div>
</React.Fragment>
```

and `Row` is:

```jsx
// @flow

type ServerJournalRowPropTypes = {
  index : number;
  data : any;
};

import React from "react";

class ServerJournalRow extends React.Component<RowPropTypes> {

  props: RowPropTypes;

  shouldComponentUpdate (nextProps : RowPropTypes) {
    return (
      this.props.data !== nextProps.data ||
      this.props.index !== nextProps.index
    );
  }

  render () {
    const { data, index } = this.props;

    return (
      <tr>
        <td className="no-wrap">
          {index + 1}
        </td>
        <td className="no-wrap">
          {data.get("Name")}
        </td>
      </tr>
    );
  }
}

export default Row;
```
