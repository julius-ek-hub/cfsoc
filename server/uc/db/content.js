const mongoose = require("mongoose");
const { fixObject, structure } = require("../utils");
const { _l, _entr, u_arr, escapeRegEx } = require("../../utils/common");

const db = mongoose.connection.useDb("ucm");

const getDoc = async (key) => {
  const docs = await db.collection(key).find().toArray();
  return docs.map((doc) => ({
    ...doc,
    _id: { value: doc._id },
  }));
};

const getNames = (content, check) =>
  u_arr(
    content
      .filter((l) => check.includes(l.identifier.value))
      .map((l) => `${l.name.value} (${l.identifier.value})`)
  ).join(", ");

const getUC = async (ucf, l) => {
  const all = await getDoc("all_uc");

  return all
    .map((uc) => {
      const l1n = getNames(l.l1_uc, uc.l1_uc_identifiers.value);
      const l2n = getNames(l.l2_uc, uc.l2_uc_identifiers.value);
      const l3n = getNames(l.l3_uc, uc.l3_uc_identifiers.value);
      const l4n = getNames(l.l4_uc, uc.l4_uc_identifiers.value);
      return {
        ...uc,
        l1_uc_names: { value: l1n },
        l2_uc_names: { value: l2n },
        l3_uc_names: { value: l3n },
        l4_uc_names: { value: l4n },
      };
    })
    .filter((uc) => {
      let c1, c2, c3, c4;
      if (!ucf.source || ucf.source?.length === 0) c1 = true;
      else c1 = ucf.source.some((ms) => _l(uc.source?.value || "") === _l(ms));
      if (!ucf.customer || ucf.customer?.length === 0) c2 = true;
      else
        c2 = ucf.customer.some((mc) => _l(uc.customer?.value || "") === _l(mc));
      if (!ucf.technology || ucf.technology?.length === 0) c4 = true;
      else
        c4 = ucf.technology.some(
          (mt) => _l(uc.technology?.value || "") === _l(mt)
        );

      if (!ucf.uc_search || ucf.uc_search?.length === 0) c3 = true;
      else {
        c3 = _entr(uc)
          .filter(([k]) => k !== "_id")
          .some((_c) =>
            new RegExp(escapeRegEx(ucf.uc_search.join("")), "i").test(
              String(_c[1].value || "")
            )
          );
      }

      return c1 && c2 && c3 && c4;
    });
};

const getFilters = () => db.collection("uc_filter").find().toArray();

const getUCTable = async (filter) => {
  const l1_uc = await getDoc("l1_uc");
  const l2_uc = await getDoc("l2_uc");
  const l3_uc = await getDoc("l3_uc");
  const l4_uc = await getDoc("l4_uc");
  const all_uc = await getUC(filter, { l1_uc, l2_uc, l3_uc, l4_uc });

  const l1l2n = Object.fromEntries(
    l2_uc.map(({ identifier }) => {
      const l1 = l1_uc.find((l1) =>
        l1.l2_uc_identifiers.value.includes(identifier.value)
      );
      return [
        identifier.value,
        `${l1?.name?.value || ""} (${l1?.identifier?.value || ""})`,
      ];
    })
  );

  const l4s = l4_uc.map((l4) => {
    const uc = all_uc.filter((uc) =>
      uc.l4_uc_identifiers.value.includes(l4.identifier.value)
    );
    return {
      ...l4,
      uc,
      uc_count: { value: uc.length },
      l1_uc_names: {
        value: u_arr(l4.l2_uc_identifiers.value.map((v) => l1l2n[v])).join(
          ", "
        ),
      },
      l2_uc_names: { value: getNames(l2_uc, l4.l2_uc_identifiers.value) },
      l3_uc_names: { value: getNames(l3_uc, l4.l3_uc_identifiers.value) },
      url: {
        value: `https://attack.mitre.org/techniques/${l4.identifier.value
          .split(".")
          .join("/")}`,
      },
    };
  });

  const l3s = l3_uc.map((l3) => {
    const _l4s = l4s.filter((l4) =>
      l4.l3_uc_identifiers.value.includes(l3.identifier.value)
    );
    let l4_uc_related = 0;
    const uc = all_uc.filter((uc) => {
      if (uc.l3_uc_identifiers.value.includes(l3.identifier.value)) {
        if (uc.l4_uc_identifiers.value.length > 0) l4_uc_related += 1;
        return true;
      }
    });
    return {
      ...l3,
      uc,
      l4s: _l4s,
      l4_uc_related: { value: l4_uc_related },
      l2_uc_names: { value: getNames(l2_uc, l3.l2_uc_identifiers.value) },
      l1_uc_names: {
        value: u_arr(l3.l2_uc_identifiers.value.map((v) => l1l2n[v])).join(
          ", "
        ),
      },
      uc_count: { value: uc.length },
      url: {
        value: `https://attack.mitre.org/techniques/${l3.identifier.value}`,
      },
    };
  });

  const l2s = l2_uc.map((l2) => {
    const _l3s = l3s.filter((l3) =>
      l3.l2_uc_identifiers.value.includes(l2.identifier.value)
    );
    let l3_uc_related = 0;
    let l4_uc_related = 0;
    const uc = all_uc.filter((uc) => {
      if (uc.l2_uc_identifiers.value.includes(l2.identifier.value)) {
        if (uc.l3_uc_identifiers.value.length > 0) l3_uc_related += 1;
        if (uc.l4_uc_identifiers.value.length > 0) l4_uc_related += 1;
        return true;
      }
      return false;
    });
    return {
      ...l2,
      uc,
      l3s: _l3s,
      l1_uc_names: { value: l1l2n[l2.identifier.value] },
      l3_uc_related: { value: l3_uc_related },
      l4_uc_related: { value: l4_uc_related },
      uc_count: { value: uc.length },
      url: { value: `https://attack.mitre.org/tactics/${l2.identifier.value}` },
    };
  });

  return {
    l1_uc: l1_uc.map((l1) => {
      const _l2s = l2s.filter((l2) =>
        l1.l2_uc_identifiers.value.includes(l2.identifier.value)
      );
      let l2_uc_related = 0;
      let l3_uc_related = 0;
      let l4_uc_related = 0;
      let uc = all_uc.filter((uc) => {
        if (uc.l1_uc_identifiers.value.includes(l1.identifier.value)) {
          if (uc.l2_uc_identifiers.value.length > 0) l2_uc_related += 1;
          if (uc.l3_uc_identifiers.value.length > 0) l3_uc_related += 1;
          if (uc.l4_uc_identifiers.value.length > 0) l4_uc_related += 1;
          return true;
        }
        return false;
      });

      return {
        ...l1,
        uc,
        uc_count: { value: uc.length },
        l2s: _l2s,
        l2_uc_names: { value: getNames(l2_uc, l1.l2_uc_identifiers.value) },
        l2_uc_related: { value: l2_uc_related },
        l3_uc_related: { value: l3_uc_related },
        l4_uc_related: { value: l4_uc_related },
      };
    }),
    all_uc,
    l2_uc: l2s,
    l3_uc: l3s,
    l4_uc: l4s,
  };
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
  const sheet = db.collection(query.sheet);
  const _id = new mongoose.Types.ObjectId(query._id);

  return sheet.findOneAndDelete({ _id });
};

const addContent = async (content) => {
  const col = db.collection("all_uc");
  let data = fixObject(structure(content))[0];
  const id = data.identifier.value;

  const exist = await col.findOne({ "identifier.value": id });
  if (exist) return { error: `Use Case with identifier ${id} exists` };

  const d = await col.insertOne(data);

  return { ...data, _id: { value: d.insertedId } };
};

const addFilter = async (filter) => {
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
const removeFilter = async (filter) =>
  db
    .collection("uc_filter")
    .findOneAndUpdate(
      { key: filter.key },
      { $pull: { options: filter.value } }
    );

module.exports = {
  addContent,
  editContent,
  deleteContent,
  getFilters,
  getUCTable,
  addFilter,
  removeFilter,
};
