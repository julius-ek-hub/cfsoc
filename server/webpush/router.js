const { subscribe: sb } = require("./db");

const subscribe = async (req, res) => {
  res.json(await sb(req.body, req.query.device));
};

module.exports = {
  subscribe,
};
