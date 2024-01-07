const { entr_, _entr } = require("../utils/common");

const mongoose = require("mongoose");

const conn = mongoose.connection.useDb("local").collection("cfsoc_logs");

const fixPayLoad = (pl = {}) => {
  return entr_(
    _entr(pl)
      .filter(([k]) => !["pwd_token", "password", "pass"].includes(k))
      .map(([k, v]) => {
        if (typeof v === "object") return [k, fixPayLoad(v)];
        return [k, v];
      })
  );
};

module.exports = (log, req = {}) => {
  return conn.insertOne(
    fixPayLoad({
      timestamp: new Date().toISOString(),
      payload: { ...req.body, ...req.query },
      source: req.baseUrl,
      ...log,
      origin: req.headers["origin"],
      "sec-ch-ua-platform": req.headers["sec-ch-ua-platform"],
      "user-agent": req.headers["user-agent"],
    })
  );
};
