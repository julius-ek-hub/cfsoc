const mongoose = require("mongoose");

const schema = (obj) => new mongoose.Schema(obj);
const schedulesSchema = schema({
  from: String,
  to: String,
  locked: Boolean,
  suggestions: {
    type: Object,
    of: schema({
      assiduity: [
        schema({
          staff: String,
          dates: [
            schema({
              status: {
                type: String,
                enum: ["off", "sick", "vacation", "holiday", "work", "absent"],
              },
              shift: schema({ from: Number, to: Number }),
              date: String,
              comments: { type: Map, of: String },
            }),
          ],
        }),
      ],
      votes: [{ type: String }],
      generated_on: Date,
      approved: Boolean,
    }),
  },
});

schedulesSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("schedule", schedulesSchema);
