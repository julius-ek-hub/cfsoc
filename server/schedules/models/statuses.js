const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  name: String,
  color: String,
  label: String,
  description: String,
});

statusSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("status", statusSchema);
