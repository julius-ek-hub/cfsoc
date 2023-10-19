const mongoose = require("mongoose");
const { structure, objectExcept } = require("../utils");
const { getContent } = require("./content");

const overRide = async (body) => {
  const db = mongoose.connection.useDb("ucm");

  const l1_uc = await getContent("l1_uc");
  const l2_uc = await getContent("l2_uc");
  const expo_sentinel = await getContent("expo_sentinel_uc");
  const sigma = await getContent("sigma_uc");

  const collections = ["l2_uc", "l3_uc", "l4_uc"];

  await Promise.all(
    collections.map((collection) => db.collection(collection).drop())
  );

  await Promise.all(
    collections.map((collection) =>
      db.collection(collection).insertMany(structure(body[collection]))
    )
  );
  await db.collection("all_uc").deleteMany({ "source_id.value": "car_uc" });

  const all = structure(body.car_uc);

  await db.collection("all_uc").insertMany(all);

  return body;
};

module.exports = {
  overRide,
};
