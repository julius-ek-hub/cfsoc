const { KdbxGroup, KdbxEntry } = require("kdbxweb");
const { deepKey } = require("../utils/common");
const { getDbObject, save, getGroupContent } = require("./utils");

const removeEntry = async (req, resp) => {
  const qr = req.query;
  const cred = { pwd_token: qr.pwd_token, db: qr.db, uname: qr.uname };
  const $location = JSON.parse(qr.$location);

  const db = await getDbObject(cred);

  let recycleBin = db.getGroup(db.meta.recycleBinUuid);
  if (!recycleBin) db.createRecycleBin();
  const rbuuid = db.meta.recycleBinUuid.toString();

  $location.map(($l) => {
    const { object, lastKey } = deepKey($l, [db], true);

    /**
     * @type {KdbxEntry}
     */

    const entry = object[lastKey];

    if (!entry) return;

    const pg = entry.parentGroup;
    const pguuid = pg.uuid.toString();

    if (rbuuid === pguuid) {
      const entries = [...object];
      entries.splice(Number(lastKey), 1);
      pg.entries = entries;
    } else {
      entry.fields.set("opuuid", pguuid);
      entry.fields.set("deleted", true);
      db.move(entry, db.getGroup(rbuuid));
    }
  });

  const ab = await db.save();

  save(cred, Buffer.from(ab));

  const content = await getGroupContent(cred);

  resp.json(content);
};

const removeGroup = async (req, resp) => {
  const qr = req.query;
  const cred = { pwd_token: qr.pwd_token, db: qr.db, uname: qr.uname };
  const $location = JSON.parse(qr.$location);

  const db = await getDbObject(cred);

  let recycleBin = db.getGroup(db.meta.recycleBinUuid);
  if (!recycleBin) db.createRecycleBin();

  const rb = db.getGroup(db.meta.recycleBinUuid);

  $location.map(($l) => {
    /**
     * @type {{object: [KdbxGroup], lastKey: Number}}
     */

    const { object, lastKey } = deepKey($l, [db], true);

    const gp = object[lastKey];

    const n = gp.name.split("__opuuid__");

    if (n.length === 2) {
      const groups = [...object];
      groups.splice(Number(lastKey), 1);
      rb.groups = groups;
    } else {
      gp.name = `${gp.name}__opuuid__${gp.parentGroup.uuid.toString()}`;

      db.move(gp, rb);
    }
  });

  const ab = await db.save();

  save(cred, Buffer.from(ab));

  const content = await getGroupContent(cred);

  resp.json(content);
};

const emptyRB = async (req, resp) => {
  const qr = req.query;
  const cred = { pwd_token: qr.pwd_token, db: qr.db, uname: qr.uname };

  const db = await getDbObject(cred);

  let recycleBin = db.getGroup(db.meta.recycleBinUuid);
  if (!recycleBin) db.createRecycleBin();

  const rb = db.getGroup(db.meta.recycleBinUuid);

  rb.entries = [];
  rb.groups = [];

  const ab = await db.save();

  save(cred, Buffer.from(ab));

  const content = await getGroupContent(cred);

  resp.json(content);
};

module.exports = {
  removeEntry,
  removeGroup,
  emptyRB,
};
