const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Types.ObjectId,
      ref: "Chat",
    },
    image: {
      type: String,
      validate: {
        validator: function (image) {
          return image || this.text;
        },
        message: "Either image or text must be provided.",
      },
    },
    text: {
      type: String,
      maxLength: 1000,
      validate: {
        validator: function (text) {
          return (text && text.length > 0) || this.image;
        },
        message: "Either text or image must be provided.",
      },
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    readReceipt: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },
  },
  { timestamps: true }
);

exports.Message = mongoose.model("Message", schema);
