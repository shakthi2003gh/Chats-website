const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { Register } = require("../models/register");
const validate = require("../validators/user");
const Response = require("../response");

const defaultSelect = "-password -createdAt -updatedAt -__v";

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

  static async verify(req, res) {
    const { error, value } = validate.verify(req.body);
    if (error) return Response.badPayload(res, error.details[0].message);

    const isExist = await User.findByEmail(value.email);
    if (isExist) return Response.userAlreadyVerified(res);

    const register = await Register.findByEmail(value.email);
    if (!register) return Response.userNotRegister(res, value.email);

    const isExpired = await register.checkExpired();
    if (isExpired) return Response.otpExpired(res);

    const isVerifiedOTP = register.OTP === value.OTP;
    if (!isVerifiedOTP) return Response.invalidOTP(res);

    const data = jwt.decode(register.dataToken);
    const user = new User(data);

    await user.save();
    await Register.deleteOne({ email: value.email });

    const newUser = await User.findById(user._id).select(defaultSelect);
    const token = await newUser.generateAuthToken();

    res.status(201).setHeader("Authorization", token).send(newUser);
  }
};
