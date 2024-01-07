const path = require("path");
const { log } = require("./utils");

module.exports = async (req, res) => {
  const { uname, db } = req.query;

  const p = path.join(__dirname, "db", uname, db);
  await log("Database downloaded", req);
  res.download(p, db);
};
