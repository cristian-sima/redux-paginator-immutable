type InfoPropTypes = {
  readonly shown: number;
  readonly total: number;
  readonly one: string;
  readonly all: string;
};

import React from "react";
import { words } from "x25/utility";

const
  getNumberForm = (value: number, one: string, all: string): string => {
    if (value === 1) {
      return `1 ${one}`;
    }

    return `${words.getNumberTense(value)} ${all}`;
  },

  Info = ({ shown, total, one, all }: InfoPropTypes) => (
    <div className="text-muted">
      {`${words.Showing} `}
      {shown === total ? `${words.All} - ` : `${shown} ${words.Of}`}
      {` ${getNumberForm(total, one, all)}`}
    </div>
  );

export default Info;
