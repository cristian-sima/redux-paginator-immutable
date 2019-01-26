// @flow

type InfoPropTypes = {
  shown: number;
  total: number;
  one: string;
  all: string;
};

import React from "react";
import { numberToLocaleForm } from "x25/utility";

const getNumberForm = (value : number, one : string, all : string) : string => {
  if (value === 1) {
    return `1 ${one}`;
  }

  return `${numberToLocaleForm(value)} ${all}`;
};

const Info = ({ shown, total, one, all } : InfoPropTypes) => (
  <div className="text-muted">
    {"Afișez "}
    {
      (shown === total) ? "tot - " : `${shown} din`
    }
    {` ${getNumberForm(total, one, all)}`}
  </div>
);

export default Info;
