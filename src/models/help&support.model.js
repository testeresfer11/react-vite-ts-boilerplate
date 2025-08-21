const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      // validate: {
      //   validator: function (v) {
      //     return /^\d{10,12}$/.test(v);
      //   },
      //   message: 'Phone number must be between 10 and 12 digits.'
      // }
    },
    message: {
      type: String,
      required: true,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const HelpNSupport = mongoose.model('HelpNSupport', schema);
module.exports = { HelpNSupport };
