const mongoose = require("mongoose");
const { addMessage, createOne } = require("./utilities");

const schema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

schema.methods = { addMessage };
schema.statics = { createOne };

exports.Chat = mongoose.model("Chat", schema);
