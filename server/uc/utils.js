const exceljs = require("exceljs");
const fs = require("fs");
const path = require("path");

const Yup = require("yup");

const validURL = (url) =>
  Yup.object({ url: Yup.string().required().url() }).isValidSync({ url });

const objectExcept = (obj, keys) => {
  const newObject = {};
  for (const k in obj) {
    if (keys.includes(k)) continue;
    newObject[k] = obj[k];
  }
  return newObject;
};

const objectOnly = (obj, keys) => {
  const newObject = {};
  for (const k in obj) {
    if (!keys.includes(k)) continue;
    newObject[k] = obj[k];
  }
  return newObject;
};
const _l = (str) =>
  String(str || "")
    .toLowerCase()
    .trim();
const _entr = (ob) => Object.entries(ob || {});

const u_arr = (arr = []) => [...new Set(arr)];

function escapeRegEx(string = "") {
  if (typeof string !== "string") {
    throw new TypeError("Expected a string");
  }
  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}

const fixObject = (value) => {
  if (typeof value !== "object" || !value) return value;
  if (Array.isArray(value)) return value.map(fixObject);
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k.trim() || "null", fixObject(v)];
    })
  );
};

const structure = (body) => {
  return (Array.isArray(body) ? body : [body]).map((data) => {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        {
          ...(typeof value === "object" && !Array.isArray(value) && value),
          value: typeof value?.value === "undefined" ? value : value.value,
        },
      ])
    );
  });
};

const numberToLetters = (num) => {
  let letters = "";
  while (num >= 0) {
    letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[num % 26] + letters;
    num = Math.floor(num / 26) - 1;
  }
  return letters;
};

const excelBuffer = (payload) => {
  const wb = new exceljs.Workbook();

  payload.map((pl) => {
    const sorted_cols = Object.entries(pl.columns)
      .filter((c) => !pl.excluded_columns.includes(c[0]))
      .sort((a, b) => a[1].position - b[1].position);
    const ws = wb.addWorksheet(pl.name);

    const colWidths = {};

    ws.addRows([sorted_cols.map((sr) => sr[1].label)]);

    ws.autoFilter = `A1:${numberToLetters(sorted_cols.length - 1)}1`;

    pl.data.map((data, r) => {
      sorted_cols.map((sr, col_Index) => {
        const cell = ws.getCell(r + 2, col_Index + 1);
        let v = data[sr[0]];
        let val = v.value;
        if (v.image) {
          const img_path = path.join(
            ...__dirname.split(path.sep).reverse().slice(2).reverse(),
            "server",
            "view",
            "sheet_images",
            pl.sheet,
            v.image
          );

          const imageId = wb.addImage({
            filename: img_path,
            extension: img_path.split(".").at(-1),
          });

          return ws.addImage(imageId, `A${1}:A${1}`);
        }
        const link = validURL(val) && val;
        const len = String(val).length;
        const old = colWidths[col_Index];
        if (!old || old < val) colWidths[col_Index] = len;
        if (val && !isNaN(val)) val = Number(val);
        const p = String(val).split("%");
        if (p.length === 2 && !p[1] && !isNaN(p[0])) {
          cell.numFmt = "0.00%";
          val = Number(p[0]) / 100;
        }
        if (link) {
          cell.value = { text: val, hyperlink: link };
          cell.font = {
            color: { argb: "2F75B5" },
            underline: true,
          };
        } else cell.value = val;
      });
    });

    Object.entries(colWidths).map(([k, v]) => {
      ws.getColumn(Number(k) + 1).width = v > 200 ? 200 : v < 10 ? 10 : v;
    });
    const header = ws.getRow(1);
    header.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "2F75B5" },
    };
    header.height = 50;
    header.font = {
      color: { argb: "FFFFFF" },
      bold: true,
    };
    header.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    header.alignment = { vertical: "middle" };
  });

  return wb.xlsx.writeBuffer();
};

module.exports = {
  structure,
  objectExcept,
  objectOnly,
  excelBuffer,
  numberToLetters,
  fixObject,
  _l,
  _entr,
  u_arr,
  escapeRegEx,
};
