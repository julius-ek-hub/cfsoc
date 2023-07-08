const {
  getAlerts: ga,
  saveAlert: sa,
  updateAlert: ua,
  Alert,
} = require("../db/alerts");

const { sendNotification } = require("../utils/notify");

const getAlerts = async (req, res) => {
  const alerts = await ga();
  res.json(alerts);
};

const getUnreceivedAlerts = async (req, res) => {
  const { device } = req.query;
  const alerts = await ga({ received: { $ne: device } });
  await Promise.all(
    alerts.map(
      async ({ _id }) =>
        await Alert.findByIdAndUpdate(_id, { $push: { received: device } })
    )
  );
  res.json(alerts);
};

const saveAlert = async (req, res) => {
  const add = await sa(req.body);
  await sendNotification(add);
  res.json(add);
};

const updateAlert = async (req, res) => {
  const { _ids, update } = req.body;
  const change = await Promise.allSettled(
    _ids.map(async (_id) => {
      return await ua(_id, update);
    })
  );
  res.json(change.map((c) => c.value));
};

module.exports = {
  saveAlert,
  getAlerts,
  updateAlert,
  getUnreceivedAlerts,
};
