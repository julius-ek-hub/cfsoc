const exceljs = require("exceljs");

const path = require("path");
const { _entr, _values, entr_ } = require("../../utils/common");
const { numberToLetters } = require("../utils");

module.exports = async (req, res) => {
  const { rows, columns } = req.body;

  const wb = new exceljs.Workbook();

  //   const imageId2 = workbook.addImage({
  //     buffer: fs.readFileSync('path/to.image.png'),
  //     extension: 'png',
  //   });

  //worksheet.addRow([3, 'Sam', new Date()]);
  //   worksheet.addImage(imageId2, {
  //     tl: { col: 0, row: 0 },
  //     ext: { width: 500, height: 200 }
  //   });

  wb.creator = "Julius";
  wb.created = new Date();

  const sortedCol = _entr(columns).sort(
    (a, b) => a[1].position - b[1].position
  );
  const widths = [...sortedCol].map(([k]) => 0);

  const rs = rows.map((row) =>
    sortedCol.map(([k], i) => {
      let v = row[k]?.value || "";
      if (Array.isArray(v)) v = v.join(", ");
      const len = String(v).length;
      if (widths[i] < len) widths[i] = len;
      return v;
    })
  );

  const ws = wb.addWorksheet("Use Cases");

  ws.addRow(sortedCol.map((sc) => sc[1].label));
  ws.addRows(rs);

  ws.autoFilter = `A1:${numberToLetters(sortedCol.length + 1)}1`;

  widths.map((width, i) => {
    const col = ws.getColumn(i + 1);
    col.width = width > 80 ? 80 : width;
  });

  const buff = await wb.xlsx.writeBuffer();
  res.end(buff);
};
