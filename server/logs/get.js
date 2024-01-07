const mongoose = require("mongoose");
const { entr_, _entr, _l, escapeRegEx } = require("../utils/common");

const conn = mongoose.connection.useDb("local").collection("cfsoc_logs");

module.exports = async (req, res) => {
  const now = Date.now();
  const mili = 60 * 60 * 1000;
  const times = {
    "4h": now - 4 * mili,
    "1w": now - 7 * 24 * mili,
    "30d": now - 30 * 24 * mili,
    "24h": now - 24 * mili,
    "1y": now - 365 * 24 * mili,
  };

  let { t, q } = req.query;
  t = t || "";
  q = q || "";

  let $query = "";

  if (times[t]) $query = `new Date(this.timestamp).getTime() >= ${times[t]}`;
  else {
    const d = t.split("_");
    if (d.length === 2) {
      const from = new Date(d[0]);
      const to = new Date(d[1]);
      if (![from, to].some((_d) => _l(_d) === "invalid date")) {
        if (from.getTime() < to.getTime())
          $query = `new Date(this.timestamp).getTime() >= ${from.getTime()} && new Date(this.timestamp).getTime() <= ${to.getTime()}`;
      }
    }
  }

  const logs = await conn.find({ ...($query && { $where: $query }) }).toArray();

  return res.json(
    logs
      .map((l) => {
        return entr_(
          _entr(l).map(([k, v]) => [
            k,
            k === "_id"
              ? v.toString()
              : typeof v !== "string"
              ? JSON.stringify(v)
              : v,
          ])
        );
      })
      .filter((l) =>
        _entr(l)
          .filter(([k]) => k !== "_id")
          .some(([k, v]) => new RegExp(escapeRegEx(q), "i").test(v))
      )
  );
};
