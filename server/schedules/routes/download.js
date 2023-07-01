const xlsx = require("../utils/xlsx");
const { schedule_date_range_ui } = require("../utils/common");

module.exports = async (req, res) => {
  const { from, to } = req.query;

  const dr = schedule_date_range_ui(from, to);
  const date = `${dr[0]} - ${dr[1]}`;
  const wb = await xlsx(req.query);
  wb.xlsx.writeFile(`./download/SOC Schedule ${date}.xlsx`);
  res.json({});
};
