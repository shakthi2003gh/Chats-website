const _ = require("lodash");
const jwt = require("jsonwebtoken");
const UAParser = require("ua-parser-js");
const { Message } = require("./message");
const { getChats, getGroupChats } = require("../helper/chat");
const { transformMessage } = require("../helper/message.js");
const { getRandomNumbers } = require("../common/index.js");
const { emailOTP } = require("../services/email");

exports.findByEmail = function (email) {
  return this.findOne({ email });
};

exports.findByIdWithFriends = async function (user_id) {
  const { Chat } = require("./chat");
  const defaultNotSelect = "-password -createdAt -updatedAt -__v";

  const user = await this.findById(user_id).select(defaultNotSelect);
  if (!user) return {};

  const find = { _id: { $in: user.personalChats } };
  const chats = await Chat.find(find).select("members");

  const friends = chats.reduce((friends, chat) => {
    const chat_id = chat._id;
    const friend_id = chat.members.filter((id) => id.toString() !== user_id)[0];

    friends[friend_id] = { chat_id };
    return friends;
  }, {});

  return { user, friends };
};

exports.send = async function () {
  this.OTP = getRandomNumbers();

  await emailOTP(this.email, this.OTP);
};

exports.resendOTP = async function (email) {
  const OTP = getRandomNumbers();

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
  const { _id, device } = this;
  const payload = { _id, device_id: device._id };

  return jwt.sign(payload, process.env.JWT_KEY);
};

exports.addMessage = async function ({ user_id, ...data }) {
  const message = new Message({ chat: this.id, ...data });
  this.messages.push(message._id);

  await message.save();
  await this.save();

  const populate = { path: "author", select: "_id image name" };
  const newMessage = await Message.findById(message._id)
    .populate(populate)
    .select("_id text image author readReceipt createdAt")
    .lean();

  return transformMessage(user_id)(newMessage);
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

exports.getLoginData = async function () {
  const pick = ["_id", "name", "email", "image", "about"];
  const user = _.pick(this, pick);
  const personal = await getChats(this.personalChats, this._id);
  const group = await getGroupChats(this.groupChats, this._id);

  const chat = { personal, group };
  return { user, chat };
};

exports.addDevice = async function (userAgent) {
  const agent = new UAParser(userAgent);
  const { device, browser } = agent.getResult();

  this.device = {};
  this.device._id = getRandomNumbers(10);
  this.device.label = device.type || browser.name + " - Browser" || "desktop";
  this.device.lastUsed = Date.now();
  this.device.isOnline = true;

  await this.save();

  return this.device._id;
};

exports.getMembersCount = async function (chat_id) {
  if (!chat_id) return null;

  const chat = await this.findById(chat_id);
  if (!chat) return null;

  return chat?.members?.length - 1 || 0;
};
