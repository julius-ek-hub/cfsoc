const Status = require("../models/statuses");

const getStatus = async () => await Status.find().select("-__v -_id").lean();

const saveStatus = async ($new) => {
  if (Array.isArray($new)) {
    const res = await Status.insertMany($new);
    return res;
  }
  const exists = await Status.findOne({ name: $new.name });
  if (exists) return { error: "Status Exists" };
  const s = new Status($new);
  await s.save();
  return s;
};

const updateStatus = async (filter, update) => {
  const $new = await Status.findOneAndUpdate(
    filter,
    { $set: update },
    { new: true }
  );
  return $new;
};

module.exports = { getStatus, saveStatus, updateStatus };
