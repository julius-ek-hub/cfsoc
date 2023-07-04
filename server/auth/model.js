const mongoose = require("mongoose");

const staffsSchema = new mongoose.Schema({
  name: String,
  position: String,
  level: Number,
  admin: Boolean,
  hash: String,
  username: String,
  email: String,
  no_schedule: Boolean,
});

staffsSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("staff", staffsSchema);
