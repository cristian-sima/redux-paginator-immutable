// @flow
/* eslint-disable no-magic-numbers, no-bitwise*/

import agent from "superagent";
import qs from "query-string";

export const FROM_CACHE_FLAG = "@@redux-paginator-immutable/FROM_CACHE_FLAG";

const _promises = {};

// based on http://stackoverflow.com/a/7616484/1836434
const hashUrl = (url) => {
  let hash = 0;

  if (url.length === 0) {
    return hash;
  }

  for (let index = 0, len = url.length; index < len; index += 1) {
    const
      chr = url.charCodeAt(index),
      value = (hash << 5);

    hash = (value - hash) + chr;
    hash = hash || 0;
  }
  return hash;
};

export const buildSuffix = (pageArgName, page, params) => {
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

export const fetchPage = (endpoint, pageArgName, page, params) => {
  const
    suffix = buildSuffix(pageArgName, page, params),
    url = endpoint + suffix,
    hash = hashUrl(url);

  let
    fromCache = true,
    promise = _promises[hash];

  // if (typeof promise === "undefined") {
  fromCache = false;
  promise = new Promise((resolve, reject) =>
    agent.
      get(url).
      end((err, res) => err ? reject(err) : resolve(res))
  );
  // _promises[hash] = promise;
  // }

  return promise.then((res) => fromCache ? {
    response          : res.body,
    [FROM_CACHE_FLAG] : null,
  } : {
    response: res.body,
  });
};
