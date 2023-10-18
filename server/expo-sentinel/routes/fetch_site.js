const https = require("https");

module.exports = async (req, res) => {
  const { path, hostname } = req.query;

  https
    .get({ path, port: 443, hostname }, (resp) => {
      let data = "";

      resp.on("data", (chunk) => (data += chunk));

      resp.on("end", () => res.json({ data }));
    })
    .on("error", (err) => {
      res.json({ error: err.message });
    });
};
