const mongoose = require("mongoose");

exports.deviceSchema = new mongoose.Schema({
  _id: {
    type: Number,
    minlength: 10,
    maxlength: 10,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  lastUsed: {
    type: Date,
    default: Date.now,
    required: true,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
});
