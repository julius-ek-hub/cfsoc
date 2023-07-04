const Alert = require("../models/alerts");

const getAlerts = async (filter = {}, select = "", updateReceive = true) => {
  return await Alert.find(filter).select(select).lean();
};

const updateAlert = async (_id, update) => {
  const doc = await Alert.findByIdAndUpdate(
    _id,
    { $set: update },
    { new: true }
  );
  return doc;
};

const saveAlert = async ($new) => {
  const ass = new Alert($new);
  await ass.save();
  return ass;
};

const deleteAlert = async (_id) => {
  return await Alert.findByIdAndDelete(_id);
};

module.exports = {
  getAlerts,
  updateAlert,
  deleteAlert,
  saveAlert,
};
