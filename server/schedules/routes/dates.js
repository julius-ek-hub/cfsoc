const {
  getDates: gd,
  getShifs: gs,
  saveShifts: ss,
  get_max_days,
  set_max_days,
} = require("../db/dates");

const getDates = async (req, res) => res.json(await gd());
const getShifts = async (req, res) => res.json(await gs());
const saveShifts = async (req, res) => res.json(await ss(req.body));
const getMaxDays = async (req, res) =>
  res.json({ max_days: await get_max_days() });
const setMaxDays = async (req, res) =>
  res.json({ max_days: await set_max_days(req.body.max_days) });

module.exports = { getDates, getShifts, saveShifts, getMaxDays, setMaxDays };
