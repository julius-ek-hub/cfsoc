const fs = require("fs");
const path = require("path");
const kdbxweb = require("kdbxweb");
const jwt = require("jsonwebtoken");
const logg = require("../logs");
const { env, _l, _keys } = require("../utils/common");

const log = (message, req) =>
  logg(
    {
      message,
      status: "success",
      severity: "info",
    },
    req
  );

const fields = {
  title: { label: "Title" },
  username: { label: "UserName" },
  password: { label: "Password" },
  url: { label: "URL" },
  notes: { label: "Notes" },
};

const getPass = (entry) => {
  try {
    return entry.fields.get("Password").getText();
  } catch (error) {
    return "";
  }
};

const getDbObject = async (cred = {}) => {
  const dbPath = path.join(__dirname, "db", cred.db || "");

  const dbContent = fs.readFileSync(dbPath);
  const dbBuff = kdbxweb.ByteUtils.arrayToBuffer(dbContent);

  let __pass = cred.pass;

  if (cred.pwd_token) __pass = jwt.verify(cred.pwd_token, env("JWT_KEY"));

  const pass = kdbxweb.ProtectedValue.fromString(__pass);

  const credentials = new kdbxweb.Credentials(pass);

  return kdbxweb.Kdbx.load(dbBuff, credentials);
};

const getGroupContent = async (credentials) => {
  const db = await getDbObject(credentials);

  const rbuuid = db.meta.recycleBinUuid?.toString();
  const dguuid = db.getDefaultGroup().uuid.toString();

  /**
   * @param {kdbxweb.KdbxGroup} gp
   */

  const get = (gp, $location) => {
    const n = gp.name.split("__opuuid__");
    const uuid = gp.uuid.toString();
    recyclebin = uuid === rbuuid;

    const entries = [];
    gp.entries.forEach((entry, index) => {
      entries.push({
        title: entry.fields.get("Title"),
        username: entry.fields.get("UserName"),
        password: getPass(entry),
        url: entry.fields.get("URL"),
        notes: entry.fields.get("Notes"),
        uuid: entry.uuid.toString(),
        opuuid: entry.fields.get("opuuid") || uuid,
        deleted: entry.fields.get("deleted") || recyclebin,
        $location: `${$location}.entries.${index}`,
        ...entry.times,
      });
    });

    const ic = _keys(kdbxweb.Consts.Icons)[gp.icon] || "folder";

    return {
      name: n[0],
      opuuid: n[1] || gp.parentGroup?.uuid?.toString(),
      default: uuid === dguuid,
      deleted: Boolean(n[1]),
      icon: _l(ic || "folder"),
      uuid,
      entries,
      recyclebin,
      groups: gp.groups.map((gp, i) => get(gp, `${$location}.groups.${i}`)),
      $location: `${$location}`,
      expanded: gp.expanded,
    };
  };

  return {
    groups: db.groups.map((gp, i) => get(gp, `0.groups.${i}`)),
    ...(credentials.pass && {
      pwd_token: jwt.sign(credentials.pass, env("JWT_KEY")),
    }),
  };
};

const getDBs = () =>
  new Promise((res, rej) => {
    const p = path.join(__dirname, "db");
    if (!fs.existsSync(p)) fs.mkdirSync(p);
    fs.readdir(p, (err, files) => {
      if (err) return rej({ error: err.message });
      const dbs = [];
      files.forEach((file) => {
        if (file.endsWith(".kdbx")) dbs.push(file);
      });
      res(dbs);
    });
  });

const save = (dbName, $new) => {
  const p = path.join(__dirname, "db", dbName);
  if (fs.existsSync(p)) fs.rmSync(p);

  fs.writeFileSync(p, $new);
};

module.exports = {
  save,
  getDBs,
  getDbObject,
  getGroupContent,
  log,
  fields,
};
