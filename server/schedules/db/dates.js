const { DDate, Shift } = require("../models/dates");
const path = require("path");

const md_path = path.join(__dirname, "max_days.txt");

const fs = require("fs").promises;

const getDates = async () => {
  return await DDate.find();
};

const getShifs = async () => {
  return await Shift.find().select("-__v -_id").lean();
};
const saveShifts = async ($new) => {
  const exists = await Shift.findOne({ from: $new.from, to: $new.to });
  if (exists) return { error: "Shift Exists" };
  const s = new Shift($new);
  return s.save();
};

const saveDate = async ($new) => {
  const d = new DDate($new);
  return await d.save();
};

const deleteDate = async (filter) => await DDate.findOneAndDelete(filter);

const get_max_days = async () => {
  const r = await fs.readFile(md_path);
  return Number(r.toString("utf-8"));
};
const set_max_days = async (num) => {
  await fs.writeFile(md_path, String(num));
  return num;
};

module.exports = {
  saveDate,
  getDates,
  getShifs,
  saveShifts,
  deleteDate,
  get_max_days,
  set_max_days,
};
