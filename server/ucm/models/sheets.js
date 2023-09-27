const mongoose = require("mongoose");

const sheetSchema = new mongoose.Schema({
  key: String,
  name: String,
});

sheetSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("mitre_sheet", sheetSchema);
