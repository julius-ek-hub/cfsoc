const mongoose = require("mongoose");
const { fixObject, structure } = require("../utils");
const { updateSheet } = require("./sheets");
const fs = require("fs");
const path = require("path");

const db = mongoose.connection.useDb("expo-sentinel");

const getContent = async (collection, filter = {}, page) => {
  const col = db.collection(collection);
  let docs;
  if (page) {
    docs = await col
      .find(filter)
      .skip(5000 * (Number(page) - 1))
      .limit(5000)
      .toArray();
  } else docs = await col.find(filter).toArray();
  return docs.map((doc) => ({
    ...doc,
    _id: { value: doc._id },
  }));
};

const editContent = (collection, body) => {
  return db
    .collection(collection)
    .updateOne(
      { _id: new mongoose.Types.ObjectId(body._id) },
      { $set: body.update }
    );
};

const deleteContent = async (query) => {
  const _sheet = query.sheet;
  const sheet = db.collection(_sheet);
  const _id = new mongoose.Types.ObjectId(query._id);
  const target = await sheet.findOne({ _id });

  if (!target) return {};

  await sheet.findOneAndDelete({ _id });

  Object.values(target)
    .filter((v) => v.image)
    .map((v) => {
      const _link = path.join(
        ...__dirname.split(path.sep).reverse().slice(2).reverse(),
        "view",
        "sheet_images",
        _sheet,
        v.image
      );
      if (fs.existsSync(_link)) fs.unlinkSync(_link);
    });

  await db
    .collection("sheets")
    .findOneAndUpdate({ key: _sheet }, { $inc: { num_rows: -1 } });

  const to_arr = (col, filter) => db.collection(col).find(filter).toArray();
  const update = (col, ...arg) => db.collection(col).findOneAndUpdate(...arg);

  const target_id = target?.identifier?.value;

  let l3_for_delete = [];
  let l1_for_delete = [];
  let l4_for_delete = [];

  if (_sheet === "l2_uc") {
    const l3s = await to_arr("l3_uc", { "l2_uc_identifiers.value": target_id });
    const l1s = await to_arr("l1_uc", { "l2_uc_identifiers.value": target_id });

    await Promise.all(
      l3s.map(async (l3) => {
        const l2s = l3.l2_uc_identifiers.value.filter((l2) => l2 !== target_id);
        if (l2s.length === 0) {
          l3_for_delete.push([l3.identifier.value, l3._id]);
        } else {
          await update(
            "l3_uc",
            { _id: l3._id },
            { $set: { "l2_uc_identifiers.value": l2s } }
          );
        }
      })
    );

    await Promise.all(
      l1s.map(async (l1) => {
        const l2s = l1.l2_uc_identifiers.value.filter((l2) => l2 !== target_id);
        if (l2s.length === 0) {
          l1_for_delete.push(l1._id);
        } else {
          await update(
            "l1_uc",
            { _id: l1._id },
            { $set: { "l2_uc_identifiers.value": l2s } }
          );
        }
      })
    );
  } else if (_sheet === "l3_uc") {
    let l4s = await to_arr("l4_uc", { "l3_uc_identifier.value": target_id });
    l4_for_delete = [...l4_for_delete, ...l4s.map((l4) => l4._id)];
  }

  await Promise.all(
    l1_for_delete.map((_id) => deleteContent({ _id, sheet: "l1_uc" }))
  );

  await Promise.all(
    l3_for_delete.map(async ([l3, _id]) => {
      await deleteContent({ _id, sheet: "l3_uc" });
      let l4s = await to_arr("l4_uc", { "l3_uc_identifier.value": l3 });
      l4_for_delete = [...l4_for_delete, ...l4s.map((l4) => l4._id)];
    })
  );

  await Promise.all(
    l4_for_delete.map((_id) => deleteContent({ _id, sheet: "l4_uc" }))
  );

  return {};
};

const addContent = async (collection, content, unique_key) => {
  let data = fixObject(structure(content));

  const old_content = await getContent(collection);

  let duplicates = [];
  let warnings = [];
  if (unique_key) {
    const values = data.map((d) => d[unique_key].value);
    const exists = old_content.filter((doc) =>
      values.includes(doc[unique_key].value)
    );
    if (exists.length !== 0) {
      duplicates = exists.map((ex) => ex[unique_key].value);
      data = data.filter((d) => !duplicates.includes(d[unique_key].value));
      warnings.push(
        `The following rows for primary column exist: ${duplicates.join(
          ", "
        )}, and have been ignored`
      );
    }
  }

  if (data.length === 0)
    return {
      data,
      duplicates,
      warnings,
    };

  const { insertedIds } = await db.collection(collection).insertMany(data);

  return {
    data: data.map((d, ind) => ({
      ...d,
      _id: { value: insertedIds[ind].toString() },
    })),
    duplicates,
    warnings,
  };
};

module.exports = {
  getContent,
  addContent,
  editContent,
  deleteContent,
};
