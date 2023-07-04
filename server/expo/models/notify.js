const mongoose = require("mongoose");

const notifySchema = new mongoose.Schema({
  type: String,
  contact: String,
  active: Boolean,
  fixed: Boolean,
});

notifySchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("notify", notifySchema);
