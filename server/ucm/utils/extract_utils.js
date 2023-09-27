const exceljs = require("exceljs");
const { Readable } = require("stream");

const getCellValue = (v) => {
  let value = v || "";
  if (value) {
    if (value.result || value.formula) value = String(value.result || "");
    if (value.error) value = "#N/A";
    if (value.date1904) value = cell.value.toLocaleString();
    if (value.hyperlink) value = value.hyperlink;
    if (["number", "boolean"].includes(typeof value)) value = String(value);
    if (typeof value !== "string") value = JSON.stringify(value);
  }
  return value.split(/(\\n|\\t)/).join(" ");
};

const prepare = async (file, sheet_index) => {
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

  ws.getRow(1).eachCell((cell) => {
    const value = getCellValue(cell.value) || "null";
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

  return { worker: { ws, columns }, type: "excel" };
};

module.exports = { getCellValue, prepare };
