const path = require("path");
const fs = require("fs");
const { getDBs, log } = require("./utils");

module.exports = async (req, res) => {
  const $new = req.files.file;

  const dbs = await getDBs();

  dbs.map((db) => fs.unlinkSync(path.join(__dirname, "db", db)));

  const name = req.body.name;

  await $new.mv(path.join(__dirname, "db", name));
  await log("DB uploaded", req);
  res.json({ name, groups: [] });
};
