const { transformMessages } = require("./message.js");

function getLastMessage(messages) {
  if (!messages) return {};

  return messages?.[messages?.length - 1 ?? 0] || {};
}

function transformPersonalChat(data) {
  const chat = JSON.parse(JSON.stringify(data));
  const receiver = chat.members[0];

  chat.user_id = receiver._id;
  chat.name = receiver.name;
  chat.email = receiver.email;
  chat.image = receiver.image;
  chat.about = receiver.about;
  chat.isOnline = receiver?.device?.isOnline || false;
  chat.lastMessage = getLastMessage(chat?.messages);

  delete chat.members;

  return chat;
}

function transformGroupChat(data) {
  const chat = JSON.parse(JSON.stringify(data));
  chat.lastMessage = getLastMessage(chat?.messages);

  return chat;
}

async function getChats(chats_ids, user_id) {
  const { Chat } = require("../models/chat");

  const find = { _id: { $in: chats_ids } };
  const select = "-updatedAt -createdAt -__v";
  const populate = [
    {
      path: "members",
      select: "name email image about device.isOnline",
      match: { _id: { $ne: user_id } },
    },
    {
      path: "messages",
      select: "_id text image author readReceipt createdAt",
      populate: { path: "author", select: "_id image name" },
    },
  ];

  const chats = await Chat.find(find).populate(populate).select(select).lean();

  if (user_id)
    return chats.map(transformMessages(user_id)).map(transformPersonalChat);
  return chats.map(transformPersonalChat);
}

async function getGroupChats(chats_ids, user_id) {
  const { Group } = require("../models/group.js");

  const find = { _id: { $in: chats_ids } };
  const select = "-updatedAt -__v";
  const populate = [
    {
      path: "members",
      select: "name email image about device.isOnline",
    },
    {
      path: "messages",
      select: "_id text image author readReceipt createdAt",
      populate: { path: "author", select: "_id image name" },
    },
  ];

  const groupChats = await Group.find(find)
    .populate(populate)
    .select(select)
    .lean();

  if (user_id)
    return groupChats.map(transformMessages(user_id)).map(transformGroupChat);
  return groupChats.map(transformGroupChat);
}

async function storePersonalMessage(params, user_id) {
  const { Chat } = require("../models/chat");
  const { chat_id, receiver_id, author_id: author, text, image } = params;

  const find = {
    members: { $all: [receiver_id, author] },
    $expr: { $eq: [{ $size: "$members" }, 2] },
  };
  const chat =
    (chat_id && (await Chat.findById(chat_id))) ||
    (await Chat.findOne(find)) ||
    (await Chat.createOne({ members: [receiver_id, author] }));

  const isNewChat = chat.createdAt === chat.updatedAt;

  const message = await chat.addMessage({ user_id, text, image, author });
  const data = { chat_id: chat._id, message };
  const filter = (id) => id.toString() !== author;
  const receiver = receiver_id || chat.members.filter(filter)[0].toString();

  if (!isNewChat)
    return { data, echoData: { ...data }, receiver_ids: [receiver] };

  const newChat = (await getChats([chat._id], receiver))[0];
  const echoData = (await getChats([chat._id], author))[0];

  return { data: newChat, receiver_ids: [receiver], isNewChat: true, echoData };
}

async function storeGroupMessage(params, user_id) {
  const { Group } = require("../models/group.js");
  const { chat_id, author_id: author, text, image } = params;

  const group = chat_id && (await Group.findById(chat_id));
  if (!group) return { error: "Group not found" };

  const message = await group.addMessage({ user_id, text, image, author });
  const data = { chatType: "group-chat", chat_id: group._id, message };
  const filter = (id) => id.toString() !== author;
  const receiver_ids = group.members.filter(filter).map(String);

  return { data, echoData: { ...data }, receiver_ids };
}

function storeMessage({ user_id, chatType = "personal-chat", message }) {
  if (chatType === "group-chat") return storeGroupMessage(message, user_id);

  return storePersonalMessage(message, user_id);
}

module.exports = { getChats, getGroupChats, storeMessage };
