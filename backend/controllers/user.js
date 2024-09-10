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

  static async otpResend(req, res) {
    const { error, value } = validate.otpResend(req.body);
    if (error) return Response.badPayload(res, error.details[0].message);

    const register = await Register.findByEmail(value.email);
    if (!register) return Response.userNotRegister(res);

    const isExpired = await register.checkExpired();
    if (isExpired) return Response.otpExpired(res);

    const isOTPSendRecent = await register.isRecentlySendOTP();
    if (isOTPSendRecent) return Response.otpSendRecently(res);

    await Register.resendOTP(register.email);
    Response.otpResend(res);
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

    const userData = jwt.decode(register.dataToken);
    const user = new User(userData);

    await user.addDevice(value.userAgent);
    await Register.deleteOne({ email: value.email });

    const token = await user.generateAuthToken();
    const data = await user.getLoginData();
    res.status(201).setHeader("Authorization", token).send(data);
  }

  static async login(req, res) {
    const { error, value } = validate.login(req.body);
    if (error) return Response.badPayload(res, error.details[0].message);

    const user = await User.findByEmail(value.email);
    if (!user) return Response.invalidCredential(res);

    const isVerified = await bcrypt.compare(value.password, user.password);
    if (!isVerified) return Response.invalidCredential(res);

    const authWithoutDevice = !(req.query.without === "device");
    if (authWithoutDevice && !!user.device)
      return Response.userAlreadyLoggedin(res, user.device);
    await user.addDevice(value.userAgent);

    const token = await user.generateAuthToken();
    const data = await user.getLoginData();
    res.setHeader("Authorization", token).send(data);
  }

  static async auth(req, res) {
    const user = req.user;
    const token = await user.generateAuthToken();
    const data = await user.getLoginData();

    res.setHeader("Authorization", token).send(data);
  }

  static async update(req, res) {
    const { error, value } = validate.update(req.body);
    if (error) return Response.badPayload(res, error.details[0].message);

    await User.findByIdAndUpdate(req.user._id, value);

    res.sendStatus(204);
  }
};
