const fs = require("fs");
const path = require("path");
const kdbxweb = require("kdbxweb");
const { env } = require("../utils/common");
const jwt = require("jsonwebtoken");
const { getDBs: gDBs } = require("./utils");

const getDBContent = async (req, res) => {
  const bd = req.body;
  const dbPath = path.join(__dirname, "db", bd.db);

  const dbContent = fs.readFileSync(dbPath);
  const dbBuff = kdbxweb.ByteUtils.arrayToBuffer(dbContent);

  let __pass = bd.pass;

  if (bd.pwd_token) __pass = jwt.verify(bd.pwd_token, env("JWT_KEY"));

  const pass = kdbxweb.ProtectedValue.fromString(__pass);

  const credentials = new kdbxweb.Credentials(pass);

  const db = await kdbxweb.Kdbx.load(dbBuff, credentials);

  const getGroupContent = (gp) => {
    const entries = [];
    gp.entries.forEach((entry) => {
      entries.push({
        title: entry.fields.get("Title"),
        username: entry.fields.get("UserName"),
        password: entry.fields.get("Password").getText(),
        url: entry.fields.get("URL"),
        notes: entry.fields.get("Notes"),
        uuid: entry.uuid.toString(),
        ...entry.times,
      });
    });

    return {
      name: gp.name,
      uuid: gp.uuid.toString(),
      entries,
      groups: gp.groups.map(getGroupContent),
    };
  };

  // db.groups.map((gp) => {
  //   gp.entries.forEach((entry) => {
  //     console.log(entry);
  //     entry.fields.set()
  //   });
  //   const e = new kdbxweb.KdbxEntry();
  //   e.fields.set()
  //   gp.entries.push(new kdbxweb.KdbxEntry())
  // });

  res.json({
    groups: db.groups.map(getGroupContent),
    ...(bd.pass && { pwd_token: jwt.sign(bd.pass, env("JWT_KEY")) }),
  });
};

const getDBs = async (req, res) => {
  const dbs = await gDBs();
  res.json(dbs.map((db) => ({ name: db, groups: [] })));
};

module.exports = {
  getDBContent,
  getDBs,
};
