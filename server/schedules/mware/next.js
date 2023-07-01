const { getDates, get_max_days } = require("../db/dates");
const { next_or_current } = require("../utils/common");
const n = require("../utils/next");

module.exports = async (req, res, next) => {
  try {
    const md = (await get_max_days()) || 15;
    const dates = await getDates();
    const find = (what) => {
      return dates.find((s) => next_or_current(s.from, s.to, md)[what]);
    };

    const has_next = find("next");
    const current = find("current");

    const DAY = 1000 * 60 * 60 * 24;

    if (current && !has_next) {
      const day_t = new Date(current.to).getTime() / DAY;
      Math.floor(day_t - new Date().getTime() / DAY < 7) && n();
    }
  } catch (error) {
  } finally {
    next();
  }
};
