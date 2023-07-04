const { saveNew } = require("../db/schedules");
const { getDates, getShifs, get_max_days } = require("../db/dates");
const { getStaff } = require("../../auth/db");
const { getStatus, saveStatus } = require("../db/statuses");

const { generateAssiduity, generateDateRange } = require("../utils/generator");

module.exports = async (req, res) => {
  const { from: f } = req.body;
  const md = (await get_max_days()) || 15;
  const d = await getDates();
  if (d.length === 0) {
    const staffs = await getStaff();
    delete staffs["marc.hervieux"];
    const shifts = await getShifs();
    const statuses = await getStatus();
    if (Object.keys(staffs).length === 0)
      return res.json({ error: "No staff added." });
    if (shifts.length === 0)
      return res.json({
        error:
          "At least one shift needed to generate schedule, go to settings and add a shift.",
      });
    if (statuses.length === 0)
      await saveStatus([{ name: "work", label: "X" }, { name: "off" }]);
    const { from, to } = generateDateRange({
      from: f,
      max_day: md,
    });
    const range = { from, to };
    const $new = {
      ...range,
      suggestions: {
        sys: {
          assiduity: await generateAssiduity({ ...range, staffs, shifts }),
          votes: ["sys"],
          generated_on: Date.now(),
        },
      },
    };

    await saveNew({ from, to, $new });
    return res.json($new);
  }
  res.json({});
};
