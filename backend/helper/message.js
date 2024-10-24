const { Message } = require("../models/message");

function transformMessage(user_id) {
  return (message) => {
    const isOwnMessage = String(message.author?._id) === String(user_id);
    const filterUser = (user) => String(user.user_id) === String(user_id);
    const userReadReceipt = (message.readReceipt?.users || []).find(filterUser);
    const readReceipt = isOwnMessage
      ? message.readReceipt.status
      : userReadReceipt?.status;

    return { ...message, readReceipt };
  };
}

function transformMessages(user_id) {
  return (chat) => ({
    ...chat,
    messages: chat.messages.map(transformMessage(user_id)),
  });
}

function getStatusCount(users = [], search) {
  return users?.filter(({ status }) => status === search)?.length || 0;
}

function checkMainStatus(readReceipt, totalMembersCount = 0) {
  const statusOptions = ["delivered", "seen"];
  const { status, users } = readReceipt || {};

  const totalSeenCount = getStatusCount(users, statusOptions[1]);
  const totalDeliveredCount = getStatusCount(users, statusOptions[0]);

  if (totalSeenCount === totalMembersCount) return statusOptions[1];
  if (totalMembersCount / 2 <= totalDeliveredCount) return statusOptions[0];
  return status || "sent";
}

async function updateReadReceipt({ chatType, user_id, message_id, status }) {
  const { Chat: personalChat } = require("../models/chat");
  const { Group } = require("../models/group");

  const message = await Message.findById(message_id);
  if (!message) return;

  const { chat: chat_id, readReceipt, author } = message;
  const { status: currentStatus, users } = readReceipt || {};

  const author_id = author.toString();
  const isOwnMessage = author_id === user_id;
  if (isOwnMessage) return {};

  const find = (receipt) => receipt.user_id.toString() === user_id;
  const index = users.findIndex(find);
  if (users[index]?.status === status) return {};

  if (index < 0) users.push({ user_id, status });
  else users[index].status = status;

  const Chat = chatType === "group-chat" ? Group : personalChat;
  const totalMembers = await Chat.getMembersCount(chat_id);
  const receipt = { status: currentStatus, users };
  const mainStatus = checkMainStatus(receipt, totalMembers);

  message.readReceipt = { status: mainStatus, users };
  await message.save();

  if (mainStatus === currentStatus) return {};
  return { chatType, chat_id, author_id, message_id, status: mainStatus };
}

module.exports = { transformMessage, transformMessages, updateReadReceipt };
