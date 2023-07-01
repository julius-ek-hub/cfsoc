const {
  updateSchedule,
  getSchedule,
  deleteSchedule,
} = require("../db/schedules");

const updateSuggestion = async (req, res) => {
  const { from, to, by, $new } = req.body;
  const sch = await getSchedule(from, to);
  sch.suggestions[by] = $new;
  const _new = await updateSchedule({
    from,
    to,
    $new: sch.suggestions,
    key: "suggestions",
  });

  res.json(_new);
};

const deleteSuggetion = async (req, res) => {
  const { from, to, by } = req.query;
  const sch = await getSchedule(from, to);
  delete sch.suggestions[by];
  if (Object.keys(sch.suggestions).length === 0) {
    await deleteSchedule({ from, to });
    return res.json({
      from,
      to,
      suggestions: {},
      error: "Not found",
      errorCode: 404,
    });
  }
  const _new = await updateSchedule({
    from,
    to,
    $new: sch.suggestions,
    key: "suggestions",
  });

  res.json(_new);
};

module.exports = { updateSuggestion, deleteSuggetion };
