const webpush = require("web-push");
const Push = require("./model");
const { env } = require("../utils/common");

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
  webpush.setVapidDetails(
    "mailto:test@test.com",
    env("PUBLIC_VAPID_KEY"),
    env("PRIVATE_VAPID_KEY")
  );

  const subscriptions = await Push.find().select(
    "-_id -__v -keys._id -keys.__v"
  );

  await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      const payload = JSON.stringify({
        title: "Splunk Alert - " + alert.urgency,
        body: alert.title,
      });

      await webpush.sendNotification(subscription, payload).catch(async (e) => {
        // console.log(e);
        await Push.findOneAndDelete({ endpoint: subscription.endpoint });
      });
    })
  );
};

module.exports = { subscribe, sendNotification };
