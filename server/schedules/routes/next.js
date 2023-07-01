const next = require("../utils/next");

module.exports = async (req, res) => {
  res.json(await next());
};
