const mongoose = require("mongoose");
const { send, findByEmail } = require("./utilities");
const { deleteExpiredDoc, checkExpired } = require("./utilities");
const { resendOTP, isRecentlySendOTP } = require("./utilities");

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      minLength: 3,
      maxLength: 40,
    },
    OTP: {
      type: String,
      default: "0000",
    },
    dataToken: String,
  },
  { timestamps: true }
);

schema.statics = { findByEmail, resendOTP };
schema.methods = { checkExpired, isRecentlySendOTP };

schema.pre("save", send);
schema.post("findOne", deleteExpiredDoc);

exports.Register = mongoose.model("Register", schema);
