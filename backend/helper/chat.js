function getLastMessage(messages) {
  if (!messages) return {};

  return messages?.[messages?.length - 1 ?? 0] || {};
}

function transform(data) {
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
  delete chat.__v;

  return chat;
}

async function getChats(chats_ids, user_id) {
  const { Chat } = require("../models/chat");

  const find = { _id: { $in: chats_ids } };
  const select = "-updatedAt -createdAt";
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

  const chats = await Chat.find(find).populate(populate).select(select);
  return chats.map(transform);
}

async function storeMessage({ chat_id, receiver_id, author_id, text, image }) {
  const { Chat } = require("../models/chat");

  const find = {
    members: { $all: [receiver_id, author_id] },
    $expr: { $eq: [{ $size: "$members" }, 2] },
  };
  const chat =
    (chat_id && (await Chat.findById(chat_id))) ||
    (await Chat.findOne(find)) ||
    (await Chat.createOne({ members: [receiver_id, author_id] }));

  const isNewChat = chat.createdAt === chat.updatedAt;

  const message = await chat.addMessage({ text, image, author: author_id });
  const data = { chat_id: chat._id, message };
  const filter = (id) => id.toString() !== author_id;
  const receiver = receiver_id || chat.members.filter(filter)[0].toString();

  if (!isNewChat) return { data, echoData: { ...data }, receiver_id: receiver };

  const newChat = (await getChats([chat._id], receiver))[0];
  const echoData = (await getChats([chat._id], author_id))[0];

  return { data: newChat, receiver_id: receiver, isNewChat: true, echoData };
}

module.exports = { getChats, storeMessage };
