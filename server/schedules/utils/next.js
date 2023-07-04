const { saveNew, getSchedule, scheduleExists } = require("../db/schedules");
const { getShifs, getDates, get_max_days } = require("../db/dates");
const { getStaff } = require("../../auth/db");
const { accepted_schedule, next_or_current } = require("../utils/common");

const { generateAssiduity, generateDateRange } = require("../utils/generator");

module.exports = async () => {
  const dates = await getDates();
  const max_day = (await get_max_days()) || 15;

  if (dates.find((s) => next_or_current(s.from, s.to, max_day).next))
    return {
      from: "",
      to: "",
      error: "NEXT_SCHEDULE_EXISTS",
      errorCode: 400,
      stack: __filename,
      suggestions: {},
    };

  const pr = dates.sort(
    (a, b) => new Date(b.to).getTime() - new Date(a.to).getTime()
  )[0];

  if (!pr)
    return {
      from: "",
      to: "",
      error: "LAST_DATE_NOT_FOUND",
      errorCode: 400,
      stack: __filename,
      suggestions: {},
    };

  const previous_schedule = await getSchedule(pr.from, pr.to);

  const accepted = accepted_schedule(previous_schedule.suggestions);

  const f = new Date(
    new Date(pr.to).getTime() + 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-US");

  const exists = await scheduleExists({ from: f });

  if (exists) {
    return {
      from: "",
      to: "",
      error: "SCHEDULE_EXISTS",
      errorCode: 400,
      stack: __filename,
      suggestions: {},
    };
  }

  const staffs = await getStaff();
  delete staffs["marc.hervieux"];
  const shifts = await getShifs();

  const { from, to } = generateDateRange({
    from: f,
    max_day,
  });

  const range = { from, to };
  const $new = {
    ...range,
    suggestions: {
      sys: {
        assiduity: await generateAssiduity({
          ...range,
          staffs,
          shifts,
          previous_schedule: previous_schedule.suggestions[accepted],
        }),
        votes: ["sys"],
      },
    },
  };

  await saveNew({ from, to, $new });
  return { from, to };
};
