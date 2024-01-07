const mongoose = require("mongoose");
const { fixObject, structure } = require("../utils");
const { _l, escapeRegEx, _keys } = require("../../utils/common");

const db = mongoose.connection.useDb("ucm");

const getDoc = async (key, filter = {}) => {
  const docs = await db.collection(key).find(filter).limit(20000).toArray();
  return docs.map((doc) => ({
    ...doc,
    _id: { value: doc._id },
  }));
};

const getUC = async (ucf) => {
  const s = escapeRegEx((ucf.uc_search || []).join(""));
  const sheet = await db
    .collection("sheets")
    .findOne({ $where: 'this.key === "all_uc"' });

  if (!sheet) return [];

  const cols = _keys(sheet.columns).map((c) => `"${c}"`);

  const str = (v) => JSON.stringify(v || "");

  const all_low = (arr) => arr.map((s) => `${str(_l(s))}`);

  let $where = "";

  if (s)
    $where = `[${cols.join(", ")}].some((c) => new RegExp(${str(s)}, "i").test(
      String(this[c]?.value || "")
    ))`;

  ["source", "customer", "technology"].map((sct) => {
    if (!(!ucf[sct] || ucf[sct]?.length === 0)) {
      if ($where) $where += " && ";
      $where += `[${all_low(ucf[sct]).join(
        ", "
      )}].some(s => (this["${sct}"]?.value || "").toLowerCase() === s)`;
    }
  });

  return getDoc("all_uc", $where ? { $where } : {});
};

const getFilters = () => db.collection("uc_filter").find().toArray();

const getUCTable = async (filter) => {
  const l1_uc = await getDoc("l1_uc");
  const l2_uc = await getDoc("l2_uc");
  const l3_uc = await getDoc("l3_uc");
  const l4_uc = await getDoc("l4_uc");
  const all_uc = await getUC(filter, { l1_uc, l2_uc, l3_uc, l4_uc });

  return {
    l1_uc,
    all_uc,
    l2_uc,
    l3_uc,
    l4_uc,
  };
};

const editContent = (collection, body) => {
  throw new Error("Operation not allowed for now");
  return db
    .collection(collection)
    .updateOne(
      { _id: new mongoose.Types.ObjectId(body._id) },
      { $set: body.update }
    );
};

const deleteContent = async (query) => {
  throw new Error("Operation not allowed for now");
  const sheet = db.collection(query.sheet);
  const _id = new mongoose.Types.ObjectId(query._id);

  return sheet.findOneAndDelete({ _id });
};

const addContent = async (content) => {
  throw new Error("Operation not allowed for now");
  const col = db.collection("all_uc");
  let data = fixObject(structure(content))[0];
  const id = data.identifier.value;

  const exist = await col.findOne({ "identifier.value": id });
  if (exist) return { error: `Use Case with identifier ${id} exists` };

  const d = await col.insertOne(data);

  return { ...data, _id: { value: d.insertedId } };
};

const addFilter = async (filter) => {
  throw new Error("Operation not allowed for now");
  const col = db.collection("uc_filter");

  const exist = await col.findOne({
    $where: `this.key === '${filter.key}' && this.options.includes('${filter.value}')`,
  });
  if (exist) return { error: `${filter.value} exists` };

  const d = await col.findOneAndUpdate(
    { key: filter.key },
    { $push: { options: filter.value } }
  );

  return d;
};
const removeFilter = async (filter) => {
  throw new Error("Operation not allowed for now");
  return db
    .collection("uc_filter")
    .findOneAndUpdate(
      { key: filter.key },
      { $pull: { options: filter.value } }
    );
};

module.exports = {
  addContent,
  editContent,
  deleteContent,
  getFilters,
  getUCTable,
  addFilter,
  removeFilter,
};
