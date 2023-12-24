function escapeRegEx(string = "") {
  if (typeof string !== "string") {
    throw new TypeError("Expected a string");
  }
  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}

const replace = (text, find, replacer) => {
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

export const td = (v, search, col) => {
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

export function descendingComparator(a, b, orderBy) {
  if (b[orderBy]?.value < a[orderBy]?.value) {
    return -1;
  }
  if (b[orderBy]?.value > a[orderBy]?.value) {
    return 1;
  }
  return 0;
}

export function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}