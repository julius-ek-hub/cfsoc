const mongoose = require("mongoose");
const { structure } = require("../utils");
const { getContent } = require("./content");

const overRide = async (body) => {
  const db = mongoose.connection.useDb("ucm");

  const l1_uc = await getContent("l1_uc");
  const l2_uc = await getContent("l2_uc");
  const sigma = await getContent("sheet_8");
  const edge = await getContent("sheet_6");
  const sentinel = await getContent("sheet_7");

  const collections = ["l2_uc", "l3_uc", "l4_uc"];

  await Promise.all(
    collections.map((collection) => db.collection(collection).drop())
  );

  await Promise.all(
    collections.map((collection) =>
      db.collection(collection).insertMany(structure(body[collection]))
    )
  );

  let all = structure(body.car_uc);

  sentinel.map((s) => {
    const identifier = "";
    const name = s.displayname.value;
    const description = "";
    const url = "";
    let l2_uc_name = s.tactics.value;
    l2_uc_name = Array.isArray(l2_uc_name)
      ? l2_uc_name.map((l2) => l2.toLowerCase())
      : [];

    let l3_uc_identifiers = s.techniques.value;
    l3_uc_identifiers = Array.isArray(l3_uc_identifiers)
      ? l3_uc_identifiers
      : [];

    const l4_uc_identifiers = [];
    const l2_uc_identifiers = l2_uc
      .filter((l2) =>
        l2_uc_name.includes(l2.name.value.split(" ").join("").toLowerCase())
      )
      .map((l2) => l2.identifier.value);

    const l1_uc_identifiers = l1_uc
      .filter((l1) =>
        l2_uc_identifiers.some((l2) => l1.l2_uc_identifiers.value.includes(l2))
      )
      .map((l1) => l1.identifier.value);

    all = [
      ...all,
      ...structure({
        identifier,
        name,
        source: "Expo Sentinel",
        source_id: "expo_sentinel_uc",
        description,
        l1_uc_identifiers,
        l2_uc_identifiers,
        l3_uc_identifiers,
        l4_uc_identifiers,
        url,
      }),
    ];
  });

  edge.map((s) => {
    const identifier = "";
    const name = s.usecase.value;
    const description = "";
    const url = "";
    const l2_uc_name = [
      s.tactic.value.toLowerCase().split(" ").join("-"),
    ].filter((v) => v);
    const l3_uc_identifiers = [s.technique.value].filter((v) => v);
    const l4_uc_identifiers = [];
    const l2_uc_identifiers = l2_uc
      .filter((l2) =>
        l2_uc_name.includes(l2.name.value.split(" ").join("-").toLowerCase())
      )
      .map((l2) => l2.identifier.value);

    const l1_uc_identifiers = l1_uc
      .filter((l1) =>
        l2_uc_identifiers.some((l2) => l1.l2_uc_identifiers.value.includes(l2))
      )
      .map((l1) => l1.identifier.value);

    all = [
      ...all,
      ...structure({
        identifier,
        name,
        source: "EDGE",
        source_id: "edge_uc",
        description,
        l1_uc_identifiers,
        l2_uc_identifiers,
        l3_uc_identifiers,
        l4_uc_identifiers,
        url,
      }),
    ];
  });

  sigma.map((s) => {
    const identifier = "";
    const name = s.title.value;
    const description = s.description.value;
    const url = s.url.value;
    const l2_uc_name = s.l2_uc_identifiers.value;
    const l3_uc_identifiers = s.l3_uc_identifiers.value;
    const l4_uc_identifiers = s.l4_uc_identifiers.value;
    const l2_uc_identifiers = l2_uc
      .filter((l2) =>
        l2_uc_name.includes(l2.name.value.split(" ").join("-").toLowerCase())
      )
      .map((l2) => l2.identifier.value);

    const l1_uc_identifiers = l1_uc
      .filter((l1) =>
        l2_uc_identifiers.some((l2) => l1.l2_uc_identifiers.value.includes(l2))
      )
      .map((l1) => l1.identifier.value);

    all = [
      ...all,
      ...structure({
        identifier,
        name,
        source: "Sigma",
        source_id: "sigma_uc",
        description,
        l1_uc_identifiers,
        l2_uc_identifiers,
        l3_uc_identifiers,
        l4_uc_identifiers,
        url,
      }),
    ];
  });

  await Promise.all(
    ["car_uc", "sigma_uc", "expo_sentinel_uc", "edge_uc"].map((sid) =>
      db.collection("all_uc").deleteMany({ "source_id.value": sid })
    )
  );
  await db.collection("all_uc").insertMany(all);

  return body;
};

module.exports = {
  overRide,
};
