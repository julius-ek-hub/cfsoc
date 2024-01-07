// const mongoose = require("mongoose");
// const { _keys, arrMust, u_arr } = require("../../utils/common");

// const db = mongoose.connection.useDb("ucm");

// const getDoc = async (key, filter = {}) => {
//   const docs = await db.collection(key).find(filter).toArray();
//   return docs.map((doc) => ({
//     ...doc,
//     _id: { value: doc._id },
//   }));
// };

// const getNames = (content, check) =>
//   u_arr(
//     content
//       .filter((l) => check.includes(l.identifier.value))
//       .map((l) => `${l.name.value} (${l.identifier.value})`)
//   ).join(", ");

// const overRide = async (body) => {
//   const l1_uc = await getDoc("l1_uc");
//   const l2_uc = await getDoc("l2_uc");
//   const l3_uc = await getDoc("l3_uc");
//   const l4_uc = await getDoc("l4_uc");

//   const auc = await db.collection("all_uc").find().toArray();

//   const auc_ = auc.map((uc, i) => {
//     const l1_ids = arrMust(uc.l1_uc_identifiers?.value || []);
//     const l2_ids = arrMust(uc.l2_uc_identifiers?.value || []);
//     const l3_ids = arrMust(uc.l3_uc_identifiers?.value || []);
//     const l4_ids = arrMust(uc.l4_uc_identifiers?.value || []);

//     const l1_names = getNames(l1_uc, l1_ids);
//     const l2_names = getNames(l2_uc, l2_ids);
//     const l3_names = getNames(l3_uc, l3_ids);
//     const l4_names = getNames(l4_uc, l4_ids);

//     return {
//       ...uc,
//       l1_uc_names: { value: l1_names },
//       l2_uc_names: { value: l2_names },
//       l3_uc_names: { value: l3_names },
//       l4_uc_names: { value: l4_names },
//     };
//   });
//   await db.collection("all_uc").drop();
//   await db.collection("all_uc").insertMany(auc_);
// };

// module.exports = {
//   overRide,
// };
