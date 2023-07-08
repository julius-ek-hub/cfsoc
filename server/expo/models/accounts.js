const mongoose = require("mongoose");

const accountsSchema = new mongoose.Schema({
  username: String,
  email: String,
  enabled_notifications: [String],
  emails_sms: [
    new mongoose.Schema({
      type: String,
      contact: String,
      active: Boolean,
      fixed: Boolean,
    }),
  ],
  push_notification: [
    new mongoose.Schema({
      endpoint: String,
      expirationTime: Date,
      device: String,
      active: Boolean,
      keys: new mongoose.Schema({
        p256dh: String,
        auth: String,
      }),
    }),
  ],
});

accountsSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("splunk_webhook_account", accountsSchema);
