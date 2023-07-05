const mongoose = require("mongoose");

const pushSchema = new mongoose.Schema({
  endpoint: String,
  expirationTime: Date,
  device: String,
  keys: new mongoose.Schema({
    p256dh: String,
    auth: String,
  }),
});

pushSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("push", pushSchema);
