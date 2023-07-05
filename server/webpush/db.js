const webpush = require("web-push");
const Push = require("./model");
const { env } = require("../utils/common");

webpush.setVapidDetails(
  "mailto:test@test.com",
  env("PUBLIC_VAPID_KEY"),
  env("PRIVATE_VAPID_KEY")
);

const subscribe = async (sub, device) => {
  const exist = await Push.findOne({
    device,
  });
  if (exist) {
    await Push.findOneAndUpdate(
      { device },
      {
        $set: { ...sub },
      }
    );
    return sub;
  }
  const push = new Push({ ...sub, device });
  await push.save();
  return push;
};

const sendNotification = async (alert) => {
  const subscriptions = await Push.find().select(
    "-_id -__v -keys._id -keys.__v"
  );
  //   console.log(subscriptions);

  await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      const payload = JSON.stringify({
        title: "Splunk Alert - " + alert.urgency,
        body: alert.title,
      });

      await webpush.sendNotification(subscription, payload).catch(console.log);
    })
  );
};

module.exports = { subscribe, sendNotification };
