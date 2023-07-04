const db = require("../../mware/db");
const { sleep } = require("../../utils/common");
const { getAlerts, updateAlert } = require("../db/alerts");
const sendEmailNotifications = require("./mail");

const checkUnacknowledgedAlerts = async () => {
  const res = {
    json(r) {},
  };
  db(null, res, async () => {
    const alerts = await getAlerts(
      { acknowledged: false, notified: false },
      "",
      false
    );
    if (alerts.length > 0) {
      await sendEmailNotifications(JSON.stringify(alerts));
      await Promise.allSettled(
        alerts.map(async (alert) => {
          await updateAlert(alert._id, { notified: true });
        })
      );
    }
    await sleep(5000);
    checkUnacknowledgedAlerts();
  });
};

module.exports = checkUnacknowledgedAlerts;
