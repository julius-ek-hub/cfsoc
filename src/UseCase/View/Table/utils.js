export const td = (v, search) => {
  const noCode = (v) =>
    v
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/___begin___/g, '<span style="background-color:yellow">')
      .replace(/___end___/g, "</span>");
  let val = String(typeof v === "undefined" ? "" : v);
  if (!search) return noCode(val);

  [...new Set(val.match(search) || [])].map((s) => {
    val = val.replace(new RegExp(s, "g"), `___begin___${s}___end___`);
  });

  return noCode(val);
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
