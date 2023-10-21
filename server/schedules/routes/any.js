const { getSchedule } = require("../db/schedules");

module.exports = async (req, res) => {
  const range = req.params.range;
  const by = req.query.by || "system";

  const fixed = { suggestions: {}, by };

  const r = range
    .split(/[_~]/)
    .filter((p) => p)
    .map((d) => d.replaceAll("-", "/"));

  if (r.length !== 2)
    return res.json({
      from: "",
      to: "",
      error: "Invalid Request",
      errorCode: 400,
      stack: __filename,
      ...fixed,
    });

  const schedule = await getSchedule(r[0], r[1]);

  if (!schedule)
    return res.json({
      from: r[0],
      to: r[1],
      error: "Oops! Not found",
      errorCode: 404,
      stack: __filename,
      ...fixed,
    });

  return res.json(schedule);
};
