const {
  getAccount: ga,
  enableNotify: en,
  subscribeForPush: sfp,
  updateNotify: un,
} = require("../db/accounts");

const getAccount = async (req, res) => {
  const notify = await ga(req.query.username);
  res.json(notify);
};
const enableNotify = async (req, res) => {
  const updated = await en(req.body);
  res.json(updated);
};
const updateNotify = async (req, res) => {
  const updated = await un(req.body);
  res.json(updated);
};
const subscribeForPush = async (req, res) => {
  const updated = await sfp({ subscription: req.body, ...req.query });
  res.json(updated);
};

module.exports = {
  getAccount,
  enableNotify,
  subscribeForPush,
  updateNotify,
};
