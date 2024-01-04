const path = require("path");

module.exports = async (req, res) => {
  const { db } = req.query;

  const p = path.join(__dirname, "db", db);

  res.download(p, db);
};
