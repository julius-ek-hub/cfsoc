export const td = (v, search) => {
  let val = String(typeof v === "undefined" ? "" : v);
  if (!search) return val;

  [
    ...new Set(
      val.match(
        new RegExp(search.replace(/</g, "&lt;").replace(/>/g, "&gt;"), "ig")
      ) || []
    ),
  ].map((s) => {
    val = val.replace(
      new RegExp(s, "g"),
      `<span style="background-color:yellow">${s}</span>`
    );
  });

  return val;
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
