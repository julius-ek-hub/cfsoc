const mongoose = require("mongoose");
const { fixObject, structure } = require("../utils");

const a = require("./content");

const db = mongoose.connection.useDb("expo-sentinel");

const addContent = async (collection, content) => {
  let data = fixObject(structure(content));
  data = data.map((d) => {
    const _d = { ...d };
    const l1 = [_d.l1_uc_identifiers.value.split("-")[0].toUpperCase()];
    return { ..._d, l1_uc_identifiers: { value: l1 } };
  });

  console.log(data);

  return {
    warnings: [],
    data: [],
  };
};

module.exports = {
  addContent,
};
