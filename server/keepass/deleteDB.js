const path = require("path");
const fs = require("fs");
const { getDBs } = require("./utils");

module.exports = async (req, res) => {
  const dbs = await getDBs();

  dbs.map((db) => fs.unlinkSync(path.join(__dirname, "db", db)));

  res.json({});
};
