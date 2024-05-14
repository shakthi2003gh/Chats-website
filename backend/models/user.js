const mongoose = require("mongoose");
const { findByEmail } = require("./utilities");

const schema = new mongoose.Schema(
  {
    image: String,
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      minLength: 3,
      maxLength: 40,
    },
    password: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      minLength: 3,
      maxLength: 20,
    },
  },
  { timestamps: true }
);

schema.statics.findByEmail = findByEmail;

exports.User = mongoose.model("User", schema);
