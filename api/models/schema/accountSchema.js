const mongoose = require('mongoose');
const accountSchema = mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      required: true,
      match: [/^[a-zA-Z0-9_]+$/, 'is invalid'],
      index: true
    },
    day: {
      type: Number,
      required: true
    },
  },
  { timestamps: true }
);

const Account = mongoose.models.Account || mongoose.model('Account', accountSchema);

module.exports = Account;
