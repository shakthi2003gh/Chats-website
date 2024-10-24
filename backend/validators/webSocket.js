const Joi = require("joi");

module.exports = class {
  static message(payload) {
    const schema = {
      temp_id: Joi.string().required(),
      chat_id: Joi.string().hex().length(24).optional(),
      receiver_id: Joi.string().hex().length(24).optional(),
      image: Joi.string().optional(),
      text: Joi.string().min(1).max(1000).allow(null, "").optional(),
    };

    return Joi.object(schema)
      .label("message")
      .xor("chat_id", "receiver_id")
      .or("text", "image")
      .validate(payload);
  }

  static readReceipt(payload) {
    const schema = {
      chatType: Joi.string().required().valid("personal-chat", "group-chat"),
      message_id: Joi.string().hex().length(24).required(),
      status: Joi.string().required().valid("delivered", "seen"),
    };

    return Joi.object(schema).validate(payload);
  }

  static createGroup(payload) {
    const schema = {
      image: Joi.string(),
      name: Joi.string().required().min(3).max(50),
      about: Joi.string().allow("").min(3).max(500),
      members: Joi.array()
        .items(Joi.string().hex().length(24))
        .min(2)
        .max(30)
        .required(),
    };

    return Joi.object(schema).validate(payload);
  }
};
