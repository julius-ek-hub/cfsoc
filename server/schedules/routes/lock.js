const { getSchedule, updateSchedule } = require("../db/schedules");

module.exports = async (req, res) => {
  const { from, to } = req.body;
  const ass = await getSchedule(from, to);
  const locked = !Boolean(ass.locked);

  await updateSchedule({
    from,
    to,
    key: `locked`,
    $new: locked,
  });
  res.json({ locked });
};
