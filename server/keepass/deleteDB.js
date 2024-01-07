const path = require("path");
const fs = require("fs");
const { getDBs, log } = require("./utils");

module.exports = async (req, res) => {
  const dbs = await getDBs();

  dbs.map((db) => fs.unlinkSync(path.join(__dirname, "db", db)));

  await log("Database deleted", req);
  res.json({});
};
