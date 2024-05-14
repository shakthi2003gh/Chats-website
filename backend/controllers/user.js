const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { Register } = require("../models/register");
const validate = require("../validators/user");
const Response = require("../response");

module.exports = class {
  static async register(req, res) {
    const { error, value } = validate.register(req.body);
    if (error) return Response.badPayload(res, error.details[0].message);

    const isExist = await User.findByEmail(value.email);
    if (isExist) return Response.userAlreadyExist(res);

    const isRegister = await Register.findByEmail(value.email);
    if (isRegister) {
      const isExpired = await isRegister.checkExpired();
      if (!isExpired) return Response.userAlreadyRegister(res);
    }

    const salt = await bcrypt.genSalt(10);
    value.password = await bcrypt.hash(value.password, salt);

    const dataToken = jwt.sign(value, process.env.JWT_KEY);
    const doc = { email: value.email, dataToken };

    const register = new Register(doc);
    await register.save();

    Response.otpSend(res);
  }
};
