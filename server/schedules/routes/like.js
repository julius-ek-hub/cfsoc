const { getSchedule, updateSchedule } = require("../db/schedules");

module.exports = async (req, res) => {
  const { from, to, by, liker } = req.body;
  const ass = await getSchedule(from, to);
  const likes = ass.suggestions[by].votes;

  if (likes.includes(liker)) {
    const lindex = likes.indexOf((_) => _ === liker);
    likes.splice(lindex, 1);
  } else likes.push(liker);

  ass.suggestions[by].votes = likes;

  await updateSchedule({
    from,
    to,
    key: `suggestions`,
    $new: ass.suggestions,
  });
  res.json(likes);
};
