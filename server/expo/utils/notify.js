const webpush = require("web-push");
const db = require("../../mware/db");
const { sleep, env } = require("../../utils/common");
const { getAlerts, updateAlert } = require("../db/alerts");
const Account = require("../models/accounts");
const sendEmailNotifications = require("./mail");

const sendNotification = async (alert) => {
  webpush.setVapidDetails(
    "mailto:test@test.com",
    env("PUBLIC_VAPID_KEY"),
    env("PRIVATE_VAPID_KEY")
  );

  const acc = await Account.find({ enabled_notifications: "push" }).select(
    "push_notification"
  );

  const push_notification = acc
    .map((ac) => ac.push_notification)
    .filter((pn) => pn.length > 0)
    .flat()
    .filter((pn) => pn.active);

  const devices = [];

  await Promise.allSettled(
    push_notification.map(async (pn) => {
      if (!devices.includes(pn.device)) {
        const payload = JSON.stringify({
          title: "Splunk Alert - " + alert.urgency,
          body: alert.title,
        });

        await webpush.sendNotification(pn, payload).catch(async (e) => {});
        devices.push(pn.device);
      }
    })
  );
};

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
    await sleep(10000);
    checkUnacknowledgedAlerts();
  });
};

module.exports = { checkUnacknowledgedAlerts, sendNotification };
