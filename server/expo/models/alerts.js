const mongoose = require("mongoose");

const alertsSchema = new mongoose.Schema({
  time: String,
  source_ip: String,
  title: String,
  security_domain: String,
  urgency: String,
  status: String,
  owner: String,
  notified: { type: Boolean, default: false },
  acknowledged: { type: Boolean, default: false },
  received: { type: Boolean, default: false },
});

alertsSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("alert", alertsSchema);