const path = require("path");
const fs = require("fs");
const { getDBs, log } = require("./utils");

module.exports = async (req, res) => {
  const $new = req.files.file;
  const uname = req.body.uname;

  const dbs = await getDBs(uname);

  dbs.map((db) => fs.unlinkSync(path.join(__dirname, "db", uname, db)));

  const db = req.body.name;

  await $new.mv(path.join(__dirname, "db", uname, db));
  await log("DB uploaded", req);
  res.json({ name: db, groups: [] });
};
