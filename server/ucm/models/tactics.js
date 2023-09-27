const mongoose = require("mongoose");

const baseSchema = (rest) =>
  new mongoose.Schema({
    id: String,
    name: String,
    description: String,
    ...rest,
  });

const mitreTacticsSchema = baseSchema({
  mitre_url: String,
  techniques: [
    baseSchema({
      mitre_url: String,
      sub_techniques: [
        baseSchema({
          mitre_url: String,
        }),
      ],
    }),
  ],
});

mitreTacticsSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("mitre_tactic", mitreTacticsSchema);
