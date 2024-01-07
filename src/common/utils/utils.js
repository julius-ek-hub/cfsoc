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

export const arrMust = (doubt) => (!Array.isArray(doubt) ? [doubt] : doubt);
export const u_arr = (arr = []) => [...new Set(arr)];

export function escapeRegEx(string = "") {
  if (typeof string !== "string") {
    throw new TypeError("Expected a string");
  }
  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}

export const replace = (text, find, replacer) => {
  let val = text;

  [...new Set(val.match(find) || [])].map((s) => {
    val = val.replace(new RegExp(escapeRegEx(s), "g"), replacer(s));
  });
  return val;
};

const noSpecial = (v) =>
  replace(v, /&[a-z0-9]+;/gi, (s) => `&amp;${s.substring(1)}`);

const noCode = (v, col) =>
  v
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /___begin___/g,
      `<span style="background-color:${col || "#005b96"};color:#fff">`
    )
    .replace(/___end___/g, "</span>");

export const highlightSearch = (v, search, col) => {
  let val = String(typeof v === "undefined" ? "" : v);

  if (!search) return noCode(noSpecial(val), col);

  val = replace(
    val,
    new RegExp(escapeRegEx(search), "gi"),
    (s) => `___begin___${s}___end___`
  );

  val = noSpecial(val);

  return noCode(val, col);
};
