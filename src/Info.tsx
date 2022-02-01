type InfoPropTypes = {
  shown: number;
  total: number;
  one: string;
  all: string;
};

import React from "react";
import { words as x25Words } from "x25/utility";
import words from "./words";

const
  getNumberForm = (value: number, one: string, all: string): string => {
    if (value === 1) {
      return `1 ${one}`;
    }

    return `${x25Words.getNumberTense(value)} ${all}`;
  },

  Info = ({ shown, total, one, all }: InfoPropTypes) => (
    <div className="text-muted">
      {`${words.Showing} `}
      {shown === total ? `${words.All} - ` : `${shown} ${words.Of}`}
      {` ${getNumberForm(total, one, all)}`}
    </div>
  );

export default Info;
