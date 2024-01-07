const { ProtectedValue, KdbxEntry, KdbxGroup } = require("kdbxweb");
const { deepKey, _entr } = require("../utils/common");
const { getDbObject, getGroupContent, fields, save, log } = require("./utils");

const updateEntry = async (req, resp) => {
  const bd = req.body;
  const cred = bd.credentials;
  const entry = bd.entry;
  const $location = bd.$location;

  const db = await getDbObject(cred);

  const ent = deepKey($location, [db]);

  _entr(entry).map(([k, v]) => {
    ent.fields.set(
      fields[k].label,
      k === "password" ? ProtectedValue.fromString(v) : v
    );
  });

  const ab = await db.save();

  save(cred.db, Buffer.from(ab));

  const content = await getGroupContent(cred);

  await log("Entry updated", req);

  resp.json(content);
};

const updateGroup = async (req, resp) => {
  const bd = req.body;
  const cred = bd.credentials;
  const name = bd.name;
  const $location = bd.$location;

  const db = await getDbObject(cred);

  const group = deepKey($location, [db]);

  group.name = name;

  const ab = await db.save();

  save(cred.db, Buffer.from(ab));

  const content = await getGroupContent(cred);

  await log("Group updated", req);

  resp.json(content);
};

const restoreGroup = async (req, resp) => {
  const bd = req.body;
  const cred = bd.credentials;
  const $location = bd.$location;

  const db = await getDbObject(cred);

  $location.map(($l) => {
    /**
     * @type {KdbxGroup}
     */

    const group = deepKey($l, [db]);

    const n = group.name.split("__opuuid__");

    if (n.length === 2) {
      group.name = n[0];
      db.move(group, db.getGroup(n[1]));
    } else {
      db.move(group, db.getDefaultGroup());
    }
  });

  const ab = await db.save();

  save(cred.db, Buffer.from(ab));

  const content = await getGroupContent(cred);

  await log("Group restored", req);

  resp.json(content);
};

const restoreEntry = async (req, resp) => {
  const bd = req.body;
  const cred = bd.credentials;
  const $location = bd.$location;

  const db = await getDbObject(cred);

  $location.map(($l) => {
    /**
     * @type {KdbxEntry}
     */

    const entry = deepKey($l, [db]);

    const opuuid = entry.fields.get("opuuid");

    if (opuuid) {
      entry.fields.delete("opuuid");
      entry.fields.delete("deleted");
      db.move(entry, db.getGroup(opuuid));
    } else {
      db.move(entry, db.getDefaultGroup());
    }
  });

  const ab = await db.save();

  save(cred.db, Buffer.from(ab));

  const content = await getGroupContent(cred);

  await log("Entry restored", req);

  resp.json(content);
};

const restoreRB = async (req, resp) => {
  const bd = req.body;
  const cred = bd.credentials;

  const db = await getDbObject(cred);

  let recycleBin = db.getGroup(db.meta.recycleBinUuid);
  if (!recycleBin) db.createRecycleBin();

  const rb = db.getGroup(db.meta.recycleBinUuid);
  const dg = db.getDefaultGroup();

  const byMeG = (gp) => gp.name.split("__opuuid__").length === 2;
  const byMeE = (en) => en.fields.get("opuuid");

  const notMeG = rb.groups.filter((g) => !byMeG(g));
  const notMeE = rb.entries.filter((e) => !byMeE(e));

  rb.groups.filter(byMeG).map((group) => {
    const n = group.name.split("__opuuid__");
    group.name = n[0];
    const g = db.getGroup(n[1]);
    g.groups = [...g.groups, group];
  });

  rb.entries.filter(byMeE).map((entry) => {
    const opuuid = entry.fields.get("opuuid");
    entry.fields.delete("opuuid");
    entry.fields.delete("deleted");
    const g = db.getGroup(opuuid);
    g.entries = [...g.entries, entry];
  });

  dg.groups = [...dg.groups, ...notMeG];
  dg.entries = [...dg.entries, ...notMeE];
  rb.groups = [];
  rb.entries = [];

  const ab = await db.save();

  save(cred.db, Buffer.from(ab));

  const content = await getGroupContent(cred);

  await log("All Items in recycle Bin restored", req);

  resp.json(content);
};

const move = async (req, resp) => {
  const bd = req.body;
  const cred = bd.credentials;
  const $target = bd.$target;
  const $to = bd.$to;

  const db = await getDbObject(cred);

  $target.map(($t) => {
    /**
     * @type {KdbxEntry | KdbxGroup}
     */

    const e_o_g = deepKey($t, [db]);
    const to = deepKey($to, [db]);
    db.move(e_o_g, to);
  });

  const ab = await db.save();

  save(cred.db, Buffer.from(ab));

  const content = await getGroupContent(cred);

  await log("Entry or Group moved", req);

  resp.json(content);
};

module.exports = {
  updateGroup,
  updateEntry,
  restoreGroup,
  restoreEntry,
  restoreRB,
  move,
};
