const path = require("path");
const fs = require("fs");
const { getDBs } = require("./utils");

module.exports = async (req, res) => {
  const { uname } = req.query;
  const dbs = await getDBs(uname);

  dbs.map((db) => fs.unlinkSync(path.join(__dirname, "db", uname, db)));

  res.json({});
};
