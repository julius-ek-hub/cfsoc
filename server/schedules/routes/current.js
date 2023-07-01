const { next_or_current: nc } = require("../utils/common");
const { getSchedule } = require("../db/schedules");
const { getDates } = require("../db/dates");

module.exports = async (req, res) => {
  const d = await getDates();
  const _d = d.filter(({ from, to }) => nc(from, to).current)[0] || {};
  const schedule = await getSchedule(_d.from, _d.to);
  res.json(
    schedule || {
      by: "sys",
      error: "Oops! Not found",
      stack: __filename,
      errorCode: 404,
      shifts: [],
    }
  );
};
