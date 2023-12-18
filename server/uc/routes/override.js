const { overRide: od } = require("../db/override");

const overRide = async (req, res) => {
  const odd = await od(req.body);
  res.json(odd);
};

module.exports = {
  overRide,
};
