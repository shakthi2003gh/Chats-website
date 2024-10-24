const mongoose = require("mongoose");
const { findByEmail, findByIdWithFriends } = require("./utilities");
const { generateAuthToken, getLoginData, addDevice } = require("./utilities");
const { deviceSchema } = require("./device");

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
      maxLength: 500,
      default: "Hey there! I am using Chats",
    },
    personalChats: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Chat",
        required: true,
      },
    ],
    groupChats: [
      {
        type: mongoose.Types.ObjectId,
        ref: "GroupChat",
        required: true,
      },
    ],
    device: {
      type: deviceSchema,
      default: null,
      validate: {
        validator: (v) => v === null || (v && typeof v === "object"),
        message: "If device is provided, it must be a valid object.",
      },
    },
  },
  { timestamps: true }
);

schema.statics = { findByEmail, findByIdWithFriends };
schema.methods = {
  generateAuthToken,
  getLoginData,
  addDevice,
};

exports.User = mongoose.model("User", schema);
