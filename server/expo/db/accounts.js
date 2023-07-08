const { getStaff } = require("../../auth/db");
const Account = require("../models/accounts");

const getAccount = async (username) => {
  const staffs = await getStaff();
  const infos = Object.values(staffs).map(({ username, email }) => ({
    username,
    email,
  }));

  await Promise.allSettled(
    infos.map(async ({ username, email }) => {
      const exists = await Account.findOne({ username }).lean();
      if (exists) return;
      const $new = new Account({
        username,
        email,
        emails_sms: [
          {
            type: "email",
            contact: email,
            active: true,
          },
        ],
        enabled_notifications: ["sound"],
      });
      await $new.save();
    })
  );

  return await Account.findOne({ username }).lean();
};

const enableNotify = async ({ on, update, username }) => {
  const acc = await Account.findOne({ username });

  const prev_enabled = [...new Set([...acc.enabled_notifications, ...update])];

  return await Account.findOneAndUpdate(
    { username },
    {
      $set: {
        enabled_notifications: on
          ? prev_enabled
          : prev_enabled.filter((pn) => !update.includes(pn)),
      },
    },
    { new: true }
  );
};

const updateNotify = async ({ type, username, value }) => {
  const acc = await Account.findOne({ username });

  if (["email", "sms"].includes(type)) {
    const emails_sms = acc.emails_sms.map((es) => {
      if (es.type === type) es.active = false;
      return es;
    });
    value.map(async (v) => {
      const ind = emails_sms.findIndex(
        (se) => se.type === type && se.contact === v
      );
      if (ind === -1)
        return emails_sms.push({ type, contact: v, active: true });
      emails_sms[ind].active = true;
    });
    return await Account.findOneAndUpdate(
      { username },
      {
        $set: {
          emails_sms,
        },
      },
      { new: true }
    );
  } else {
    const push_notification = acc.push_notification.map((pn) => {
      pn.active = false;
      return pn;
    });
    value.map(async (v) => {
      const ind = push_notification.findIndex((pn) => pn.device === v);
      if (ind !== -1) push_notification[ind].active = true;
    });
    return await Account.findOneAndUpdate(
      { username },
      {
        $set: {
          push_notification,
        },
      },
      { new: true }
    );
  }
};

const subscribeForPush = async ({ device, username, subscription }) => {
  const acc = await Account.findOne({ username });

  const push = acc.push_notification;
  const ind = push.findIndex((p) => p.device === device);
  if (ind === -1)
    return await Account.findOneAndUpdate(
      { username },
      {
        $push: {
          push_notification: { ...subscription, device, active: true },
        },
      },
      { new: true }
    );
  const target = push[ind];
  push.splice(ind, 1, { ...subscription, device, active: target.active });

  return await Account.findOneAndUpdate(
    { username },
    {
      $set: {
        push_notification: push,
      },
    },
    { new: true }
  );
};

module.exports = {
  getAccount,
  enableNotify,
  subscribeForPush,
  updateNotify,
};
