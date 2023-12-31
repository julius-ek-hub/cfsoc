export const u = (str) => str[0].toUpperCase() + str.substring(1);
export const _entr = (ob) => Object.entries(ob);
export const entr_ = (arr) => Object.fromEntries(arr);
export const _l = (str) => String(str).toLowerCase().trim();
export const _u = (str) => String(str).toUpperCase().trim();
export const _keys = (ob) => Object.keys(ob);
export const _values = (ob) => Object.values(ob);
export const sleep = (time = 1000) =>
  new Promise((res) => setTimeout(res, time));

export const deepKey = (key, obj, update, fs = ".") => {
  const keys = key.split(fs);
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

export const arrMust = (doubt) => (!Array.isArray(doubt) ? [doubt] : doubt);
