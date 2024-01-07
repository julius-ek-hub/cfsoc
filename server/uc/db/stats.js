const mongoose = require("mongoose");
const { _keys, arrMust, u_arr, entr_ } = require("../../utils/common");

const db = mongoose.connection.useDb("ucm");

const getDoc = async (key, filter = {}) => {
  const docs = await db.collection(key).find(filter).toArray();
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

const stats = async (body) => {
  //   const l1_uc = await db.collection("l1_uc").find().toArray();
  //   const l2_uc = await db.collection("l2_uc").find().toArray();
  //   const l3_uc = await db.collection("l3_uc").find().toArray();
  //   const l4_uc = await db.collection("l4_uc").find().toArray();
  //   const l1l2n = Object.fromEntries(
  //     l2_uc.map(({ identifier }) => {
  //       const l1 = l1_uc.find((l1) =>
  //         l1.l2_uc_identifiers.value.includes(identifier.value)
  //       );
  //       return [
  //         identifier.value,
  //         {
  //           name: `${l1?.name?.value || ""} (${l1?.identifier?.value || ""})`,
  //           id: l1?.identifier?.value,
  //         },
  //       ];
  //     })
  //   );
  //   const l1_update = l1_uc.map((uc) => ({
  //     ...uc,
  //     l2_uc_names: {
  //       value: getNames(l2_uc, arrMust(uc.l2_uc_identifiers?.value || [])),
  //     },
  //   }));
  //   const l2_update = l2_uc.map((uc) => {
  //     const l1 = l1l2n[uc.identifier.value];
  //     return {
  //       ...uc,
  //       l1_uc_names: { value: l1.name },
  //       l1_uc_identifiers: { value: l1.id ? [l1.id] : [] },
  //       url: { value: `https://attack.mitre.org/tactics/${uc.identifier.value}` },
  //     };
  //   });
  //   const l3_update = l3_uc.map((uc) => {
  //     return {
  //       ...uc,
  //       l2_uc_names: {
  //         value: getNames(l2_uc, arrMust(uc.l2_uc_identifiers?.value || [])),
  //       },
  //       l1_uc_names: {
  //         value: u_arr(
  //           arrMust(uc.l2_uc_identifiers?.value || []).map((v) => l1l2n[v].name)
  //         ).join(", "),
  //       },
  //       l1_uc_identifiers: {
  //         value: u_arr(
  //           arrMust(uc.l2_uc_identifiers?.value || []).map((v) => l1l2n[v].id)
  //         ).flat(),
  //       },
  //       url: {
  //         value: `https://attack.mitre.org/techniques/${uc.identifier.value}`,
  //       },
  //     };
  //   });
  //   const l4_update = l4_uc.map((uc) => ({
  //     ...uc,
  //     l1_uc_names: {
  //       value: u_arr(
  //         arrMust(uc.l2_uc_identifiers?.value || []).map((v) => l1l2n[v].name)
  //       ).join(", "),
  //     },
  //     l1_uc_identifiers: {
  //       value: u_arr(
  //         arrMust(uc.l2_uc_identifiers?.value || []).map((v) => l1l2n[v].id)
  //       ).flat(),
  //     },
  //     l2_uc_names: {
  //       value: getNames(l2_uc, arrMust(uc.l2_uc_identifiers?.value || [])),
  //     },
  //     l3_uc_names: {
  //       value: getNames(l3_uc, arrMust(uc.l3_uc_identifiers?.value || [])),
  //     },
  //     url: {
  //       value: `https://attack.mitre.org/techniques/${uc.identifier.value
  //         .split(".")
  //         .join("/")}`,
  //     },
  //   }));
  //   await db.collection("l1_uc").drop();
  //   await db.collection("l1_uc").insertMany(l1_update);
  //   await db.collection("l2_uc").drop();
  //   await db.collection("l2_uc").insertMany(l2_update);
  //   await db.collection("l3_uc").drop();
  //   await db.collection("l3_uc").insertMany(l3_update);
  //   await db.collection("l4_uc").drop();
  //   await db.collection("l4_uc").insertMany(l4_update);
  //   await Promise.all(
  //     ["l1", "l2", "l3", "l4"].map(async (l) => {
  //       await db.collection(`${l}_uc`).updateMany(
  //         {},
  //         {
  //           $unset: {
  //             effectiveness: "",
  //             coverage: "",
  //             external_regulator_2: "",
  //             external_regulator_1: "",
  //             internal_policy: "",
  //             business_drivers: "",
  //             comments: "",
  //             scope: "",
  //           },
  //         }
  //       );
  //     })
  //   );
  //   const sheets = await db.collection("sheets").find().toArray();
  //   await Promise.all(
  //     sheets.map(async (sheet) => {
  //       await db.collection("sheets").updateOne(
  //         { key: sheet.key },
  //         {
  //           $unset: {
  //             filter: "",
  //             filters: "",
  //             pagination: "",
  //             num_rows: "",
  //             locked: "",
  //             ordered: "",
  //             user_added: "",
  //             location: "",
  //             ...entr_(
  //               _keys(sheet.columns).map((k) => [`columns.${k}.unique`, ""])
  //             ),
  //             ...entr_(
  //               _keys(sheet.columns).map((k) => [`columns.${k}.calculate`, ""])
  //             ),
  //             ...entr_(_keys(sheet.columns).map((k) => [`columns.${k}.sx`, ""])),
  //           },
  //           $set: {
  //             position: sheet.location,
  //           },
  //         }
  //       );
  //     })
  //   );
};

module.exports = {
  stats,
};
