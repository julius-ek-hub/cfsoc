const objectExcept = (obj = {}, except) => {
  const _new = { ...obj };
  except = Array.isArray(except) ? except : [except];
  return Object.fromEntries(
    Object.entries(_new).filter(([k]) => !except.includes(k))
  );
};

const _entr = (ob) => Object.entries(ob);
const entr_ = (arr) => Object.fromEntries(arr);
const _l = (str) => String(str).toLowerCase().trim();
const _u = (str) => String(str).toUpperCase().trim();
const _keys = (ob) => Object.keys(ob);
const _values = (ob) => Object.values(ob);
const u_arr = (arr = []) => [...new Set(arr)];

const deepKey = (key, obj, update, fs = ".") => {
  const keys = (key || "").split(fs);
  const lastKey = keys.at(-1);
  const object = keys
    .reverse()
    .slice(1)
    .reverse()
    .reduce((prev, next) => {
      return (
        prev[isNaN(next) ? next : Number(next)] ||
        (Array.isArray(prev) ? [] : {})
      );
    }, obj);
  return update ? { object, lastKey } : object[lastKey];
};

const arrMust = (doubt) => (!Array.isArray(doubt) ? [doubt] : doubt);

const env = (key) => process.env[key];

const u = (str) => str[0].toUpperCase() + str.substring(1);

const sleep = (time = 1000) => new Promise((res) => setTimeout(res, time));

const arr_to_obj = (arr, key) => {
  return arr.reduce((prev, curr) => {
    prev[curr[key]] = curr;
    return prev;
  }, {});
};

function escapeRegEx(string = "") {
  if (typeof string !== "string") {
    throw new TypeError("Expected a string");
  }
  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}

module.exports = {
  arr_to_obj,
  objectExcept,
  escapeRegEx,
  u,
  env,
  sleep,
  _entr,
  entr_,
  _l,
  _u,
  _keys,
  u_arr,
  _values,
  deepKey,
  arrMust,
};
