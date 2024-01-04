const path = require("path");

module.exports = async (req, res) => {
  const { uname, db } = req.query;

  const p = path.join(__dirname, "db", uname, db);

  res.download(p, db);
};
