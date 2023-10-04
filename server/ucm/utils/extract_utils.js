const exceljs = require("exceljs");
const { Readable } = require("stream");
const fs = require("fs");
const path = require("path");

const getCellValue = (v) => {
  let value = v || "";
  let link;
  if (value) {
    if (value.result || value.formula) value = String(value.result || "");
    if (value.error) value = "#N/A";
    if (value.date1904) value = cell.value.toLocaleString();
    if (value.sh) value = cell.value.toLocaleString();
    if (value.hyperlink) {
      link = value.hyperlink;
      value = value.text;
    }
    if (["number", "boolean"].includes(typeof value)) value = String(value);
    if (value.sharedFormula) value = "";
    if (typeof value !== "string") value = JSON.stringify(value);
  }
  return {
    value: value
      .split(/(\\n|\\t)/)
      .join(" ")
      .trim(),
    link,
  };
};

const prepare = async (file, sheet_index, sheet) => {
  const ext = file.name.split(".").at(-1);
  if (ext === "json") {
    let json = JSON.parse(file.data.toString());

    if (!Array.isArray(json)) json = [json];

    return { worker: { json, fields: Object.keys(json[0]) }, type: "json" };
  }
  const wb = new exceljs.Workbook();

  if (ext === "csv") await wb.csv.read(Readable.from(file.data));
  else await wb.xlsx.load(file.data);
  const ws = wb.worksheets[Number(sheet_index)];
  const columns = [];

  if (!ws)
    return {
      error: `Worksheet at index ${sheet_index} doesn't exist.`,
    };

  const img_paths = path.join(
    ...__dirname.split(path.sep).reverse().slice(2).reverse(),
    "view",
    "sheet_images",
    sheet
  );

  if (!fs.existsSync(img_paths)) fs.mkdirSync(img_paths);

  const images = [];

  for (const image of ws.getImages()) {
    const img = wb.model.media.find((m) => m.index === image.imageId);
    const row = image.range.tl.nativeRow;
    const col = image.range.tl.nativeCol;
    const name = `${Date.now()}.${row}.${col}.${img.name}.${img.extension}`;
    fs.writeFileSync(`${img_paths}/${name}`, img.buffer);
    images.push({ row, col, name });
  }

  [...new Array(ws.columnCount)].map((i, j) => {
    const cell = ws.getCell(1, j + 1);
    const value = getCellValue(cell.value).value || "column";
    let _value = value;
    while (true) {
      if (columns.includes(_value)) {
        let sp = _value.split("_");
        if (sp.length === 1) _value = value + "_1";
        else _value = value + "_" + (Number(sp[1]) + 1);
      } else break;
    }

    columns.push(_value);
  });

  return { worker: { ws, columns, images }, type: "excel" };
};

module.exports = { getCellValue, prepare };
