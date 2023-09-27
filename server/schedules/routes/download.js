const xlsx = require("../utils/xlsx");

module.exports = async (req, res) => {
  const wb = await xlsx(req.query);
  const buffer = await wb.xlsx.writeBuffer();
  res.type("application/vnd.ms-excel").send(buffer);
};
