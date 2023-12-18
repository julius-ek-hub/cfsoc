const mongoose = require("mongoose");
const { structure } = require("../utils");

const overRide = async (body) => {
  const db = mongoose.connection.useDb("ucm");

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
  await db.collection("all_uc").insertMany(structure(body.car_uc));

  return body;
};

module.exports = {
  overRide,
};
