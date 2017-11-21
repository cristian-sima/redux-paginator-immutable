// @flow
/* eslint-disable no-magic-numbers, no-bitwise*/

type FetchPageArgs = {
  endpoint: string;
  pageArgName: string;
  page: number;
  params: string;
}

import agent from "superagent";
import qs from "query-string";

export const buildSuffix = (pageArgName : string, page : number, params : string) => {
  const parsedParams = qs.parse(params);
  let
    finalParsedParams = {},
    startString = "";

  for (const key of Object.keys(parsedParams)) {
    if (parsedParams[key] === null) {
      startString += key;
    } else {
      finalParsedParams = {
        ...finalParsedParams,
        [key]: parsedParams[key],
      };
    }
  }
  startString = startString === "" ? "?" : `${startString}?`;

  if (Object.keys(finalParsedParams).length > 0 && qs.extract(params) !== "") {
    startString = params.replace(qs.extract(params), "");
  }

  return startString + qs.stringify({
    ...finalParsedParams,
    [pageArgName]: page,
  }, { encode: false }).replace(startString, "");
};

export const fetchPage = ({ endpoint, pageArgName, page, params } : FetchPageArgs) => {
  const
    suffix = buildSuffix(pageArgName, page, params),
    url = endpoint + suffix;

  const promise : Promise<*> = new Promise((resolve, reject) =>
    agent.
      get(url).
      end((err, res) => err ? reject(err) : resolve(res))
  );

  return promise.then((res : { body : any }) => ({
    response: res.body,
  }));
};
