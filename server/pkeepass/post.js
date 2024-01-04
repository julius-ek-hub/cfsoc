const { ProtectedValue } = require("kdbxweb");
const { deepKey, _entr } = require("../utils/common");
const { getDbObject, fields, save, getGroupContent } = require("./utils");

const addEntry = async (req, resp) => {
  const bd = req.body;
  const cred = bd.credentials;
  const entry = bd.entry;
  const $location = bd.$location;

  const db = await getDbObject(cred);

  const group = deepKey($location, [db]);

  const ent = db.createEntry(group);

  _entr(entry).map(([k, v]) => {
    ent.fields.set(
      fields[k].label,
      k === "password" ? ProtectedValue.fromString(v) : v
    );
  });

  const ab = await db.save();

  save(cred, Buffer.from(ab));

  const content = await getGroupContent(cred);

  resp.json(content);
};
const addGroup = async (req, resp) => {
  const bd = req.body;
  const cred = bd.credentials;
  const name = bd.name;
  const $location = bd.$location;

  const db = await getDbObject(cred);

  const group = deepKey($location, [db]);

  db.createGroup(group, name);

  const ab = await db.save();

  save(cred, Buffer.from(ab));

  const content = await getGroupContent(cred);

  resp.json(content);
};

module.exports = {
  addEntry,
  addGroup,
};
