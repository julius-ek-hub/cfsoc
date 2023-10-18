const mongoose = require("mongoose");
const { structure } = require("../utils");

const overRide = async (body) => {
  const db = mongoose.connection.useDb("expo-sentinel");

  const collections = ["l2_uc", "l3_uc", "l4_uc", "car_uc", "dev_uc"];

  await Promise.all(
    collections.map((collection) => db.collection(collection).drop())
  );

  await Promise.all(
    collections.map((collection) =>
      db.collection(collection).insertMany(structure(body[collection]))
    )
  );
  return body;
};

module.exports = {
  overRide,
};
