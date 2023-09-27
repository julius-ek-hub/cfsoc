const mongoose = require("mongoose");
const { fixObject, structure } = require("../utils");

const db = mongoose.connection.useDb("ucm");

const getContent = async (collection, filter = {}) => {
  let docs = await db.collection(collection).find(filter).toArray();
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

  const to_arr = (col, filter) => db.collection(col).find(filter).toArray();
  const update = (col, ...arg) => db.collection(col).findOneAndUpdate(...arg);
  const _delete = (col, ...arg) => db.collection(col).findOneAndDelete(...arg);

  const target_id = target.identifier.value;

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
          l3_for_delete.push(l3.identifier.value);
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

  await Promise.all(l1_for_delete.map((_id) => _delete("l1_uc", { _id })));

  await Promise.all(
    l3_for_delete.map(async (l3) => {
      await _delete("l3_uc", { "identifier.value": l3 });
      let l4s = await to_arr("l4_uc", { "l3_uc_identifier.value": l3 });
      l4_for_delete = [...l4_for_delete, ...l4s.map((l4) => l4._id)];
    })
  );

  await Promise.all(l4_for_delete.map((_id) => _delete("l4_uc", { _id })));

  return {};
};

const addContent = async (collection, content, unique_key) => {
  let data = fixObject(structure(content));
  let duplicates = [];
  let warnings = [];
  if (unique_key) {
    const keys = data.map((d) => d[unique_key].value);
    const exists = await getContent(collection, {
      [`${unique_key}.value`]: { $in: keys },
    });
    if (exists.length !== 0) {
      duplicates = exists.map((ex) => ex[unique_key].value);
      data = data.filter((d) => !duplicates.includes(d[unique_key].value));
      warnings.push(
        `The following Use Cases exist: ${duplicates.join(
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
