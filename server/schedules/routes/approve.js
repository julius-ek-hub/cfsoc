const { getSchedule, updateSchedule } = require("../db/schedules");

module.exports = async (req, res) => {
  const { from, to, by } = req.body;
  const ass = await getSchedule(from, to);
  const approved = !Boolean(ass.suggestions[by].approved);
  ass.suggestions[by].approved = approved;
  const locked = approved;

  await updateSchedule({
    from,
    to,
    key: `locked`,
    $new: locked,
  });

  await updateSchedule({
    from,
    to,
    key: `suggestions`,
    $new: ass.suggestions,
  });

  res.json({ approved, locked });
};
