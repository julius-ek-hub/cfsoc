const { getData: gd, overRide: od, updateTactics: ut } = require("../db/data");

const getData = async (req, res) => {
  const data = await gd();
  res.json(data);
};

const overRide = async (req, res) => {
  const odd = await od(req.body);
  res.json(odd);
};
const updateTactics = async (req, res) => {
  const upd = await ut(req.body);
  res.json(upd);
};

module.exports = {
  overRide,
  getData,
  updateTactics,
};
