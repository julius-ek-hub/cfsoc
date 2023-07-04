const Notify = require("../models/notify");

const getNotify = async (filter, select = "") => {
  return await Notify.find(filter, select).select(select).lean();
};

const saveNotify = async (contact) => {
  const $new = new Notify(contact);
  await $new.save();
  return $new;
};

const deleteNotify = async (contact) => {
  return await Notify.deleteMany({ contact });
};
const updateNotify = async (contacts) => {
  const all = await getNotify();

  await Promise.all(
    all.map(async ({ contact }) => {
      return await Notify.findOneAndUpdate(
        { contact },
        {
          $set: {
            active: false,
          },
        }
      );
    })
  );

  await Promise.all(
    contacts.map(async (contact) => {
      return await Notify.findOneAndUpdate(
        { contact },
        {
          $set: {
            active: true,
          },
        }
      );
    })
  );
  return contacts;
};

module.exports = { getNotify, saveNotify, deleteNotify, updateNotify };
