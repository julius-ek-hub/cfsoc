const exceljs = require("exceljs");

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
      ws.addRows([
        sorted_cols.map((sr, col_Index) => {
          let val = data[sr[0]];
          const len = String(val).length;
          const old = colWidths[col_Index];
          if (!old || old < val) colWidths[col_Index] = len;
          if (val && !isNaN(val)) return Number(val);
          const p = String(val).split("%");
          if (p.length === 2 && !p[1] && !isNaN(p[0])) {
            ws.getColumn(col_Index + 1).numFmt = "0.00%";

            return Number(p[0]) / 100;
          }
          return val;
        }),
      ]);
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
};
