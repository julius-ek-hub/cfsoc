const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const db = mongoose.connection.useDb("expo-sentinel");

const getSheets = async (filter, staff, by) => {
  const _by = JSON.parse(by || "[]");
  const sheets = await db.collection("sheets").find(filter).toArray();
  return sheets.filter((sheet) => {
    if (
      (sheet.key !== "welcome" && staff === "guest") ||
      (_by.length > 0 &&
        sheet.creator !== "system" &&
        !_by.includes(sheet.creator))
    )
      return false;
    const perm = (sheet.permissions || {})[staff] || ["read"];
    return perm.includes("read") || sheet.creator === staff;
  });
};

const updateSheet = async ({ key, update }) => {
  await db.collection("sheets").findOneAndUpdate({ key }, { $set: update });
  return { key, update };
};

const updateSheetLocation = async (sheets) => {
  await Promise.all(
    sheets.map(async ({ key, location }) =>
      db.collection("sheets").updateOne({ key }, { $set: { location } })
    )
  );
  return sheets;
};
const updateStructure = async (sheets, query) => {
  await Promise.all(
    sheets.map(async ([sheet, update]) => {
      await db.collection("sheets").updateOne({ key: sheet }, { $set: update });
      const dc = query[`delete_column_${sheet}`];
      const ac = query[`add_column_${sheet}`];
      if (dc) {
        if (Object.keys(update.columns).length === 0)
          await db.collection(sheet).drop();
        else
          await db.collection(sheet).updateMany({}, { $unset: { [dc]: "" } });
      }
      if (ac) {
        await db
          .collection(sheet)
          .updateMany(
            {},
            { $set: { [ac]: { value: update.columns[ac].default_value } } }
          );
      }
    })
  );
  return {};
};

const deleteSheet = async (key) => {
  await db.collection(key).drop();
  await db.collection("sheets").findOneAndDelete({ key });
  const _link = path.join(
    ...__dirname.split(path.sep).reverse().slice(2).reverse(),
    "view",
    "sheet_images",
    key
  );
  if (fs.existsSync(_link)) fs.rmSync(_link, { recursive: true });
  return { key };
};

const newSheet = async ($new, creator) => {
  const sheets = Array.isArray($new) ? $new : [$new];
  const _sheets = await getSheets();
  return Promise.all(
    sheets.map(async (name, index) => {
      const key = name.toLowerCase().split(/[ -]/).join("_");
      let max = _sheets.map((sh, i) => {
        const last_num = sh.key.split("_").at(-1);
        return Number(isNaN(last_num) ? i : last_num);
      });

      if (max.length === 0) max = [0];
      const _newLoc = Math.max(...max) + index;
      const exist = _sheets.find((sh) => sh.key === key);
      if (exist) return { error: `Sheet ${name} already exists.` };
      await db.collection("sheets").insertOne({
        key,
        name,
        location: _newLoc,
        pagination: {},
        columns: {},
        user_added: true,
        num_rows: 0,
        creator,
        date_created: new Date().toUTCString(),
      });
      return { key, name };
    })
  );
};

module.exports = {
  getSheets,
  newSheet,
  updateSheet,
  deleteSheet,
  updateSheetLocation,
  updateStructure,
};
