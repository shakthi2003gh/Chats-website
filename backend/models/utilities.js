const jwt = require("jsonwebtoken");
const { Message } = require("./message");
const { generateOTP } = require("../common/generateOTP");
const { emailOTP } = require("../services/email");

exports.findByEmail = function (email) {
  return this.findOne({ email });
};

exports.send = async function () {
  this.OTP = generateOTP();

  await emailOTP(this.email, this.OTP);
};

exports.resendOTP = async function (email) {
  const OTP = generateOTP();

  await this.findOneAndUpdate({ email }, { OTP });
  await emailOTP(email, OTP);
};

exports.isRecentlySendOTP = async function () {
  const oneMin = 60000;
  const { updatedAt } = this;
  const now = new Date(Date.now());

  return now - updatedAt < oneMin;
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

exports.addMessage = async function (data) {
  const message = new Message({ chat: this.id, ...data });
  this.messages.push(message._id);

  await message.save();
  await this.save();

  const populate = { path: "author", select: "_id image name" };

  return Message.findById(message._id)
    .populate(populate)
    .select("_id text image author readReceipt createdAt");
};

exports.createOne = async function (data) {
  const { User } = require("./user");
  const newChat = await this.create(data);

  const promises = newChat.members.map(async (user_id) => {
    const user = await User.findById(user_id);
    if (!user) return null;
    user.personalChats.push(newChat._id);

    return await user.save();
  });

  await Promise.all(promises);
  return newChat;
};
