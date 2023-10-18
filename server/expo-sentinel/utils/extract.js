const { getContent } = require("../db/content");
const { getCellValue } = require("./extract_utils");

const is_col_match = (col, key) => {
  return (
    col.toLowerCase().replaceAll("-", "_").replaceAll(" ", "_").trim() ===
      key.toLowerCase().trim() ||
    key.toLowerCase().trim() === col.toLowerCase().trim()
  );
};

const _l = (v) => v.toLowerCase();

const _arr = (v) => {
  try {
    let _v = v;
    if (typeof v === "string") _v = JSON.parse(_v);
    if (Array.isArray(_v) && _v.every((__v) => typeof __v === "string"))
      return _v;
    return v;
  } catch (error) {
    return v;
  }
};

module.exports = async ({ columns, unique_key, type, worker, sheet }) => {
  const data = [];
  let verify = [];
  const warnings = [];
  const col_locations = Object.fromEntries(
    Object.entries(columns).map(([k]) => [k, ""])
  );

  if (sheet === "l1_uc") verify = await getContent("l2_uc");

  const analize = (k, value) => {
    const _data = {};
    if (sheet !== "l1_uc" && typeof value === "object")
      value = JSON.stringify(value);
    else if (sheet === "l1_uc" && k === "l2_uc_identifiers") {
      const _v = String(value)
        .split(",")
        .map((tac) => {
          let find = verify.find(
            (v) =>
              new RegExp(_l(v.name.value), "i").test(_l(tac)) ||
              new RegExp(_l(v.identifier.value), "i").test(_l(tac))
          );
          if (!find) return null;
          return find.identifier.value;
        })
        .filter((v) => v);
      if (_v.length === 0) {
        _data.error = true;
        warnings.push(`Tactic "${value}" not found in the db, hence ignored.`);
      } else value = _v;
    } else value = String(value);
    if (k === unique_key) value = value.toUpperCase();
    _data[k] = _arr(value);
    return _data;
  };

  if (type === "json") {
    worker.fields.map((key) => {
      Object.entries(columns).map(([k, v]) => {
        if (is_col_match(key, k) || (v && is_col_match(v, key)))
          col_locations[k] = key;
      });
    });

    const no_col = Object.entries(col_locations).filter((c) => !c[1]);

    if (no_col.length !== 0)
      return {
        error: `The following fields were not found: ${no_col
          .map((nc) => nc[1] || nc[0])
          .join(", ")}`,
      };

    worker.json.map((row) => {
      const _data = {};
      let error;
      Object.entries(col_locations).map(([k, v]) => {
        let a = analize(k, row[v]);
        _data[k] = { value: a[k] };
        if (a.error) error = a.error;
      });
      Object.keys(_data).length > 0 && !error && data.push(_data);
    });

    return { data, warnings: [...new Set(warnings)] };
  }

  worker.columns.map((sc, ind) => {
    Object.entries(columns).map(([k, v]) => {
      if (is_col_match(sc, k) || (v && is_col_match(v, sc)))
        col_locations[k] = ind;
    });
  });

  // console.log(col_locations);

  const no_col = Object.entries(col_locations).filter(
    (c) => typeof c[1] !== "number"
  );

  if (no_col.length !== 0)
    return {
      error: `The following columns were not found: ${no_col
        .map((nc) => nc[1] || nc[0])
        .join(", ")}`,
    };

  worker.ws.getRows(2, worker.ws.rowCount - 1)?.forEach((row, rInd) => {
    const _data = {};
    let error;
    Object.entries(col_locations).map(([k, ind]) => {
      const cell = row.getCell(ind + 1);
      let image;
      // console.log(rInd, ind, worker.images);
      const im = worker.images.find(
        (im) => im.row === rInd && im.col === ind - 1
      );
      if (im) image = im.name;
      const style = cell.style;
      const bgcolor = style.fill?.fgColor?.argb;
      const color = style.font?.fgColor?.argb;
      let { value, link } = getCellValue(cell.value);
      let a = analize(k, value);
      _data[k] = {
        value: a[k],
        sx: {
          textAlign: style.alignment?.horizontal || "left",
          verticalAlign: style.alignment?.vertical || "middle",
          fontWeight: style.font?.bold ? "bold" : "normal",
          fontSize: (style.font?.size || 10) + 5,
          ...(bgcolor && { bgcolor: `#${bgcolor}` }),
          ...(color && { color: `#${color}` }),
        },
        ...(link && { link }),
        ...(image && { image }),
      };
      if (a.error) error = a.error;
    });

    Object.keys(_data).length > 0 && !error && data.push(_data);
  });
  return { data, warnings: [...new Set(warnings)] };
};
