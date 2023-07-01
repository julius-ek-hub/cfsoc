const mongoose = require("mongoose");

const datesSchema = new mongoose.Schema({
  from: String,
  to: String,
});

const shiftSchema = new mongoose.Schema({
  from: Number,
  to: Number,
  label: String,
});

[datesSchema, shiftSchema].map((sc) => sc.set("toObject", { virtuals: true }));

module.exports = {
  DDate: mongoose.model("date", datesSchema),
  Shift: mongoose.model("shift", shiftSchema),
};
