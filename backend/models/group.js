const mongoose = require("mongoose");
const { addMessage, getMembersCount } = require("./utilities");

const schema = new mongoose.Schema(
  {
    image: String,
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    about: {
      type: String,
      maxLength: 500,
      validate: {
        validator: function (value) {
          return value === "" || value.length >= 3;
        },
        message:
          'The "about" field must be at least 3 characters long if provided.',
      },
    },
    admin: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    members: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
      ],
      validate: [
        {
          validator: (value) => value.length >= 2,
          message: "There must be at least 2 members.",
        },
        {
          validator: (value) => value.length <= 30,
          message: "There must be no more than 30 members.",
        },
      ],
    },
    messages: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Message",
      },
    ],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

schema.pre("save", function (next) {
  if (!this.isNew) return next();

  if (!this.about)
    this.about = `Welcome to ${this.name}! Share ideas and enjoy the chat!`;

  if (this.admin.indexOf(this.createdBy) === -1)
    this.admin.push(this.createdBy);

  next();
});

schema.methods = { addMessage };
schema.statics = { getMembersCount };

exports.Group = mongoose.model("GroupChat", schema);
