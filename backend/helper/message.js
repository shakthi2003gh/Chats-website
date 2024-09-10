const { Message } = require("../models/message");

async function updateReadReceipt({ user_id, message_id, status }) {
  const message = await Message.findById(message_id);
  if (!message) return;

  const { chat, readReceipt, author } = message;

  const author_id = author.toString();
  if (author_id === user_id) return {};
  if (readReceipt === status) return {};

  message.readReceipt = status;
  await message.save();

  return { chat_id: chat, author_id, message_id, status };
}

module.exports = { updateReadReceipt };
