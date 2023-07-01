const Schedule = require("../models/schedule");
const { saveDate, deleteDate } = require("./dates");

const getSchedule = async (from, to) => {
  const sc = await Schedule.findOne({ from, to })
    .select("-_id -__v -previous_range._id")
    .lean();
  return sc;
};
const updateSchedule = async ({ from, to, key, $new }) => {
  const doc = await Schedule.findOneAndUpdate(
    { from, to },
    { [key]: $new },
    { new: true }
  );
  return doc;
};

const saveNew = async ({ from, to, $new }) => {
  const ass = new Schedule($new);
  await ass.save();
  await saveDate({ from, to });
  return ass;
};

const deleteSuggestion = async ({ from, to, by }) => {
  const sch = await Schedule.updateOne(
    { from, to },
    { $unset: { [`suggestions.${by}`]: 1 } }
  );
  return sch;
};
const deleteSchedule = async (filter) => {
  await Schedule.findOneAndDelete(filter);
  await deleteDate(filter);
};

const scheduleExists = async (filter) =>
  Boolean(await Schedule.findOne(filter));

module.exports = {
  getSchedule,
  updateSchedule,
  deleteSuggestion,
  deleteSchedule,
  saveNew,
  scheduleExists,
};
