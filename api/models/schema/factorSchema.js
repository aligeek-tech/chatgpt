const mongoose = require('mongoose');
const factorSchema = mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      required: true,
      match: [/^[a-zA-Z0-9_]+$/, 'is invalid'],
      index: true
    },
    authority: {
      type: String,
      required: true
    },
    amount: {
      type: String,
      required: true
    },
    state: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const Factor = mongoose.models.Factor || mongoose.model('Factor', factorSchema);

module.exports = Factor;
