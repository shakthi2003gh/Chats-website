const Joi = require("joi");

const option = { tlds: false };
const Schema = {
  name: Joi.string().required().min(3).max(20),
  email: Joi.string().email(option).required().min(3).max(40),
  password: Joi.string().required().min(3).max(20),
  OTP: Joi.string().required().length(4),
};

module.exports = class {
  static register(payload) {
    const schema = {
      name: Schema.name,
      email: Schema.email,
      password: Schema.password,
    };

    return Joi.object(schema).validate(payload);
  }

  static otpResend(payload) {
    const schema = {
      email: Schema.email,
    };

    return Joi.object(schema).validate(payload);
  }

  static verify(payload) {
    const schema = {
      email: Schema.email,
      OTP: Joi.string().required().length(4),
    };

    return Joi.object(schema).validate(payload);
  }

  static login(payload) {
    const schema = {
      email: Schema.email,
      password: Schema.password,
    };

    return Joi.object(schema).validate(payload);
  }
};
