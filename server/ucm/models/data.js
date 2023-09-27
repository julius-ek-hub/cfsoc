const mongoose = require("mongoose");

const baseSchema = (rest) =>
  new mongoose.Schema({
    id: String,
    name: String,
    description: String,
    ...rest,
  });

const mitreSchema = baseSchema({
  mitre_tactic_url: String,
  techniques: [
    baseSchema({
      mitre_technique_url: String,
      data_source: String,
      data_source_number: String,
      data_source_available: String,
      number_of_sub_techniques: String,
      detection_rules_for_technique: String,
      detection_rules_for_sub_technique: String,
      minimum_detection_rules: String,
      detection_rules_modifier: String,
      expected_detection_rules: String,
      detection_rules: String,
      coverage: String,
      technique_status: String,
      notes: String,
      id_check: String,
      errors_check: String,
      sub_techniques: [
        baseSchema({
          mitre_sub_technique_url: String,
        }),
      ],
    }),
  ],
});

mitreSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("mitre", mitreSchema);
