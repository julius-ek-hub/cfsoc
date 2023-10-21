const { generateAssiduity } = require("../utils/generator");
const { getSchedule, updateSchedule } = require("../db/schedules");
const { getStaff } = require("../../auth/db");
const { getShifs } = require("../db/dates");

module.exports = async (req, res) => {
  const { from, to, by, copy } = req.query;
  let assiduity, shifts;
  const sug = await getSchedule(from, to);

  if (copy) {
    assiduity = sug.suggestions[copy].assiduity;
    shifts = sug.suggestions[copy].shifts;
  } else {
    const staffs = await getStaff();
    delete staffs["marc.hervieux"];
    delete staffs.system;
    shifts = await getShifs();
    assiduity = await generateAssiduity({
      from,
      to,
      blank: true,
      staffs,
      shifts,
    });
  }
  const _sug = { assiduity, votes: [by], shifts, generated_on: Date.now() };
  sug.suggestions[by] = _sug;

  await updateSchedule({
    from,
    to,
    $new: sug.suggestions,
    key: `suggestions`,
  });
  res.json(_sug);
};
