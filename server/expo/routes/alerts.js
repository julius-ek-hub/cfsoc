const {
  getAlerts: ga,
  saveAlert: sa,
  deleteAlert: da,
  updateAlert: ua,
} = require("../db/alerts");
const { sendNotification } = require("../../webpush/db");

const getAlerts = async (req, res) => {
  const alerts = await ga();
  res.json(alerts);
};

const getUnreceivedAlerts = async (req, res) => {
  const alerts = await ga({ received: false });
  await Promise.all(
    alerts.map(async ({ _id }) => await ua(_id, { received: true }))
  );
  res.json(alerts);
};

const saveAlert = async (req, res) => {
  const add = await sa(req.body);
  await sendNotification(add);
  res.json(add);
};

const updateAlert = async (req, res) => {
  const { _id, update } = req.body;
  const add = await ua(_id, update);
  res.json(add);
};

const deleteAlert = async (req, res) => {
  const deleted = await da(req.body_id);
  res.json({ ...deleted });
};

module.exports = {
  saveAlert,
  getAlerts,
  deleteAlert,
  updateAlert,
  getUnreceivedAlerts,
};
