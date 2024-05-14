const jwt = require("jsonwebtoken");
const { generateOTP } = require("../common/generateOTP");
const { emailOTP } = require("../services/email");

exports.findByEmail = function (email) {
  return this.findOne({ email });
};

exports.send = async function () {
  this.OTP = generateOTP();

  await emailOTP(this.email, this.OTP);
};

exports.checkExpired = async function () {
  const expireAt = 900000;
  const { updatedAt } = this;
  const now = new Date(Date.now());

  return now - updatedAt >= expireAt;
};

exports.deleteExpiredDoc = async function (doc) {
  if (!doc) return null;

  const isExpired = await doc.checkExpired();
  if (isExpired) await this.model.deleteOne({ _id: doc._id });
};

exports.generateAuthToken = async function () {
  const { _id } = this;
  const payload = { _id };

  return jwt.sign(payload, process.env.JWT_KEY);
};
